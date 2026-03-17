import { read, utils, writeFile } from "xlsx";
import type { Car } from "@/data/cars";
import { conditions, fuelTypes, transmissionTypes } from "@/data/cars";

export type ImportedListing = Omit<Car, "id" | "dealershipId">;

export type ListingImportResult = {
  listings: ImportedListing[];
  errors: string[];
};

type RawRow = Record<string, unknown>;

const REQUIRED_FIELDS: Array<keyof Pick<ImportedListing, "brand" | "model">> = [
  "brand",
  "model",
];

const LISTING_TEMPLATE_ROWS = [
  {
    brand: "Audi",
    model: "A4",
    price: 32990,
    year: 2022,
    mileage: 38000,
    fuel: "Petrol",
    transmission: "Automatic",
    power: 190,
    color: "Black",
    condition: "Used",
    description: "One-owner, full service history",
    features: "Virtual cockpit; Heated seats; CarPlay",
    images: "https://example.com/car-1.jpg; https://example.com/car-2.jpg",
  },
  {
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    power: "",
    color: "",
    condition: "",
    description: "",
    features: "",
    images: "",
  },
];

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getValue(raw: RawRow, aliases: string[]): unknown {
  const aliasesSet = new Set(aliases.map(normalizeKey));

  for (const [key, value] of Object.entries(raw)) {
    if (aliasesSet.has(normalizeKey(key))) {
      return value;
    }
  }

  return undefined;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function toArrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item))
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(/[;,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function toEnumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  const normalized = toStringValue(value).toLowerCase();
  const found = allowed.find((item) => item.toLowerCase() === normalized);
  return found ?? fallback;
}

function mapRawToListing(raw: RawRow): ImportedListing {
  const year = toNumberValue(getValue(raw, ["year"]), new Date().getFullYear());

  return {
    brand: toStringValue(getValue(raw, ["brand", "make"])),
    model: toStringValue(getValue(raw, ["model"])),
    price: toNumberValue(getValue(raw, ["price", "amount"]), 0),
    year,
    mileage: toNumberValue(getValue(raw, ["mileage", "kilometers", "km"]), 0),
    fuel: toEnumValue(getValue(raw, ["fuel", "fuelType"]), fuelTypes, "Petrol"),
    transmission: toEnumValue(
      getValue(raw, ["transmission", "gearbox"]),
      transmissionTypes,
      "Automatic",
    ),
    power: toNumberValue(getValue(raw, ["power", "hp"]), 0),
    color: toStringValue(getValue(raw, ["color", "colour"])),
    condition: toEnumValue(
      getValue(raw, ["condition", "state"]),
      conditions,
      "Used",
    ),
    description: toStringValue(getValue(raw, ["description", "details"])),
    features: toArrayValue(getValue(raw, ["features", "equipment"])),
    images: toArrayValue(getValue(raw, ["images", "imageurls", "imageUrls"])),
  };
}

function validateListing(listing: ImportedListing): string | null {
  for (const field of REQUIRED_FIELDS) {
    if (!listing[field]) {
      return `Missing required field: ${field}`;
    }
  }

  if (listing.price <= 0) {
    return "Price must be greater than 0";
  }

  return null;
}

export function parseListings(rows: unknown[]): ListingImportResult {
  const listings: ImportedListing[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push(`Row ${index + 1}: row must be an object`);
      return;
    }

    const listing = mapRawToListing(row as RawRow);
    const validationError = validateListing(listing);

    if (validationError) {
      errors.push(`Row ${index + 1}: ${validationError}`);
      return;
    }

    listings.push(listing);
  });

  return { listings, errors };
}

export function parseListingsFromJsonText(
  jsonText: string,
): ListingImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON file");
  }

  const rows = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { listings?: unknown[] }).listings)
      ? (parsed as { listings: unknown[] }).listings
      : null;

  if (!rows) {
    throw new Error(
      "JSON must be an array of listings or an object with a listings array",
    );
  }

  return parseListings(rows);
}

export async function parseListingsFromExcelFile(
  file: File,
): Promise<ListingImportResult> {
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("Excel file has no sheets");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = utils.sheet_to_json<RawRow>(sheet, { defval: "" });
  return parseListings(rows);
}

export function downloadExcelTemplate() {
  const worksheet = utils.json_to_sheet(LISTING_TEMPLATE_ROWS);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Listings");
  writeFile(workbook, "listings-template.xlsx");
}

export function downloadJsonTemplate() {
  const json = JSON.stringify({ listings: LISTING_TEMPLATE_ROWS }, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "listings-template.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
