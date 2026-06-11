import { BagScrollAnimation } from "@/components/BagScrollAnimation";
import { BestSellersSection } from "@/components/BestSellersSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PAGE_TITLE_MOBILE_TWO_LINES } from "@/lib/theme";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <BagScrollAnimation />

        <section
          data-nav-black-bg
          className="relative z-10 -mt-64 px-6 pt-4 pb-10 sm:mt-0 sm:pt-0 sm:pb-12"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className={`text-3xl font-semibold text-cream max-sm:text-xl sm:text-4xl sm:leading-snug lg:text-5xl ${PAGE_TITLE_MOBILE_TWO_LINES}`}
            >
              Bienvenido a Chochomania Suplementos
            </h2>
            <p className="mt-6 text-base leading-relaxed text-cream/80 sm:text-lg">
              Explora nuestras categorías, selecciona tus favoritos y cotiza
              todo tu pedido de manera rápida y directa a través de WhatsApp.
            </p>
            <Link
              href="/catalogo"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[#dc2626] px-8 text-sm font-medium text-cream transition-colors hover:bg-[#b91c1c]"
            >
              Ver catálogo
            </Link>
          </div>
        </section>

        <BestSellersSection />
      </main>
      <SiteFooter />
    </div>
  );
}
