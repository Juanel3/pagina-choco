"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ZONE_MARGIN = "-80px 0px 0px 0px";

export function useNavOnBlackBackground() {
  const pathname = usePathname();
  const [onBlackBackground, setOnBlackBackground] = useState(false);

  useEffect(() => {
    setOnBlackBackground(false);

    const markers = document.querySelectorAll("[data-nav-black-bg]");
    if (markers.length === 0) return;

    const visibility = new Map<Element, boolean>();

    const sync = () => {
      setOnBlackBackground([...visibility.values()].some(Boolean));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting);
        }
        sync();
      },
      { rootMargin: NAV_ZONE_MARGIN, threshold: 0 },
    );

    markers.forEach((marker) => {
      visibility.set(marker, false);
      observer.observe(marker);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return onBlackBackground;
}
