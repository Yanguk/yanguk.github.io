"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type CarouselContextProps = {
  curIdx: number;
  scrollNext: VoidFunction;
  scrollPrev: VoidFunction;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  setMaxIdx: Dispatch<SetStateAction<number>>;
};

const CarouselContext = createContext<CarouselContextProps | null>(null);

export const useCarousel = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useStep must be used within a <Step.Root />");
  }

  return context;
};

export function Root({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const [curIdx, setCurIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

  const canScrollPrev = curIdx > 0;
  const canScrollNext = curIdx < maxIdx;

  const scrollNext = () => {
    setCurIdx(curIdx + 1);
  };

  const scrollPrev = () => {
    setCurIdx(curIdx - 1);
  };

  return (
    <CarouselContext.Provider
      value={{
        curIdx,
        scrollNext,
        scrollPrev,
        canScrollNext,
        canScrollPrev,
        setMaxIdx: setMaxIdx,
      }}
    >
      <div className={cn(className, "overflow-x-hidden")}>{children}</div>
    </CarouselContext.Provider>
  );
}

export function Content({ children }: PropsWithChildren) {
  const { curIdx, setMaxIdx } = useCarousel();
  const childCount = React.Children.count(children);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMaxIdx(childCount - 1);
  }, [childCount, setMaxIdx]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const translateValue = -curIdx * (100 / childCount);
    ref.current.style.transform = `translateX(${translateValue}%)`;
  }, [childCount, curIdx, ref]);

  return (
    <div
      ref={ref}
      className="flex transition duration-500 ease-in-out"
      style={{
        width: `${100 * childCount}%`,
      }}
    >
      {children}
    </div>
  );
}

export function Item({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

export function Previous() {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button disabled={!canScrollPrev} onClick={scrollPrev}>
      {"<"}
    </Button>
  );
}

export function Next() {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button disabled={!canScrollNext} onClick={scrollNext}>
      {">"}
    </Button>
  );
}
