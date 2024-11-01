"use client";

import Body from "@/app/animation-optimize/body";
import Header from "@/app/animation-optimize/header";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import DonggleSrc from "./donggle-home-1.webp";

export default function Page4() {
  return (
    <>
      <Header title={"React-spring"} />

      <Body className="flex space-x-3 h-full">
        <CustomDonggleAnimation />

        <SpringDonggleAnima />
      </Body>
    </>
  );
}

let down = false;
let left = false;

function Donggle() {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const m = ref.current;

    if (!m) {
      return;
    }

    const animate = () => {
      const pos = parseInt(m.style.top.slice(0, m.style.top.indexOf("px")));
      const leftPos = parseInt(
        m.style.left.slice(0, m.style.left.indexOf("px")),
      );

      const topPos = down ? pos + 1 : pos - 1;

      m.style.top = `${topPos}px`;

      if (topPos > 200) {
        down = false;
      }

      if (topPos < 0) {
        down = true;
      }

      if (leftPos > 200) {
        left = true
      }

      if (leftPos < 0) {
        left = false
      }

      m.style.left = left ? `${leftPos - 1}px` : `${leftPos + 1}px`;

      window.requestAnimationFrame(animate);
    };

    const ani = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(ani);
    };
  }, [ref]);

  return (
    <Image
      ref={ref}
      className="absolute"
      style={{ top: 0, left: 0 }}
      src={DonggleSrc}
      width={340 / 4}
      height={280 / 4}
      alt={"동그리"}
      priority
    />
  );
}

function CustomDonggleAnimation() {
  return (
    <div className="flex-1 h-full">
      <Donggle />
    </div>
  );
}

function SpringDonggleAnima() {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  const handleClick = () => {
    api.start({
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    });
  };

  return (
    <animated.div
      onClick={handleClick}
      className="flex-1 h-full"
      style={{
        width: 80,
        height: 80,
        background: "#ff6d6d",
        borderRadius: 8,
        ...springs,
      }}
    />
  );
}
