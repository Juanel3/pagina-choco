"use client";

import { useEffect, useRef, useState } from "react";
import { BAG_ANIMATION_FRAMES } from "@/lib/animation-frames";

const SCROLL_SECTION_VH = 200;

export function BagScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    BAG_ANIMATION_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateOnScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;

      if (scrollable <= 0) {
        setFrameIndex(0);
        return;
      }

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.min(
        BAG_ANIMATION_FRAMES.length - 1,
        Math.floor(progress * BAG_ANIMATION_FRAMES.length),
      );
      setFrameIndex(index);
    };

    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateOnScroll);

    return () => {
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateOnScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="chocho-hero-flow relative"
      style={{ height: `${SCROLL_SECTION_VH}vh` }}
      aria-label="Animación de la mochila al hacer scroll"
    >
      <div className="relative sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-transparent px-4 pt-[6.5rem] sm:pt-20">
        <div className="chocho-hero-blur-veil pointer-events-none absolute inset-0 z-0" aria-hidden />

        {/* Móvil */}
        <div className="absolute inset-x-0 bottom-0 top-[7rem] z-10 sm:hidden">
          <div className="absolute left-1/2 top-[18%] w-screen max-w-none origin-center -translate-x-[calc(50%+0.875rem)] scale-[1.48] px-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BAG_ANIMATION_FRAMES[frameIndex]}
              alt={`Chochomanía, fotograma ${frameIndex + 1} de ${BAG_ANIMATION_FRAMES.length}`}
              className="block h-auto max-h-[88vh] w-full object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
              draggable={false}
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="relative z-10 hidden h-full w-full items-center justify-center sm:flex sm:translate-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BAG_ANIMATION_FRAMES[frameIndex]}
            alt={`Chochomanía, fotograma ${frameIndex + 1} de ${BAG_ANIMATION_FRAMES.length}`}
            className="h-auto w-full max-h-[min(85vh,720px)] max-w-4xl object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] sm:max-w-5xl"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
