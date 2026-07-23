---
title: hono rpc, typesafe하게 사용하기-1
publishedAt: 2026-01-21
public: false
---

회사에서 새로운 프로젝트 개발시 서버 http 프레임워크를 [hono](https://hono.dev/)로 사용하게 되었다.

hono는 rpc처럼 사용할수있게 타입추론도 지원이 된다.
다만 심플하게만 되어있어서 사용하기엔 커스텀이 필요하다.

## hono에서 rpc 기능 사용법

[hono-guides-docs](https://hono.dev/docs/guides/rpc)에 잘 안내 되어있다.

### Server

```ts
const app = new Hono().post(...).get(...);

export AppType = typeof app
```

서버에서는 타입추론이 가능하게 app을 체이닝을하여서 만들기만 하면 된다.

### Client

```ts
const client = hc<AppType>("http://localhost:3000/");

const res = await client.posts.$post({
  json: {
    title: "Hello yanguk",
    body: "goodbye",
  },
});

// fetch와 동일하게 statusCode 200 ~ 300 으로 판단된다
if (res.ok) {
  const data = await res.json();
  console.log(data.message);
}
```

## 문제점

- 호노는 에러 타입을 추론해주지 않는다.
  - 이전 프로젝트에서 `trpc`를 썼을땐 에러 타입도 같이 잡혔는데, 여기선 에러 응답을 어떻게 하는지는 자유라서 당연한 것일 수도 있다.

- 위 케이스로 인하여, 클라이언트에서 받는 결과값은 성공케이스 타입만 존재하게 된다.

```ts
const res = await client.posts.$post({
  json: {
    title: "Hello yanguk",
    body: "goodbye",
  },
});

/**
 * 해당 api에서 json으로 `{ result: 'ok' }`을 내려준 케이스의 응답 타입이다.
 *
 * ClientResponse<{ result: 'ok' }, 200, "json">
 *
 * 여기선 무조건 200의 타입만 잡히기의 res.ok의 타입도 boolean이 아닌 true로 나옴.
 *
 * but 사실 실제 상황에선
 * InternalServerError도 나올수가 있음. (공통 에러 핸들러로 부터...)
 */
type ResType = typeof res;

/**
 * { result: 'ok' } 값이 담김.
 */
const data = await res.json();
```

> express 썼을때 처럼 직접 에러 처리 부분을 개발해야된다.
> trpc 쓰면 이런 모듈 개발 없이 서비스 개발에 만 집중할 수 있었는데, hono에서는 좀 아쉬운 부분이다.

## 해결하기

### Server

1. 에러의 공통 포멧을 위하여 커스텀 에러 만들기
   > [hono-exception](https://hono.dev/docs/api/exception) 처럼 이미 지원되는게 있지만, 필자는 커스텀 해서 사용하였음.
   > 밑에 예제 코드에서의 Yu는 yanguk을 줄여서 prefix로 붙힘

```ts
// server/lib/error.ts
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export const YuErrorCodes = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
  ...,
} as const

export type YuErrorCode = keyof typeof YuErrorCodes

export type YuErrorOptions<T> = {
	code: T
	message?: string
}

export type YuErrorJson = {
	code: YuErrorCode
	message: string
}

/**
 * Yanguk 커스텀에러
 */
export class YuError extends Error {
	public code: YuErrorCode
	public statusCode: ContentfulStatusCode

	constructor({ code, message }: YuErrorOptions<YuErrorCode>) {
		super(message ?? code)
		this.name = 'YuError'
		this.code = code
		this.statusCode = YuErrorCodes[code]
	}

	toJSON(): YuErrorJson {
		return {
			code: this.code,
			message: this.message,
		}
	}
}

export const NotFund = new YuError({
	code: 'NOT_FOUND',
	message: 'Not found',
})

export const InternalServerError = new YuError({
	code: 'INTERNAL_SERVER_ERROR',
	message: 'Something went wrong.',
})
```

2. 공통 에러 처리하기

```ts
app.onError((err, c) => {
  logger.error({ err });

  if (err instanceof YuError) {
    return c.json(err.toJSON(), err.statusCode);
  }

  return c.json(InternalServerError.toJSON(), InternalServerError.statusCode);
});
```

이렇게 해서 서비스로직에서는 `YuError`로 throw 해주면
받아서 처리하고, 그외에 에러들은 `InternalServerError`로 내려준다.

이러면 에러응답은 json 값으로, 항상 같은 타입을 띄게된다. (`YuErrorJson`)

### Client

1. Client 에러 객체 정의하기

```ts
type YuClientCode = YuErrorCode | "REQUEST_FAILED";

type YuClientErrorJson = {
  code: YuClientCode;
  message: string;
};

export class YuClientErr extends Error {
  public code: YuClientCode;

  constructor({ code, message }: YuErrorOptions<YuClientCode>) {
    super(message ?? code);
    this.name = "YuClientErr";
    this.code = code;
  }
}

export const isYuClientErr = (err: unknown): err is YuClientErr =>
  err instanceof YuClientErr;
```

클라이언트에서는 api 호출시 요청실패 타입도 존재하기에
서버 에러에서 확장하여 작성한다.

2. `callRpc`, 응답 실패 구분하여 타입 제네릭 넣어주기

```ts
export type { ClientResponse } from "hono/client";

export const callRpc = async <T>(
  rpc: Promise<ClientResponse<T>>,
): Promise<{ ok: true; data: T } | { ok: false; data: YuClientErrorJson }> => {
  try {
    const data = await rpc;

    if (!data.ok) {
      const res = (await data.json()) as YuClientErrorJson;

      return { ok: false, data: res };
    }

    const res = await data.json();

    return { ok: true, data: res as T };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to process the request.";

    return {
      ok: false,
      data: {
        code: "REQUEST_FAILED",
        message,
      },
    };
  }
};
```

rpc요청에선 성공응답 타입은 얻을 수 있으니까,
성공했을땐 해당 타입을 리턴하고, 실패한경우 위에서 정의한 커스텀 에러 형태의 포멧으로 리턴해준다.

여기선 에러응답도 json으로 받은 값으로 그대로 사용하였다.

결과 받아서 분기하여 타입추론을 돕기위해 `{ ok: boolean }` 값을 추가해준다.

3. `callRpcOrThrow`, 에러일때 throw 하는 형태로 한번더 구현체 만들기

```ts
export const callRpcOrThrow = async <T>(
  rpc: Promise<ClientResponse<T>>,
): Promise<T> => {
  const res = await callRpc(rpc);

  if (!res.ok) {
    throw new YuClientErr({
      code: res.data.code,
      message: res.data.message,
    });
  }

  return res.data;
};
```

4. 에러 핸들링 하는부분 타입세이프하게 처리하도록하기

```tsx
export const isYuClientErr = (err: unknown): err is YuClientErr =>
  err instanceof YuClientErr;

export const handleYuClientErrOrThrow =
  <T extends (e: YuClientErr) => void>(handler: T) =>
  (err: Error) => {
    if (isYuClientErr(err)) {
      handler(err);

      return;
    }

    // 코드가 잘못되서 런타임에러 말고는 도달 불가능한 케이스
    console.error("Unreachable error: ", err);

    throw err;
  };
```

5. 실제사용, tanstack-query랑 같이쓰기

실무에 적용시킨 예제 코드를 가져와봤다.

```ts
const loginMutation = useMutation({
  mutationFn: (account: string, pwd: string) =>
    callRpcOrThrow(
      client.auth.login.$put({
        json: { account, pwd },
      }),
    ),
  onSuccess: () => {
    void navigate({ to: "/dashboard" });
  },
  onError: handleYuClientErrOrThrow((err) => {
    if (err.code === "INTERNAL_SERVER_ERROR") {
      console.error("something wrong");
    }
  }),
});
```

## 마무리

tanstack-query랑 연계해서 하는방식이 아쉬운데,
~~trpc를 참고하여서 추후 개발해야겠다. ([개발 진행중](https://github.com/Yanguk/hono-tanstack-query))~~

> 다음 [포스팅](/blog/8-hono-rpc-client-2) 에서 ky랑 같이 쓰는 방법을 찾아서, 따로 개발할 필요 없을 듯하다

```ts
// trpc 사용예제
trpc.posts.mutationOptions({
  onSucess: ...,
  onError: ...,
})
```

참고로 메소드로 값을 받고 추론해서 하는 방식을 할려면
Proxy 객체를 써야 하는데 그 구현체는 아래에서 확인할 수 있다.

[hono-rpc-query](https://github.com/kedom1337/hono-rpc-query/blob/master/src/client.ts)

> ~~hono-rpc-query패키지는 에러 케이스를 다룰수가 없어서 아쉬운 부분이있다.~~
> 다른 페칭 라이브러리랑 같이 사용하면 문제없음.
