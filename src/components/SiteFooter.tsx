import Image from "next/image";
import Link from "next/link";
import { encodePublicPath } from "@/lib/catalog";
import { INSTAGRAM_URL } from "@/lib/contact";

const FOOTER_LOGO =
  "/CHOCHOMANIA FOTOS PRODUCTOS_20260611_003041_0000.png";

type Props = {
  /** Fondo negro para páginas con degradado (carrito, etc.). */
  variant?: "default" | "onGradient";
};

export function SiteFooter({ variant = "default" }: Props) {
  const onGradient = variant === "onGradient";

  return (
    <footer
      id="contacto"
      className={`relative z-10 shrink-0 overflow-hidden text-cream ${
        onGradient ? "bg-black" : "bg-[#dc2626]"
      }`}
    >
      {!onGradient && (
        <div
          className="h-px bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#ef4444]"
          aria-hidden
        />
      )}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2 sm:py-3.5">
        <Link
          href="/"
          className="inline-block transition-opacity hover:opacity-90 sm:col-start-2 sm:row-start-1 sm:justify-self-center"
          aria-label="Chochomanía — Inicio"
        >
          <div className="relative h-10 w-32 origin-center scale-[1.5] sm:h-11 sm:w-36 sm:scale-[1.4]">
            <Image
              src={encodePublicPath(FOOTER_LOGO)}
              alt="Chochomanía Supplements"
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 160px, 176px"
            />
          </div>
        </Link>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream sm:col-start-1 sm:row-start-1 sm:justify-self-start"
        >
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Instagram
        </a>

        <p className="text-center text-sm text-cream/50 sm:col-start-3 sm:row-start-1 sm:justify-self-end sm:text-left">
          © {new Date().getFullYear()} Chochomanía. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
