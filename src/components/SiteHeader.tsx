"use client";

import { CartButton } from "@/components/CartButton";
import { NavSearch } from "@/components/NavSearch";
import { useNavOnBlackBackground } from "@/hooks/use-nav-on-black-background";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export const BEST_SELLERS_SECTION_ID = "mas-vendidos";

const navLinkClass = (active: boolean) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active ? "bg-white/10 text-cream" : "text-cream/80 hover:bg-white/5 hover:text-cream"
  }`;

const desktopNavLinkClass = (active: boolean) =>
  `shrink-0 text-xs font-medium transition-colors sm:text-sm ${
    active ? "text-cream" : "text-cream/70 hover:text-cream"
  }`;

function scrollToBestSellers() {
  document
    .getElementById(BEST_SELLERS_SECTION_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", `/#${BEST_SELLERS_SECTION_ID}`);
}

function useNavActiveState() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return {
    isBestSellers: pathname === "/" && hash === `#${BEST_SELLERS_SECTION_ID}`,
    isCatalog: pathname === "/catalogo",
    pathname,
    setHash,
  };
}

function NavLinks({
  variant,
  onNavigate,
}: {
  variant: "mobile" | "desktop";
  onNavigate?: () => void;
}) {
  const { isBestSellers, isCatalog, pathname, setHash } = useNavActiveState();
  const linkClass = variant === "mobile" ? navLinkClass : desktopNavLinkClass;

  return (
    <>
      <Link
        href={`/#${BEST_SELLERS_SECTION_ID}`}
        className={linkClass(isBestSellers)}
        onClick={(e) => {
          onNavigate?.();
          if (pathname !== "/") return;
          e.preventDefault();
          scrollToBestSellers();
          setHash(`#${BEST_SELLERS_SECTION_ID}`);
        }}
      >
        {variant === "mobile" ? "Más vendidos" : (
          <>
            <span className="sm:hidden">Vendidos</span>
            <span className="hidden sm:inline">Más vendidos</span>
          </>
        )}
      </Link>
      <Link
        href="/catalogo"
        className={linkClass(isCatalog)}
        onClick={onNavigate}
      >
        Catálogo
      </Link>
    </>
  );
}

function MobileSiteHeader({
  isList,
  onBlackBackground,
}: {
  isList: boolean;
  onBlackBackground: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`pointer-events-auto w-full overflow-visible border-b border-white/15 bg-black/55 backdrop-blur-md backdrop-saturate-150 transition-shadow duration-300 sm:hidden ${
        onBlackBackground
          ? "shadow-[0_0_28px_rgba(255,255,255,0.22),0_4px_20px_rgba(255,255,255,0.12)]"
          : "shadow-none"
      }`}
    >
      <div className="relative flex items-center justify-center px-4 py-3.5">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-lg text-cream transition-colors hover:bg-white/10"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>

        <Link
          href="/"
          className="relative block h-8 w-32 overflow-hidden transition-opacity hover:opacity-90"
          aria-label="Chochomanía — Inicio"
        >
          <Image
            src="/barra.png"
            alt="Chochomanía"
            fill
            className="object-cover object-center"
            sizes="128px"
            priority
          />
        </Link>

        <div className="absolute right-4">
          <CartButton active={isList} />
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-white/10 px-4 py-2.5"
        >
          <div className="flex flex-col gap-1">
            <NavLinks variant="mobile" onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="px-4 pb-4 pt-0.5">
        <Suspense fallback={null}>
          <NavSearch />
        </Suspense>
      </div>
    </nav>
  );
}

function DesktopSiteHeaderActions({ isList }: { isList: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-3">
      <NavLinks variant="desktop" />
      <CartButton active={isList} />
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onBlackBackground = useNavOnBlackBackground();
  const isList = pathname === "/lista";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 sm:px-6 sm:pt-4">
      <MobileSiteHeader
        isList={isList}
        onBlackBackground={onBlackBackground}
      />

      <nav
        className={`pointer-events-auto mx-auto hidden max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 overflow-visible rounded-2xl border border-white/15 bg-black/45 px-6 py-4 backdrop-blur-md backdrop-saturate-150 transition-shadow duration-300 sm:grid ${
          onBlackBackground
            ? "shadow-[0_0_28px_rgba(255,255,255,0.22),0_4px_20px_rgba(255,255,255,0.12)]"
            : "shadow-none"
        }`}
      >
        <Link
          href="/"
          className="relative block h-8 w-32 shrink-0 overflow-hidden transition-opacity hover:opacity-90"
          aria-label="Chochomanía — Inicio"
        >
          <Image
            src="/barra.png"
            alt="Chochomanía"
            fill
            className="object-cover object-center"
            sizes="128px"
            priority
          />
        </Link>

        <Suspense fallback={null}>
          <NavSearch />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-medium text-cream/70">
                Más vendidos
              </span>
              <CartButton active={isList} />
            </div>
          }
        >
          <DesktopSiteHeaderActions isList={isList} />
        </Suspense>
      </nav>
    </header>
  );
}
