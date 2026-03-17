import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Car } from "@/data/cars";
import { supabase } from "@/lib/supabase";

type CarRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number | string;
  mileage: number;
  fuel: Car["fuel"];
  transmission: Car["transmission"];
  power: number;
  color: string;
  condition: Car["condition"];
  description: string;
  images: string[];
  features: string[];
  dealership_id: string;
};

function mapCar(row: CarRow): Car {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    price: Number(row.price),
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    power: row.power,
    color: row.color,
    condition: row.condition,
    description: row.description,
    images: row.images ?? [],
    features: row.features ?? [],
    dealershipId: row.dealership_id,
  };
}

async function getDealershipIdBySlug(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from("dealerships")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message ?? "Dealership not found");
  }

  return data.id as string;
}

// ── Queries ────────────────────────────────────────────────────────────────

export function useCars(slug: string | undefined) {
  return useQuery({
    queryKey: ["cars", slug],
    queryFn: async () => {
      const dealershipId = await getDealershipIdBySlug(slug!);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("dealership_id", dealershipId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return ((data ?? []) as CarRow[]).map(mapCar);
    },
    enabled: !!slug,
  });
}

export function useCar(id: string | undefined) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id!)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data ? mapCar(data as CarRow) : null;
    },
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useCreateCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (car: Omit<Car, "id" | "dealershipId">) => {
      const dealershipId = await getDealershipIdBySlug(slug!);
      const { data, error } = await supabase
        .from("cars")
        .insert({
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          fuel: car.fuel,
          transmission: car.transmission,
          power: car.power,
          color: car.color,
          condition: car.condition,
          description: car.description,
          images: car.images,
          features: car.features,
          dealership_id: dealershipId,
        })
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapCar(data as CarRow);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}

export function useCreateCarsBatch(slug: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (cars: Array<Omit<Car, "id" | "dealershipId">>) => {
      if (cars.length === 0) return [];

      const dealershipId = await getDealershipIdBySlug(slug!);
      const payload = cars.map((car) => ({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuel: car.fuel,
        transmission: car.transmission,
        power: car.power,
        color: car.color,
        condition: car.condition,
        description: car.description,
        images: car.images,
        features: car.features,
        dealership_id: dealershipId,
      }));

      const { data, error } = await supabase
        .from("cars")
        .insert(payload)
        .select("*");

      if (error) throw new Error(error.message);
      return ((data ?? []) as CarRow[]).map(mapCar);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}

export function useUpdateCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Car> & { id: string }) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.model !== undefined) dbUpdates.model = updates.model;
      if (updates.year !== undefined) dbUpdates.year = updates.year;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.mileage !== undefined) dbUpdates.mileage = updates.mileage;
      if (updates.fuel !== undefined) dbUpdates.fuel = updates.fuel;
      if (updates.transmission !== undefined)
        dbUpdates.transmission = updates.transmission;
      if (updates.power !== undefined) dbUpdates.power = updates.power;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.condition !== undefined)
        dbUpdates.condition = updates.condition;
      if (updates.description !== undefined)
        dbUpdates.description = updates.description;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.features !== undefined) dbUpdates.features = updates.features;

      const { data, error } = await supabase
        .from("cars")
        .update(dbUpdates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapCar(data as CarRow);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}

export function useDeleteCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}
