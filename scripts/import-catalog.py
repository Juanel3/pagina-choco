#!/usr/bin/env python3
"""Importa productos desde Catalogo_Chochomania_Base.xlsx a src/data/catalog.json."""

from __future__ import annotations

import json
import re
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = Path("/Users/juanflores/Downloads/chochomania productos/Catalogo_Chochomania_Base.xlsx")
OUT = ROOT / "src" / "data" / "catalog.json"

CATEGORY_MAP = {
    "Proteínas": "proteina",
    "Creatinas": "creatina",
    "Pre-Entrenos": "pre-entreno",
    "Post-Entrenos": "post-entreno",
    "BCAAs": "bcaa",
    "Omega 3": "omega-3",
    "Multivitamínicos": "multivitaminicos",
    "Precursores de Testosterona": "precursores-testosterona",
    "Quemadores de Grasa": "quemadores-grasa",
}

# Correcciones de nombre en el Excel (categoría, nombre original, precio) -> nombre correcto
NAME_CORRECTIONS: dict[tuple[str, str, int | None], str] = {
    ("proteina", "WHEY HD 4.1 LB", 1050): "MUTANT WHEY PROTEÍNA SUERO 5 LB 61 PORCIONES",
}

CATEGORY_PHOTO_FOLDERS: dict[str, tuple[str, str]] = {
    "proteina": ("PROTEINAS FOTOS PRODUCTOS", "/PROTEINAS FOTOS PRODUCTOS"),
    "creatina": ("CREATINAS FOTOS PRODUCTOS", "/CREATINAS FOTOS PRODUCTOS"),
    "pre-entreno": ("PREENTRENOS FOTOS PRODUCTOS", "/PREENTRENOS FOTOS PRODUCTOS"),
    "omega-3": ("OMEGA 3 FOTOS PRODUCTOS", "/OMEGA 3 FOTOS PRODUCTOS"),
    "post-entreno": ("POSTENTRENOS FOTOS PRODUCTOS", "/POSTENTRENOS FOTOS PRODUCTOS"),
    "multivitaminicos": (
        "MULTIVITAMINICOS FOTOS PRODUCTOS",
        "/MULTIVITAMINICOS FOTOS PRODUCTOS",
    ),
    "bcaa": ("BCAAS FOTOS PRODUCTOS", "/BCAAS FOTOS PRODUCTOS"),
    "precursores-testosterona": (
        "PRECURSORES TESTOSTERONA FOTOS PRODUCTOS",
        "/PRECURSORES TESTOSTERONA FOTOS PRODUCTOS",
    ),
    "quemadores-grasa": (
        "QUEMADORES DE GRASA FOTOS PRODUCTOS",
        "/QUEMADORES DE GRASA FOTOS PRODUCTOS",
    ),
}

PHOTO_MAP = {
    "proteina": "/proteina.png",
    "creatina": "/proteina.png",
    "pre-entreno": "/assets/items/pre.png",
    "post-entreno": "/assets/items/quick.png",
    "bcaa": "/assets/items/bcaa.png",
    "omega-3": "/proteina.png",
    "multivitaminicos": "/assets/items/vitamins.png",
    "precursores-testosterona": "/proteina.png",
    "quemadores-grasa": "/assets/items/lipo.png",
}

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def normalize_match_key(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().replace("/", "-").replace("&", " ")
    text = text.replace(",", ".")
    text = re.sub(r"(\d)([a-z])", r"\1 \2", text)
    text = re.sub(r"[^a-z0-9.]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_category_photos(folder_name: str) -> dict[str, str]:
    photos: dict[str, str] = {}
    photo_dir = ROOT / "public" / folder_name
    if not photo_dir.is_dir():
        return photos

    for image in photo_dir.glob("*.png"):
        photos[normalize_match_key(image.stem)] = image.name

    return photos


def find_category_photo(
    name: str,
    photos: dict[str, str],
    url_prefix: str,
) -> str | None:
    key = normalize_match_key(name)
    if key in photos:
        return f"{url_prefix}/{photos[key]}"

    best_name: str | None = None
    best_score = 0.0
    key_tokens = set(key.split())

    for candidate_key, filename in photos.items():
        candidate_tokens = set(candidate_key.split())
        if not key_tokens or not candidate_tokens:
            continue
        overlap = len(key_tokens & candidate_tokens) / len(key_tokens | candidate_tokens)
        if overlap > best_score:
            best_score = overlap
            best_name = filename

    if best_name and best_score >= 0.82:
        return f"{url_prefix}/{best_name}"

    for candidate_key, filename in photos.items():
        if key in candidate_key or candidate_key in key:
            return f"{url_prefix}/{filename}"

    return None


def load_all_category_photos() -> dict[str, tuple[dict[str, str], str]]:
    loaded: dict[str, tuple[dict[str, str], str]] = {}
    for category, (folder_name, url_prefix) in CATEGORY_PHOTO_FOLDERS.items():
        photos = load_category_photos(folder_name)
        if photos:
            loaded[category] = (photos, url_prefix)
    return loaded


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def parse_price(value: str) -> int | None:
    if not value:
        return None
    value = str(value).strip().replace(",", "")
    if value in ("-", "#VALUE!", ""):
        return None
    try:
        price = int(float(value))
        return price if price > 0 else None
    except ValueError:
        return None


def parse_flavors(value: str) -> list[str]:
    if not value:
        return []
    value = str(value).strip()
    if value in ("-", "#VALUE!", ""):
        return []
    value = re.sub(r"\s+", " ", value.replace("\n", " "))
    return [part.strip() for part in re.split(r",\s*", value) if part.strip()]


def parse_row(cells: list[str]) -> dict | None:
    if not cells or cells[0] in ("Nombre del producto", ""):
        return None

    name = str(cells[0]).strip().replace("\n", " ")
    if not name:
        return None

    if len(cells) >= 4:
        flavors_raw, price_raw, photo_raw = cells[1], cells[2], cells[3]
    elif len(cells) == 3:
        if re.match(r"^[\d.]+$", str(cells[1]).strip()):
            flavors_raw, price_raw, photo_raw = "", cells[1], cells[2]
        else:
            flavors_raw, price_raw, photo_raw = cells[1], cells[2], ""
    elif len(cells) == 2:
        flavors_raw, price_raw, photo_raw = "", cells[1], ""
    else:
        flavors_raw, price_raw, photo_raw = "", "", ""

    price = parse_price(price_raw)

    photo = str(photo_raw).strip() if photo_raw else ""
    if photo in ("#VALUE!", "-", "") or not photo.startswith("/"):
        photo = None

    return {
        "name": name,
        "flavors": parse_flavors(flavors_raw),
        "price": price,
        "photo": photo,
    }


def load_sheet_rows(z: zipfile.ZipFile, path: str, shared: list[str]) -> list[list[str]]:
    sheet = ET.fromstring(z.read(path))
    rows: list[list[str]] = []

    for row in sheet.findall(".//m:row", NS):
        cells: list[str] = []
        for cell in row.findall("m:c", NS):
            cell_type = cell.attrib.get("t")
            value_node = cell.find("m:v", NS)
            value = ""
            if value_node is not None and value_node.text is not None:
                value = shared[int(value_node.text)] if cell_type == "s" else value_node.text
            cells.append(value)
        if any(str(cell).strip() for cell in cells):
            rows.append(cells)

    return rows


def import_catalog(xlsx_path: Path) -> list[dict]:
    products: list[dict] = []
    seen_ids: set[str] = set()
    category_photos = load_all_category_photos()

    with zipfile.ZipFile(xlsx_path) as z:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for item in root.findall(".//m:si", NS):
                texts = [node.text or "" for node in item.findall(".//m:t", NS)]
                shared.append("".join(texts))

        workbook = ET.fromstring(z.read("xl/workbook.xml"))
        sheets = [
            (
                sheet.attrib.get("name"),
                sheet.attrib.get(
                    "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
                ),
            )
            for sheet in workbook.findall(".//m:sheet", NS)
        ]

        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rid_to_path = {
            rel.attrib["Id"]: "xl/" + rel.attrib["Target"] for rel in rels
        }

        for sheet_name, rid in sheets:
            category = CATEGORY_MAP.get(sheet_name or "")
            if not category:
                continue

            rows = load_sheet_rows(z, rid_to_path[rid], shared)
            for cells in rows:
                parsed = parse_row(cells)
                if not parsed:
                    continue

                product_name = parsed["name"]
                correction_key = (category, product_name, parsed["price"])
                if correction_key in NAME_CORRECTIONS:
                    product_name = NAME_CORRECTIONS[correction_key]

                base_id = slugify(product_name)
                product_id = base_id
                suffix = 2
                while product_id in seen_ids:
                    product_id = f"{base_id}-{suffix}"
                    suffix += 1
                seen_ids.add(product_id)

                photo = parsed["photo"]
                if not photo and category in category_photos:
                    photos, url_prefix = category_photos[category]
                    photo = find_category_photo(product_name, photos, url_prefix)
                if not photo:
                    photo = PHOTO_MAP.get(category, "/proteina.png")

                products.append(
                    {
                        "id": product_id,
                        "name": product_name,
                        "flavors": parsed["flavors"],
                        "price": parsed["price"],
                        "photo": photo,
                        "category": category,
                    }
                )

    return products


def main() -> None:
    xlsx_path = DEFAULT_XLSX
    products = import_catalog(xlsx_path)
    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Importados {len(products)} productos -> {OUT}")


if __name__ == "__main__":
    main()
