import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyDealerships } from "@/hooks/use-dealership";
import { ArrowRight, Building2, LogOut, Mail, User2 } from "lucide-react";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { data: myDealerships = [], isLoading: dealershipsLoading } =
    useMyDealerships(user?.email ?? undefined);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const createdAt = new Date(user.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-12 md:py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                My Account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your profile and dealerships.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary">
                Back to Landing
              </Link>
              <button
                onClick={() => {
                  void signOut();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container grid gap-6 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-6 lg:col-span-1">
            <h2 className="font-display text-xl font-semibold">Profile</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="break-all font-medium">{user.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email ?? "No email"}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">{createdAt}</p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">
                My Dealerships
              </h2>
              <Link
                to="/#register"
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Register New
              </Link>
            </div>

            {dealershipsLoading ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Loading your dealerships...
              </p>
            ) : myDealerships.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed p-6 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No dealerships yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start by registering your first dealership from the landing
                  page.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {myDealerships.map((dealership) => (
                  <div
                    key={dealership.id}
                    className="rounded-lg border p-4 transition-shadow hover:shadow-sm">
                    <p className="font-display text-lg font-semibold">
                      {dealership.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      /d/{dealership.slug}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/d/${dealership.slug}`}
                        className="inline-flex items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                        Open Storefront
                      </Link>
                      <Link
                        to={`/d/${dealership.slug}/admin`}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                        Admin <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
};

export default Account;
