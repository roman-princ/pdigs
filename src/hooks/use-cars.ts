import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Car } from "@/data/cars";

// ── API helpers ────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Queries ────────────────────────────────────────────────────────────────

export function useCars(slug: string | undefined) {
  return useQuery({
    queryKey: ["cars", slug],
    queryFn: () => apiFetch<Car[]>(`/api/dealerships/${slug}/cars`),
    enabled: !!slug,
  });
}

export function useCar(id: string | undefined) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => apiFetch<Car | null>(`/api/cars/${id}`),
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useCreateCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (car: Omit<Car, "id" | "dealershipId">) =>
      apiFetch<Car>(`/api/dealerships/${slug}/cars`, {
        method: "POST",
        body: JSON.stringify(car),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}

export function useUpdateCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<Car> & { id: string }) =>
      apiFetch<Car>(`/api/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}

export function useDeleteCar(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/cars/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", slug] }),
  });
}
