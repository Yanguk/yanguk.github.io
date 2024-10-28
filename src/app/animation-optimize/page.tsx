import { Button } from "@/components/ui/button";
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyInlineCode,
  TypographyP,
  TypographySmall,
  TypographyUl,
} from "@/components/ui/typography";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="p-2">
      <TypographyH1>Web 애니메이션 최적화 회고록</TypographyH1>

      <br />

      <TypographyH2>웹 렌더링 작동 방식</TypographyH2>

      <TypographyP>
        {`JavaScript > Style > Layout > Paint > Composite`}
      </TypographyP>

      <TypographyUl>
        <li>리플로우</li>
        <TypographyUl>
          <li>let, top, ...</li>
        </TypographyUl>

        <li>리페인팅</li>
        <TypographyUl>
          <li>bgColor, ...</li>
        </TypographyUl>

        <li>Reflow Repaint 둘다 건너뛰는 속성</li>
        <TypographyUl>
          <li>transform</li>
        </TypographyUl>

        <li>주의 해야할 속성</li>
        <TypographyUl>
          <li>
            offsetTop, ... (최신 위치를 가져오기위해 읽기가 큐에 들어가게됨.)
          </li>
        </TypographyUl>
      </TypographyUl>

      <br />

      <TypographyH2>애니메이션 효과 주는법</TypographyH2>

      <br />

      <TypographyH3>CSS</TypographyH3>
      <TypographyBlockquote>
        CSS 는 Bezier Curve 애니메이션, duration, curve
      </TypographyBlockquote>
      <TypographyUl>
        <li>transition</li>
        <li>keyframe animation</li>
      </TypographyUl>

      <br />

      <TypographyH3>JS</TypographyH3>
      <TypographyBlockquote>
        좀더 자연스러운 물리엔진이 적용된 Spring 애니메이션 사용 가능
      </TypographyBlockquote>
      <TypographyUl>
        <li>setInterval (옛날 방식)</li>
        <li>requestAnimationFrame</li>
        <TypographySmall>
          <TypographyInlineCode>
            P580에서 성능이 안나오는 것 같음
          </TypographyInlineCode>
        </TypographySmall>
        <TypographyBlockquote>
          <p>최신 애니메이션 라이브러리에서 사용하는 방식</p>
          <p>framer-motion, react-spring, embla-carousel</p>
        </TypographyBlockquote>
      </TypographyUl>

      <br />

      <TypographyH2>다른 방법</TypographyH2>

      <br />

      <TypographyH3>WebGL</TypographyH3>
      <TypographyUl>
        <li>pixijs</li>
      </TypographyUl>

      <Button asChild>
        <Link href={"/animation-optimize/page/1"}>{"next >"}</Link>
      </Button>
    </div>
  );
}
