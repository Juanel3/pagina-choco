import Image from "next/image";
import { encodePublicPath } from "@/lib/catalog";

type Props = {
  name: string;
  photo: string | null;
  className?: string;
  variant?: "card" | "detail";
  compact?: boolean;
};

export function ProductImage({
  name,
  photo,
  className = "",
  variant = "card",
  compact = false,
}: Props) {
  const isDetail = variant === "detail";
  const imageSrc = photo ? encodePublicPath(photo) : null;

  return (
    <div
      className={`relative flex items-center justify-center bg-[#eeeff0] ${
        isDetail
          ? "h-full min-h-[220px] w-full p-6 sm:min-h-[360px]"
          : compact
            ? "min-h-0 p-2"
            : "h-full min-h-[200px]"
      } ${className}`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          fill
          className={`object-contain ${isDetail ? "p-2" : compact ? "p-1" : "p-4"}`}
          sizes={isDetail ? "340px" : "(max-width: 640px) 100vw, 25vw"}
        />
      ) : (
        <div
          className={
            isDetail
              ? "flex h-56 w-36 flex-col items-center justify-end rounded-t-3xl border border-black/5 bg-neutral-800 shadow-inner sm:h-64 sm:w-40"
              : compact
                ? "flex h-[75%] max-h-24 w-[42%] flex-col items-center justify-end rounded-t-xl border border-black/5 bg-neutral-800 shadow-inner"
                : "flex h-[70%] w-[45%] max-w-[140px] flex-col items-center justify-end rounded-t-2xl border border-black/5 bg-neutral-800 shadow-inner"
          }
          aria-hidden
        >
          <div
            className={`mb-auto rounded-full bg-neutral-500 ${
              isDetail
                ? "mt-3 h-4 w-[55%]"
                : compact
                  ? "mt-1.5 h-2 w-[50%]"
                  : "mt-2 h-3 w-[55%]"
            }`}
          />
          <span
            className={`px-1.5 text-center font-bold uppercase leading-tight text-white/90 ${
              isDetail
                ? "pb-3 text-xs sm:text-sm"
                : compact
                  ? "pb-2 text-[0.45rem]"
                  : "pb-3 text-[0.55rem] sm:text-xs"
            }`}
          >
            Proteína
          </span>
        </div>
      )}
    </div>
  );
}
