import { useState, useEffect } from "react";
import { useCars } from "@/hooks/use-cars";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const Calculator = () => {
  const { slug } = useDealershipCtx();
  const { data: cars = [], isLoading } = useCars(slug);
  const [carId, setCarId] = useState("");
  const [downPayment, setDownPayment] = useState(5000);
  const [months, setMonths] = useState(48);
  const [rate, setRate] = useState(4.9);

  // select first car when data loads
  useEffect(() => {
    if (cars.length > 0 && !carId) setCarId(cars[0].id);
  }, [cars, carId]);

  const car = cars.find((c) => c.id === carId);
  const principal = car ? car.price - downPayment : 0;
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment =
    car && monthlyRate > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : principal / (months || 1);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  if (isLoading || !car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <h1 className="font-display text-3xl font-bold">
          Financing Calculator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimate your monthly payments
        </p>

        <div className="mt-8 space-y-5 rounded-lg border bg-card p-6">
          <div>
            <label className="text-sm font-medium">Vehicle</label>
            <select
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm">
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} — €{c.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Down Payment: €{downPayment.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={car.price}
              step={500}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Loan Term: {months} months
            </label>
            <input
              type="range"
              min={12}
              max={84}
              step={6}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Interest Rate: {rate}%
            </label>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Monthly Payment</p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">
              €{Math.round(monthlyPayment).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="mt-1 font-display text-2xl font-bold">
              €{Math.round(totalPayment).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Interest</p>
            <p className="mt-1 font-display text-2xl font-bold text-accent">
              €{Math.round(totalInterest).toLocaleString()}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground italic">
          This calculator provides estimates only. Actual financing terms may
          vary. Contact us for a personalized quote.
        </p>
      </div>
    </div>
  );
};

export default Calculator;
