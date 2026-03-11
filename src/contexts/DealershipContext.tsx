import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useDealership } from "@/hooks/use-dealership";
import type { Dealership } from "@/data/cars";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

interface DealershipContextValue {
  dealership: Dealership;
  slug: string;
}

const DealershipContext = createContext<DealershipContextValue | null>(null);

export function DealershipProvider({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { data: dealership, isLoading, error } = useDealership(slug);
  const { updateTheme } = useTheme();

  // Sync dealership branding into the ThemeContext when it loads
  useEffect(() => {
    if (!dealership) return;
    updateTheme({
      dealershipName: dealership.name,
      logoUrl: dealership.logoUrl,
      primaryColor: dealership.primaryColor,
      secondaryColor: dealership.secondaryColor,
      heroTitle: dealership.heroTitle,
      heroSubtitle: dealership.heroSubtitle,
    });
  }, [dealership]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !dealership || !slug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Dealership not found</h1>
        <p className="text-muted-foreground">
          The dealership &quot;{slug}&quot; does not exist.
        </p>
      </div>
    );
  }

  return (
    <DealershipContext.Provider value={{ dealership, slug }}>
      {children}
    </DealershipContext.Provider>
  );
}

export function useDealershipCtx() {
  const ctx = useContext(DealershipContext);
  if (!ctx)
    throw new Error(
      "useDealershipCtx must be used within a DealershipProvider",
    );
  return ctx;
}
