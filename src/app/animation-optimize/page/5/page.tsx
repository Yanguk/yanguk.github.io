"use client";

import Body from "@/app/animation-optimize/body";
import Header from "@/app/animation-optimize/header";
import {
  TypographyBlockquote,
  TypographyH2,
  TypographyP,
  TypographyUl,
} from "@/components/ui/typography";
import Link from "next/link";
import React from "react";

export default function Page5() {
  return (
    <>
      <Header title={"리액트, nextjs, 웹 최적화 기법"} />

      <Body className="flex flex-col space-y-3 h-fit">
        <TypographyH2>App router 고질적인 문제</TypographyH2>
        <TypographyBlockquote>
          CSR 애플리케이션(예: 일반적인 React Vite 앱)에서는 다음과 같은
          (예상되는) UX를 구현할 수 있습니다. <br /> 탐색 링크를 클릭하세요{" "}
          {"->"} 해당 링크는 즉시 굵게 바뀌거나 다른 동작으로 동작을 반영합니다{" "}
          {"->"} URL이 새 경로로 업데이트됩니다 {"->"} 로딩 표시기가 나타납니다{" "}
          <br /> 위의 현상은 네트워크 연결 강도와 관계없이 발생합니다. <br />{" "}
          Next App Router SSR을 사용하면 사용자 동작을 인식하는 데 지연이
          발생하여 사이트가 깨지거나 응답하지 않는 것처럼 느껴집니다. <br/> 탐색 모음
          UI는 URL 상태를 반영하며 URL이 변경되는 데 3초가 걸립니다. 로딩
          스켈레톤도 서버에서 다운로드해야 하며 시간이 걸립니다
        </TypographyBlockquote>

        <TypographyUl>
          <li>
            <Link href="https://www.reddit.com/r/reactjs/comments/1cugfdd/nextjs_app_router_feel_fundamentally_broken_on/">
              https://www.reddit.com/r/reactjs/comments/1cugfdd/nextjs_app_router_feel_fundamentally_broken_on/
            </Link>
          </li>
          <li>
            대안책으론{" "}
            <Link href="https://github.com/TheSGJ/nextjs-toploader">
              TopLoader
            </Link>
          </li>
        </TypographyUl>

        <br />

        <TypographyH2>useTransition 훅</TypographyH2>

        <TypographyP>
          https://ko.react.dev/reference/react/useTransition
        </TypographyP>

        <br />

        <TypographyH2>웹 최적화</TypographyH2>
        <TypographyUl>
          <li>이미지는 png, jpg or webp (nextjs에서 빌드시에 webp로 변환함)</li>
          <li>gif 대신 mp4</li>
        </TypographyUl>

        <br />

        <TypographyH2>box shadow...</TypographyH2>
        <TypographyP>
          box shadow들어간 요소를 애니메이션 먹이면 느려짐...
          <br />

          box Shadow들어간 box는 png로 처리 하면 훨씬 빨라짐. css 보단 이미지로...
        </TypographyP>
      </Body>
    </>
  );
}
