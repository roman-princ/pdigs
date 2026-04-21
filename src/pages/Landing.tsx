import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMyDealerships,
  useRegisterDealership,
} from "@/hooks/use-dealership";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Car,
  Store,
  Palette,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Compass,
  Sun,
  Moon,
} from "lucide-react";

const Landing = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { data: myDealerships = [] } = useMyDealerships(
    user?.email ?? undefined,
  );
  const register = useRegisterDealership();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 48),
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("You must be signed in to register a dealership.");
      return;
    }
    if (!name.trim() || !slug.trim()) {
      setError("Dealership name is required.");
      return;
    }

    try {
      const d = await register.mutateAsync({
        name: name.trim(),
        slug: slug.trim(),
        ownerEmail: user.email,
        phone: phone.trim(),
        address: address.trim(),
      });
      navigate(`/d/${d.slug}/admin`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const features = [
    {
      icon: Store,
      title: "Your Own Storefront",
      desc: "Get a branded dealership page with your own URL, logo, and colors.",
    },
    {
      icon: Car,
      title: "Car Listings Management",
      desc: "Add, edit, and manage your entire vehicle inventory from one dashboard.",
    },
    {
      icon: Palette,
      title: "Full UI Customization",
      desc: "Adjust colors, logos, hero text, and branding to match your identity.",
    },
    {
      icon: BarChart3,
      title: "Built-in Tools",
      desc: "Financing calculator, value estimator, and vehicle comparison out of the box.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-bold">
            <Car className="h-6 w-6 text-primary" />
            <span>AutoVault</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/discover"
              className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
              <Compass className="h-4 w-4" /> Discover
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
            {user ? (
              <>
                <Link
                  to="/account"
                  className="hidden rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary sm:inline-flex">
                  My Account
                </Link>
                <Link
                  to="#register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("register")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Register Dealership
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-20 md:py-32">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Sell cars online.
            <br />
            <span className="text-primary">Your dealership, your brand.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Launch your own branded car dealership website in minutes. Manage
            inventory, customize your storefront, and start selling - no coding
            required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center gap-2 rounded-lg border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary">
                  My Account
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("register")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/discover"
              className="flex items-center gap-2 rounded-lg border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary">
              Explore Dealerships <Compass className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-16 md:py-24">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold">
            Everything you need to run a dealership
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border bg-card p-6">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing dealerships */}
      {user && myDealerships.length > 0 && (
        <section className="border-b py-12">
          <div className="container">
            <h2 className="font-display text-2xl font-bold">
              Your Dealerships
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myDealerships.map((d) => (
                <Link
                  key={d.id}
                  to={`/d/${d.slug}`}
                  className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">{d.name}</p>
                    <p className="text-sm text-muted-foreground">/{d.slug}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration form */}
      <section id="register" className="py-16 md:py-24">
        <div className="container max-w-lg">
          <h2 className="text-center font-display text-3xl font-bold">
            Register Your Dealership
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Set up your dealership in seconds - you can customize everything
            later.
          </p>

          {!user && !authLoading ? (
            <div className="mt-8 rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                You need an account to register a dealership.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Sign In / Create Account
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-4 rounded-lg border bg-card p-6">
              <div>
                <label className="text-sm font-medium">Dealership Name *</label>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Premier Auto Sales"
                  required
                  className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL Slug *</label>
                <div className="mt-1 flex items-center gap-0">
                  <span className="flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                    /d/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "")
                          .slice(0, 48),
                      )
                    }
                    required
                    className="h-9 flex-1 rounded-r-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City"
                  className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={register.isPending}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {register.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Create Dealership
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AutoVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
