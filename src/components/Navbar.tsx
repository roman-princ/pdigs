import { Link } from "react-router-dom";
import { Car as CarIcon, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDealershipCtx } from "@/contexts/DealershipContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dealershipName, logoUrl, darkMode, toggleDarkMode } = useTheme();
  const { slug } = useDealershipCtx();
  const base = `/d/${slug}`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to={base}
          className="flex items-center gap-2 font-display text-xl font-bold">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={dealershipName}
              className="h-7 w-7 object-contain"
            />
          ) : (
            <CarIcon className="h-6 w-6 text-primary" />
          )}
          <span>{dealershipName}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to={base}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Browse Cars
          </Link>
          <Link
            to={`${base}/compare`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Compare
          </Link>
          <Link
            to={`${base}/calculator`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Financing
          </Link>
          <Link
            to={`${base}/estimate`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Value Estimator
          </Link>
          <Link
            to={`${base}/admin`}
            className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
            <Settings className="h-3.5 w-3.5" />
            Admin
          </Link>
          <button
            onClick={toggleDarkMode}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to={base}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium">
              Browse Cars
            </Link>
            <Link
              to={`${base}/compare`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium">
              Compare
            </Link>
            <Link
              to={`${base}/calculator`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium">
              Financing
            </Link>
            <Link
              to={`${base}/estimate`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium">
              Value Estimator
            </Link>
            <Link
              to={`${base}/admin`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium">
              Admin Panel
            </Link>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-sm font-medium">
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
