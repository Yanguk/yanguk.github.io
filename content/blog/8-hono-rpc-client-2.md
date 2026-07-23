---
title: hono rpc, typesafe하게 사용하기-2
publishedAt: 2026-01-25
public: false
---

이전글에서 좀더 나은 방향을 찾아서 코드만 작성해둔다.

ky를 같이 쓰고, hono-rpc-query까지 사용하는 방안이다.

> ky에서는 statusCode에 따라 에러도 throw 해준다.

```tsx
import { hcQuery } from "hono-rpc-query";
import ky from "ky";

const baseUrl =
  env.DEV && env.BASE_URL === "/" ? "http://localhost:3001" : env.BASE_URL;

const kyapi = ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        const { jwt } = useAuthStore.getState();

        if (jwt) {
          request.headers.set("Authorization", `Bearer ${jwt}`);
        }
      },
    ],
  },
});

const client = hcWithType(baseUrl, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    return kyapi(input, {
      timeout: 8000,
      method: requestInit?.method,
      headers: {
        "content-type": "application/json",
        ...requestInit?.headers,
      },
      body: requestInit?.body,
    });
  },
});

export const api = hcQuery(client);
```

- 에러 핸들링

```tsx
export const mapError = async (error: Error) => {
  if (error instanceof HTTPError) {
    try {
      const errJson: ServerErrorJson = await error.response.json();

      return {
        code: errJson.code,
        message: errJson.message,
        err: error,
      } as const;
    } catch (_err) {
      const err = _err as Error;

      return {
        code: "UN_KNOWN",
        message: err.message,
        err: err,
      } as const;
    }
  }

  if (error instanceof TimeoutError) {
    return {
      code: "TIME_OUT",
      message: error.message,
      err: error,
    } as const;
  }

  return {
    code: "UN_KNOWN",
    message: error.message,
    err: error,
  } as const;
};

export const handleApiError =
  (
    errHandler: (
      err: Awaited<ReturnType<typeof mapError>>,
    ) => void | Promise<void>,
  ) =>
  async (err: Error) =>
    errHandler(await mapError(err));
```
