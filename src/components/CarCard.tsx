import { Car } from "@/data/cars";
import { Link } from "react-router-dom";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import { Fuel, Gauge, Calendar, Zap } from "lucide-react";

const CarCard = ({ car }: { car: Car }) => {
  const { slug } = useDealershipCtx();
  const placeholderBg = [
    "from-primary/20 to-primary/5",
    "from-accent/20 to-accent/5",
    "from-success/20 to-success/5",
  ];
  const bgClass = placeholderBg[parseInt(car.id) % placeholderBg.length];

  return (
    <Link
      to={`/d/${slug}/car/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${bgClass}`}>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground/60">
                {car.brand}
              </p>
              <p className="text-sm text-muted-foreground">{car.model}</p>
            </div>
          </div>
        )}
        {car.condition === "New" && (
          <span className="absolute right-3 top-3 rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-success-foreground">
            New
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {car.description}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {car.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            {car.mileage.toLocaleString()} km
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            {car.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {car.power} HP
          </span>
        </div>

        <div className="mt-auto pt-4">
          <p className="font-display text-xl font-bold text-primary">
            €{car.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
