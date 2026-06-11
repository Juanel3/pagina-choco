"use client";

import { useEffect, useRef, useState } from "react";
import { BAG_ANIMATION_FRAMES } from "@/lib/animation-frames";

const SCROLL_SECTION_VH = 200;
const FRAME_COUNT = BAG_ANIMATION_FRAMES.length;

function progressToFrameIndex(progress: number): number {
  return Math.min(
    FRAME_COUNT - 1,
    Math.round(progress * (FRAME_COUNT - 1)),
  );
}

export function BagScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
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

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress =
        scrollable <= 0
          ? 0
          : Math.min(1, Math.max(0, -rect.top / scrollable));

      setFrameIndex(progressToFrameIndex(progress));
    };

    const scheduleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const imgClassName =
    "block h-auto w-full object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]";

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
              alt={`Chochomanía, fotograma ${frameIndex + 1} de ${FRAME_COUNT}`}
              className={`${imgClassName} max-h-[88vh]`}
              draggable={false}
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="relative z-10 hidden h-full w-full items-center justify-center sm:flex sm:translate-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BAG_ANIMATION_FRAMES[frameIndex]}
            alt={`Chochomanía, fotograma ${frameIndex + 1} de ${FRAME_COUNT}`}
            className={`${imgClassName} max-h-[min(85vh,720px)] max-w-4xl sm:max-w-5xl`}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
