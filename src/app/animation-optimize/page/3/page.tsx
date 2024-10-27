import Body from "@/app/animation-optimize/body";
import Header from "@/app/animation-optimize/header";
import React from "react";
import * as CustomCarousel from "@/components/carousel";
import { TypographyH2, TypographyH4 } from "@/components/ui/typography";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Page3() {
  return (
    <>
      <Header title={"Carousel 비교"} />

      <Body className="flex flex-col space-y-3 h-fit">
        <TypographyH2>embla-carousel</TypographyH2>

        <Carousel orientation="horizontal">
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="p-6 items-center flex flex-col">
                      <Image
                        width={350}
                        height={350}
                        priority
                        alt="photo"
                        src={`https://picsum.photos/id/${index}/300`}
                      />
                      <TypographyH4>Test!! {index}</TypographyH4>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-10" />
          <CarouselNext className="right-20" />
        </Carousel>

        <br />

        <TypographyH2>CSS</TypographyH2>

        <CustomCarousel.Root className="w-full">
          <CustomCarousel.Content>
            {Array.from({ length: 10 }).map((_, index) => (
              <CustomCarousel.Item key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="p-6 items-center flex flex-col">
                      <Image
                        width={350}
                        height={350}
                        priority
                        alt="photo"
                        src={`https://picsum.photos/id/${index}/300`}
                      />
                      <TypographyH4>Test!! {index}</TypographyH4>
                    </CardContent>
                  </Card>
                </div>
              </CustomCarousel.Item>
            ))}
          </CustomCarousel.Content>

          <CustomCarousel.Previous />
          <CustomCarousel.Next />
        </CustomCarousel.Root>
      </Body>
    </>
  );
}
