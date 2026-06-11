export const HERO_FRAME_COUNT = 28;

export const BAG_ANIMATION_FRAMES = Array.from(
  { length: HERO_FRAME_COUNT },
  (_, i) => `/imagenehero/${i + 1}.png`,
);
