import catalogData from "@/data/catalog.json";

/** PNG en public/proteina.png */
export const PROTEINA_IMAGE = "/proteina.png";

export const PROTEIN_PHOTOS_DIR = "/PROTEINAS FOTOS PRODUCTOS";
export const CREATINE_PHOTOS_DIR = "/CREATINAS FOTOS PRODUCTOS";
export const PREWORKOUT_PHOTOS_DIR = "/PREENTRENOS FOTOS PRODUCTOS";
export const OMEGA3_PHOTOS_DIR = "/OMEGA 3 FOTOS PRODUCTOS";
export const POSTWORKOUT_PHOTOS_DIR = "/POSTENTRENOS FOTOS PRODUCTOS";
export const MULTIVITAMIN_PHOTOS_DIR = "/MULTIVITAMINICOS FOTOS PRODUCTOS";
export const BCAA_PHOTOS_DIR = "/BCAAS FOTOS PRODUCTOS";
export const TESTOSTERONE_PRECURSOR_PHOTOS_DIR =
  "/PRECURSORES TESTOSTERONA FOTOS PRODUCTOS";
export const FAT_BURNER_PHOTOS_DIR = "/QUEMADORES DE GRASA FOTOS PRODUCTOS";

/** Codifica rutas de public/ con espacios o caracteres especiales. */
export function encodePublicPath(path: string): string {
  return path
    .normalize("NFC")
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

export type ProductCategory =
  | "proteina"
  | "creatina"
  | "pre-entreno"
  | "omega-3"
  | "post-entreno"
  | "multivitaminicos"
  | "bcaa"
  | "precursores-testosterona"
  | "quemadores-grasa";

export type Product = {
  id: string;
  name: string;
  flavors: string[];
  price: number | null;
  photo: string | null;
  category: ProductCategory;
};

export const CATALOG_FILTERS: { id: ProductCategory; label: string }[] = [
  { id: "proteina", label: "Proteína" },
  { id: "creatina", label: "Creatina" },
  { id: "pre-entreno", label: "Pre-entreno" },
  { id: "omega-3", label: "Omega 3" },
  { id: "post-entreno", label: "Post-entreno" },
  { id: "multivitaminicos", label: "Multivitamínicos" },
  { id: "bcaa", label: "BCAA" },
  { id: "precursores-testosterona", label: "Precursores de testosterona" },
  { id: "quemadores-grasa", label: "Quemadores de grasa" },
];

export const CATALOG_PRODUCTS: Product[] = catalogData as Product[];

/** Productos destacados para la sección «Más vendidos». */
export const BEST_SELLER_ITEMS = [
  {
    id: "100-whey-gold-standard-5lbs-73-porciones",
    label: "Gold Standard 100% Whey (Optimum Nutrition)",
  },
  { id: "iso100-5lbs", label: "ISO100 (Dymatize)" },
  {
    id: "creatine-monohydrate-3g-creapure-147-porciones",
    label: "Creatine Monohydrate Creapure",
  },
  { id: "n-o-xplode-60-porciones", label: "N.O.-Xplode (BSN)" },
  { id: "cell-tech-6lbs", label: "Cell Tech (MuscleTech)" },
  { id: "optimen-150-tabs", label: "Opti-Men (Optimum Nutrition)" },
  { id: "optiwomen-120-caps", label: "Opti-Women (Optimum Nutrition)" },
  { id: "xtend-bcaas-90-porciones", label: "XTEND BCAA (XTEND)" },
  {
    id: "animal-pak-powder-30-porciones",
    label: "Animal Pak (Universal Nutrition)",
  },
  {
    id: "lipodrene-25-mg-90-caps",
    label: "Lipodrene (Hi-Tech Pharmaceuticals)",
  },
] as const;

export const BEST_SELLER_IDS = BEST_SELLER_ITEMS.map((item) => item.id);

export function getProductsByCategory(category: ProductCategory): Product[] {
  return CATALOG_PRODUCTS.filter((product) => product.category === category);
}

function getCategoryLabel(category: ProductCategory): string {
  return (
    CATALOG_FILTERS.find((filter) => filter.id === category)?.label ?? ""
  );
}

function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function productMatchesSearch(product: Product, query: string): boolean {
  const q = normalizeForSearch(query.trim());
  if (!q) return true;
  if (normalizeForSearch(product.name).includes(q)) return true;
  if (normalizeForSearch(getCategoryLabel(product.category)).includes(q)) {
    return true;
  }
  return product.flavors.some((flavor) =>
    normalizeForSearch(flavor).includes(q),
  );
}

export function getProductsBySearch(query: string): Product[] {
  return CATALOG_PRODUCTS.filter((product) =>
    productMatchesSearch(product, query),
  );
}

export function getProductById(id: string): Product | undefined {
  return CATALOG_PRODUCTS.find((product) => product.id === id);
}

export function getBestSellingProducts(): Product[] {
  return BEST_SELLER_ITEMS.flatMap(({ id }) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });
}

/** Query param de la vista «Más vendidos» en /catalogo. */
export const BEST_SELLERS_VIEW_PARAM = "mas-vendidos";

export function getProductsByCategoryAndSearch(
  category: ProductCategory,
  query: string,
): Product[] {
  return getProductsByCategory(category).filter((product) =>
    productMatchesSearch(product, query),
  );
}

export function isProductAvailable(product: Product): boolean {
  return product.price !== null;
}

export function formatPriceMXN(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatProductPrice(price: number | null): string {
  if (price === null) return "No disponible";
  return formatPriceMXN(price);
}

export function formatFlavorCount(count: number) {
  if (count === 0) return "Sin sabores listados";
  return `Elige entre ${count} sabores`;
}
