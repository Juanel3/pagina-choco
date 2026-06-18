export const HERO_FRAME_COUNT = 28;

const HERO_FRAME_OVERRIDES: Record<number, string> = {
  3: "/imagenehero/i3.webp",
  21: "/imagenehero/i21.webp",
};

export const BAG_ANIMATION_FRAMES = Array.from(
  { length: HERO_FRAME_COUNT },
  (_, i) => HERO_FRAME_OVERRIDES[i + 1] ?? `/imagenehero/${i + 1}.webp`,
);
