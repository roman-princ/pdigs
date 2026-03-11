export interface Dealership {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  power: number; // HP
  color: string;
  condition: "New" | "Used" | "Certified Pre-Owned";
  description: string;
  images: string[];
  features: string[];
  dealershipId: string;
}

export const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;
export const transmissionTypes = ["Manual", "Automatic"] as const;
export const conditions = ["New", "Used", "Certified Pre-Owned"] as const;
