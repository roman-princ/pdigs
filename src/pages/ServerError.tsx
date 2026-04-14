import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServerError = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/60 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_55%)]" />

      <div className="relative w-full max-w-xl rounded-2xl border bg-card/95 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight">500</h1>
        <p className="text-lg font-medium">Temporary server issue</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Our database is waking up or temporarily unavailable. Please try again
          in a moment.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
