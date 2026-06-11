import { PAGE_TITLE_MOBILE_TWO_LINES } from "@/lib/theme";

export function CatalogPageHero() {
  return (
    <div
      className="chocho-catalog-hero px-4 pb-20 pt-[9rem] sm:px-6 sm:pb-28 sm:pt-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1
          className={`text-4xl font-bold tracking-tight text-cream max-sm:text-2xl sm:text-5xl lg:text-6xl ${PAGE_TITLE_MOBILE_TWO_LINES}`}
        >
          Nuestros productos
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-cream/75 sm:text-lg">
          Explora suplementos por categoría. Toca un producto para ver sabores,
          precio y pedir.
        </p>
      </div>
    </div>
  );
}
