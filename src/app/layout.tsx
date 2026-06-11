import type { Metadata } from "next";
import { Oswald, Roboto_Condensed } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const handelsonSix = localFont({
  src: "../../public/fonts/Handelson-Six.woff2",
  variable: "--font-handelson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chochomanía Supplements",
  description: "Suplementos deportivos premium. Abre la mochila y descubre tu stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${robotoCondensed.variable} ${oswald.variable} ${handelsonSix.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
