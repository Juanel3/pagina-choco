import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageHero } from "@/components/CatalogPageHero";
import { CatalogSection } from "@/components/CatalogSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Catálogo · Chochomanía Supplements",
  description:
    "Catálogo de proteínas y suplementos deportivos. Filtra por categoría y pide por WhatsApp o correo.",
};

export default function CatalogoPage() {
  return (
    <div className="flex min-h-full flex-col bg-black">
      <SiteHeader />
      <main className="flex-1">
        <CatalogPageHero />
        <Suspense fallback={null}>
          <CatalogSection variant="page" />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
