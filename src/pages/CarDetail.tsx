import { useParams, Link } from "react-router-dom";
import { useCar } from "@/hooks/use-cars";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Calendar,
  Zap,
  Palette,
  Settings2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CarDetail = () => {
  const { id } = useParams();
  const { slug } = useDealershipCtx();
  const { data: car, isLoading } = useCar(id);
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState("");
  const [testDriveName, setTestDriveName] = useState("");
  const [testDriveEmail, setTestDriveEmail] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-lg text-muted-foreground">Vehicle not found</p>
          <Link
            to={`/d/${slug}`}
            className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const placeholderBg = "from-primary/10 to-accent/10";

  const handleDeposit = () => {
    toast.success(
      "Deposit reserved! (This is a demo — no real payment was processed)",
    );
  };

  const handleTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDriveDate || !testDriveName || !testDriveEmail) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(
      `Test drive booked for ${testDriveDate}! We'll confirm via email.`,
    );
    setShowTestDrive(false);
    setTestDriveDate("");
    setTestDriveName("");
    setTestDriveEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-4xl py-8">
        <Link
          to={`/d/${slug}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Image gallery */}
        {car.images && car.images.length > 0 ? (
          <div>
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <img
                src={car.images[activeImage]}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover"
              />
            </div>
            {car.images.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {car.images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      idx === activeImage
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}>
                    <img
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`aspect-[16/9] rounded-lg bg-gradient-to-br ${placeholderBg} flex items-center justify-center`}>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-foreground/40">
                {car.brand}
              </p>
              <p className="text-lg text-muted-foreground">{car.model}</p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              {car.condition === "New" && (
                <span className="rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-success-foreground">
                  New
                </span>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">{car.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-3xl font-bold text-primary">
              €{car.price.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{car.condition}</p>
          </div>
        </div>

        {/* Specs grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[
            { icon: Calendar, label: "Year", value: car.year },
            {
              icon: Gauge,
              label: "Mileage",
              value: `${car.mileage.toLocaleString()} km`,
            },
            { icon: Fuel, label: "Fuel", value: car.fuel },
            { icon: Zap, label: "Power", value: `${car.power} HP` },
            { icon: Settings2, label: "Transmission", value: car.transmission },
            { icon: Palette, label: "Color", value: car.color },
          ].map((spec) => (
            <div key={spec.label} className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <spec.icon className="h-4 w-4" />
                <span className="text-xs">{spec.label}</span>
              </div>
              <p className="mt-1 text-sm font-semibold">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">Features</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {car.features.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <CheckCircle className="h-3 w-3 text-success" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* CEBIA mock */}
        <div className="mt-8 rounded-lg border bg-card p-4">
          <h2 className="font-display text-lg font-semibold">
            Vehicle History (CEBIA)
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This vehicle has been checked against the CEBIA database. No
            accidents, no odometer tampering, no outstanding liens detected.
          </p>
          <p className="mt-2 text-xs text-muted-foreground italic">
            (Demo: In production, this would pull from the CEBIA API)
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={handleDeposit}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Reserve with Deposit — €500
          </button>
          <button
            onClick={() => setShowTestDrive(!showTestDrive)}
            className="rounded-lg border bg-card px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary">
            Book Test Drive
          </button>
        </div>

        {/* Test Drive Form */}
        {showTestDrive && (
          <form
            onSubmit={handleTestDrive}
            className="mt-4 max-w-sm animate-fade-in space-y-3 rounded-lg border bg-card p-4">
            <h3 className="font-display font-semibold">Book a Test Drive</h3>
            <input
              type="text"
              placeholder="Your name"
              value={testDriveName}
              onChange={(e) => setTestDriveName(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="Email address"
              value={testDriveEmail}
              onChange={(e) => setTestDriveEmail(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="date"
              value={testDriveDate}
              onChange={(e) => setTestDriveDate(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CarDetail;
