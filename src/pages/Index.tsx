import { useState, useMemo } from "react";
import { fuelTypes } from "@/data/cars";
import { useCars } from "@/hooks/use-cars";
import { useTheme } from "@/contexts/ThemeContext";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

const Index = () => {
  const { slug } = useDealershipCtx();
  const { data: cars = [], isLoading } = useCars(slug);
  const { heroTitle, heroSubtitle } = useTheme();
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand))], [cars]);

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const matchSearch =
        !search ||
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchBrand = !brandFilter || car.brand === brandFilter;
      const matchFuel = !fuelFilter || car.fuel === fuelFilter;
      const matchPrice = !maxPrice || car.price <= maxPrice;
      return matchSearch && matchBrand && matchFuel && matchPrice;
    });
  }, [cars, search, brandFilter, fuelFilter, maxPrice]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="border-b bg-card">
        <div className="container py-12 md:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            {heroSubtitle}
          </p>

          {/* Search */}
          <div className="mt-8 flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 animate-fade-in">
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm">
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm">
                <option value="">All Fuel Types</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Max price (€)"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : "")
                }
                className="h-9 w-36 rounded-md border bg-background px-3 text-sm"
              />
              <button
                onClick={() => {
                  setBrandFilter("");
                  setFuelFilter("");
                  setMaxPrice("");
                }}
                className="h-9 rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="container py-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
            </p>
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No vehicles match your criteria
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Index;
