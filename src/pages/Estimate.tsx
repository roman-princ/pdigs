import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useCars } from "@/hooks/use-cars";
import { useDealershipCtx } from "@/contexts/DealershipContext";

const Estimate = () => {
  const { slug } = useDealershipCtx();
  const { data: cars = [] } = useCars(slug);
  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand))], [cars]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [mileage, setMileage] = useState<number | "">("");
  const [result, setResult] = useState<{ low: number; high: number } | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!brand || !model || !year || !mileage) {
      setError("Please fill in all required fields.");
      return;
    }
    if (typeof mileage === "number" && mileage < 0) {
      setError("Mileage cannot be negative.");
      return;
    }
    if (typeof year === "number" && (year < 1990 || year > 2026)) {
      setError("Please enter a valid year (1990–2026).");
      return;
    }

    // Mock valuation: base on year and mileage
    const basePrice = 40000;
    const ageFactor = Math.max(0.3, 1 - (2026 - (year as number)) * 0.07);
    const mileageFactor = Math.max(0.4, 1 - (mileage as number) / 300000);
    const estimated = basePrice * ageFactor * mileageFactor;
    const low = Math.round(estimated * 0.85);
    const high = Math.round(estimated * 1.15);

    setResult({ low, high });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-lg py-8">
        <h1 className="font-display text-3xl font-bold">
          Estimate Your Car's Value
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get an estimated trade-in value for your current vehicle
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border bg-card p-6">
          <div>
            <label className="text-sm font-medium">Brand *</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm">
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Model *</label>
            <input
              type="text"
              placeholder="e.g. Golf GTI"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Year *</label>
              <input
                type="number"
                placeholder="2020"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value ? Number(e.target.value) : "")
                }
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mileage (km) *</label>
              <input
                type="number"
                placeholder="50000"
                value={mileage}
                onChange={(e) =>
                  setMileage(e.target.value ? Number(e.target.value) : "")
                }
                className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Get Estimate
          </button>
        </form>

        {result && (
          <div className="mt-6 animate-fade-in rounded-lg border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Estimated value range
            </p>
            <p className="mt-2 font-display text-3xl font-bold">
              €{result.low.toLocaleString()} — €{result.high.toLocaleString()}
            </p>
            <p className="mt-3 text-xs text-muted-foreground italic">
              ⚠ This is only an estimate based on average market data. Actual
              value may vary depending on condition, service history, and market
              demand.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Estimate;
