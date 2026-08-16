---
title: TypeScript, 타입 레벨 프로그래밍
publishedAt: 2026-08-16
public: true
---

> 2년 전 회사에서 발표한 내용인데 포스팅해 본다.

나에게는 TypeScript에서 제네릭을 활용한 완벽한 타입 추론에 대해 흥미가 있었던 시절이 있었다. 그때 공부했던 내용이다.

타입스크립트에서 코드 레벨이 아닌 타입 레벨에서의 코딩 방법을 알아보자.

## 목차

## TypeScript에 대해서, 서론

`javascript`의 슈퍼셋으로 나온 언어이다.
다들 javascript에서 타입이 없기에 타입스크립트를 적용하게 되면 완벽한 프로그래밍을 할 수 있을 거라 생각을 할 텐데 대부분은 `Generics`를 마주하게 되면서 좌절을 겪으며 `any` 타입 도배로 코드를 작성하게 된다.

그러면 타입스크립트를 사용하는 이유가 없어지는 것 같이 보이게 된다.

사실 any가 나쁜 건 아닌데, 이와 관련된 조롱 밈도 많이 돌아다닌다.

<img src="/type-programing/generic.png" width="400" alt="제네릭 좌절">

## 타입스크립트는 완전 튜링하다

> #### 튜링 머신이란?
>
> 수학자 앨런 튜링이 1936년에 제시한 개념으로 계산하는 기계의 일반적인 개념을 설명하기 위
> 한 가상의 기계이며 오토마타의 일종이다

튜링하다는 증명은 [TS_issues_14833](https://github.com/microsoft/TypeScript/issues/14833)에 설명되어 있다.

우리가 알 수 있는 내용은 아무튼 TS의 타입 시스템은 완전 튜링하니,
타입 시스템 자체를 하나의 프로그래밍 언어처럼 사용할 수 있을 정도로 강력하다고 볼 수 있다.

이제부터는 실제로 제네릭과 조건부 타입 등을 이용해 타입 레벨에서 어떻게 프로그래밍할 수 있는지 살펴보자.

## 제네릭과 조건문, 반복문

### 제네릭 (Generics)

제네릭은 선언 시점이 아니라 생성 시점에 타입을 명시하여 하나의 타입만이 아닌 다양한 타입을
사용할 수 있도록 하는 기법이다.

```ts
type A<T> = T;
type B = A<number>; // number
type C = A<string>; // string
```

제네릭으로 선언된 A를 함수처럼 인자로 타입을 받아서 어떤 타입이 될지를 정할 수가 있다.

### 조건문

그렇다면 타입 레벨에서의 조건문은 어떻게 사용하는지 보자.
여기서 주요 키워드는 `extends` 이다.

```ts
type User {
  name: string;
  email: string;
}

type IsHasField<T, FieldName extends string> = FieldName extends keyof T
  ? true
  : false;

type HasEmailField<T> = IsHasField<T,'email'>
type UseHasEmailField = HasEmailField<User> // true
```

해당 키워드의 역할은 3가지가 있다.

1. 조건문 역할 (if)
2. 타입 제한
3. 타입 확장

예시에서는 if 문의 조건문 역할을 수행하여서 FieldName에 있는 키일 경우 true로 타입이 추론되게 되어있다.

### 반복문

타입 시스템에서는 for문이나 while문 같은 문법이 없다. 다만 재귀는 가능하여서 재귀로 반복문을 수행해야 한다.

여기서 중요 키워드는 `infer` (타입 변수 할당) 이다.

```ts
type IsAllNumber<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? First extends number
    ? IsAllNumber<Rest>
    : false
  : true;

type A = IsAllNumber<[1, 2, 3]>; // true
type B = IsAllNumber<[1, 2, "knowre"]>; // false
```

위 예시를 보면 `extends`와 `infer`를 사용하여서 첫 번째 요소를 변수에 할당한 이후에 그 값이 number인지 비교를 하고, 맞으면 나머지 요소들을 다시 재귀로 돌려주면서 다음 요소를 순회하고 있다.

`infer`로 요소 하나를 판별하고 나머지 요소로 재귀를 돌림으로써 반복문을 수행하는 것이다.

## Currying의 타입 구현하기

위 내용을 바탕으로 Currying 타입을 구현해보자.
이걸 할 수 있으면 웬만한 타입은 다 만들 수 있을 것이다.

```ts
/** Currying 이란..? */
function curry(fn) {
  return function curried(...params) {
    if (fn.length === params.length) {
      return fn(...params);
    }

    return curried.bind(this, ...params);
  };
}

const add = (a: number, b: number) => a + b;

const curriedAdd = curry(add);

const addFive = curriedAdd(5);

console.log(curriedAdd(2, 3)); // 5
console.log(curriedAdd(2)(4)); // 6
console.log(addFive(3)); // 8
```

일단 커링(Currying)에 대해서 설명하자면, 함수를 받아서 함수를 리턴하는데, 그 함수는 모든 파라미터가 다 전달된 시점에서 실행이 되게 하는 함수이다. 일부 파라미터만 전달하게 되면 다시 함수를 리턴한다.

함수의 실행 시점을 뒤로 미룰 수가 있어서 함수형 프로그래밍에서는 필수적으로 사용하게 된다.

이걸 타입으로 구현한다면 `curriedAdd` 함수는 `함수 or number` 를 리턴하는 타입일 것이고, `addFive` 함수는 number를 리턴하는 함수 타입일 것이다.

본격적으로 구현하기 전에 다른 유틸 타입들을 먼저 살펴보자.

```ts
type AnyFn = (...params: any) => any;

type Parameters<T extends AnyFn> = T extends (...params: infer P) => any
  ? P
  : never;
// type A0 = Parameters<(a: string, b: number) => boolean>
// [a: string, b: number]

type ReturnType<T extends AnyFn> = T extends (...params: any[]) => infer R
  ? R
  : never;
// type A1 = ReturnType<() => 'returnType'>
// 'returnType'

type Head<T extends any[]> = T extends [infer First, ...any[]] ? First : never;
// type A2 = Head<[1, 2, 3, 4, 5]>
// 1

type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;
// type A3 = Tail<[1, 2, 3, 4, 5]>
// [2, 3, 4, 5]

type Length<T extends any[]> = T["length"];
// type A4 = Length<[1, 2, 3, 4, 5]>
// 5
```

타입 선언부 아래 주석에서 첫 번째 줄은 사용 예시이고, 두 번째 줄은 해당 타입의 모습이다.
천천히 읽어보면 이해가 될 것이다.

이제 본격적으로 커링을 만들어 볼 건데, 인자가 2개인 케이스부터 만들어보고 3개 이상인 케이스를 만들면서 커링을 완성 시킬 것이다.

### 인자가 2개인 케이스

대강 인터페이스가 어떻게 될지 생각해보자.

```ts
const add = (a: number, b: number) => a + b;

const curry = (() => {}) as Curry;

/**
 * 기대하는 타입 값
 * `((a, b) => a + b) & ((a) => (b) => a + b)`
 */
const curried = curry(add);

const addFive = curried(5); // (b: number) => a + b
const eight = curried(5, 3); // number
```

curried 된 함수 값은 두 가지 타입이 같이 존재할 것이다.

> ((a, b) => a + b) & ((a) => (b) => a + b)

일단 전달 받은 함수에서 리턴값과 파라미터값을 추출해내서 새로운 타입으로 만들어야 한다.

```ts
type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;
```

제네릭으로 받은 값에서 파라미터와 리턴값을 추출해내서 새로운 타입 Curried로 넘겨준다. 이제 Curried를 만들어보자.

```ts
type Curried<P extends any[], R> = P extends [infer Head, ...infer Rest]
  ? HasTail<P> extends true
    ? ((a: Head) => Curried<Rest, R>) & // 커링된 함수
        ((a: Head, ...b: Rest) => R) // 커링 없이 모든 인자 받아서 실행
    : (a: Head) => R // head 하나만 넘어옴
  : never;
```

넘겨 받은 파라미터값을 순회하면서 타입을 조합해 줘야 한다. 따라서 extends와 infer를 사용해 순회할 수 있는 준비를 하고, 무한 재귀가 되면 안 되니까 마지막 조건을 정의해 준다.
그것은 바로 파라미터를 모두 순회했을 때이다. 5번 줄의 `(a: Head) => R` 이 부분이다.

재귀는 `HasTail`로 마지막인지 판단하고, 두 개의 타입을 묶어서 만든다. (3, 4번 줄)

### 인자가 3개인 케이스

여기는 좀 더 어렵다. 순회하면서 모든 파라미터를 들고 가야 하면서, 마지막 지점을 알 수 있어야 한다.
인터페이스를 생각해보자.

```ts
const foo = (a: number, b: string, c: boolean) => true;

/**
 * 기대하는 타입값
 * (
 *   (a: number) => (
 *     (b: string) => (c: boolean) => boolean) &
 *     ((b: string, c: boolean) => boolean)
 *   )
 * ) &
 * ((a: number, b: string) => (c: boolean) => boolean) &
 * ((a: number, b: string, c: boolean) => boolean)
 */
const curriedFoo = curry(foo);

type Curry<Fn extends AnyFn> = Curried<Parameters<Fn>, ReturnType<Fn>>;
```

일단 앞의 Curry와 동일하게 해주고 새로운 Curried를 구현한다.

```ts
type Curried<
  P extends any[],
  R,
  PrevParams extends any[] = [], // 모든 params를 저장하기 위해서 앞전에 커링된 인자를 보관하기 위한 값
> = P extends [infer Head, ...infer Tail]
  ? HasTail<P> extends true
    ? ((...params: [...PrevParams, Head]) => Curried<Tail, R>) & // 커링된 함수를 리턴.
        Curried<Tail, R, [...PrevParams, Head]> // 커링 없이 실행한 함수 리턴
    : (...params: [...PrevParams, Head]) => R // Arg가 1개 남았을 경우 모든 Params를 넣어서 실행하는 함수
  : never;
```

앞에 인자 2개일 때와 다르게 제네릭을 하나 더 추가하여서 (4번 줄) 순회할 때 모든 파라미터를 끌고 간다.

그리고 그 뒤는 비슷하다. 마지막 부분(9번 줄)에는 모든 파라미터를 넣어서 실행하는 함수 리턴으로 마무리하고, 순회 부분에서는 두 가지 타입을 만들어서 리턴한다. (7~8번 줄)

커링 없이 실행한 함수는 모든 파라미터를 들고 마지막 지점까지 갈 수 있도록
`Curried<Tail, R, [...PrevParams, Head]>`(8번 줄)으로 만들어주고,

커링된 함수 부분은 값을 소비하고 나머지 파라미터값으로 새로운 커링 타입을 만든다.
`((...params: [...PrevParams, Head]) => Curried<Tail, R>)`(7번 줄)

## 마무리

이해가 안 된다면 넘어가도 좋다. 타입 레벨단 코딩은 가독성이 무척 안 좋기 때문에 이해하려고 노력할 필요는 없는 것 같다.

그리고 제네릭 잘 쓰면 좋긴 하다만, 너무 복잡해지는 경우가 있고 가독성도 매우 떨어진다. 실제 로직과는 아무 상관이 없는데 타입 프로그래밍만 주구장창 하고 있는 모습을 보면 뭐하고 있나 싶기도 하다.

제네릭을 적재적소에 잘 사용하면서 단순하고 심플하게 하는 게 좋을 것 같다. 비록 any를 쓰더라도.
