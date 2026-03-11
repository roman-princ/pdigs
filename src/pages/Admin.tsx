import { useState, useRef } from "react";
import { Car, fuelTypes, transmissionTypes, conditions } from "@/data/cars";
import {
  useCars,
  useCreateCar,
  useUpdateCar,
  useDeleteCar,
} from "@/hooks/use-cars";
import { useUpdateDealership } from "@/hooks/use-dealership";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import {
  Plus,
  Pencil,
  Trash2,
  Share2,
  Eye,
  Palette,
  List,
  RotateCcw,
  Upload,
  X as XIcon,
  LogOut,
  Loader2,
  Star,
  GripVertical,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const emptyForm: Omit<Car, "id" | "images" | "dealershipId"> = {
  brand: "",
  model: "",
  year: 2024,
  price: 0,
  mileage: 0,
  fuel: "Petrol",
  transmission: "Automatic",
  power: 0,
  color: "",
  condition: "New",
  description: "",
  features: [],
};

const Admin = () => {
  const { slug } = useDealershipCtx();
  const { data: listings = [], isLoading } = useCars(slug);
  const createCar = useCreateCar(slug);
  const updateCar = useUpdateCar(slug);
  const deleteCar = useDeleteCar(slug);
  const updateDealership = useUpdateDealership(slug);
  const { user, signOut } = useAuth();
  const [editing, setEditing] = useState<Car | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "customization">(
    "listings",
  );
  const {
    dealershipName,
    logoUrl,
    primaryColor,
    secondaryColor,
    heroTitle,
    heroSubtitle,
    updateTheme,
    resetTheme,
  } = useTheme();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!form.brand || !form.model || !form.price) {
      toast.error("Brand, model, and price are required");
      return;
    }

    try {
      if (editing) {
        await updateCar.mutateAsync({ id: editing.id, ...form, images });
        toast.success("Listing updated");
        setEditing(null);
      } else {
        await createCar.mutateAsync({ ...form, images });
        toast.success("Listing created");
        setCreating(false);
      }
      setForm(emptyForm);
      setImages([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCar.mutateAsync(id);
      toast.success("Listing deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleShare = (car: Car) => {
    toast.success(`Shared "${car.brand} ${car.model}" to social media! (Demo)`);
  };

  const handleEdit = (car: Car) => {
    setEditing(car);
    setCreating(false);
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      power: car.power,
      color: car.color,
      condition: car.condition,
      description: car.description,
      features: car.features,
    });
    setImages(car.images ?? []);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm((f) => ({
        ...f,
        features: [...f.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5_000_000) {
        toast.error(`"${file.name}" is over 5 MB — skipped`);
        continue;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    }
    // reset input so re-selecting the same file works
    e.target.value = "";
  };

  const setAsPrimary = (idx: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [img] = next.splice(idx, 1);
      next.unshift(img);
      return next;
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDraggingIdx(idx);

  const handleDrop = (targetIdx: number) => {
    if (draggingIdx === null || draggingIdx === targetIdx) return;
    setImages((prev) => {
      const next = [...prev];
      const [img] = next.splice(draggingIdx, 1);
      next.splice(targetIdx, 0, img);
      return next;
    });
    setDraggingIdx(null);
  };

  const showForm = creating || editing;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 512_000) {
      toast.error("Logo must be under 500 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateTheme({ logoUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your dealership
            </p>
          </div>
        </div>

        {/* User info + sign out */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Signed in as {user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b">
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "listings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <List className="h-4 w-4" /> Listings
          </button>
          <button
            onClick={() => setActiveTab("customization")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "customization"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <Palette className="h-4 w-4" /> Customization
          </button>
        </div>

        {/* ── Customization Tab ─────────────────────────────────────────── */}
        {activeTab === "customization" && (
          <div className="mt-6 animate-fade-in space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Branding</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {/* Dealership Name */}
                <div>
                  <label className="text-sm font-medium">Dealership Name</label>
                  <input
                    value={dealershipName}
                    onChange={(e) =>
                      updateTheme({ dealershipName: e.target.value })
                    }
                    className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Hero Title */}
                <div>
                  <label className="text-sm font-medium">Hero Title</label>
                  <input
                    value={heroTitle}
                    onChange={(e) => updateTheme({ heroTitle: e.target.value })}
                    className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Hero Subtitle */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Hero Subtitle</label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) =>
                      updateTheme({ heroSubtitle: e.target.value })
                    }
                    rows={2}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {/* Logo */}
                <div>
                  <label className="text-sm font-medium">Logo</label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="mt-1 flex items-center gap-3">
                    {logoUrl ? (
                      <div className="relative">
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="h-10 w-10 rounded-md border object-contain"
                        />
                        <button
                          onClick={() => updateTheme({ logoUrl: null })}
                          className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                          title="Remove logo">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                        <Upload className="h-4 w-4" />
                      </div>
                    )}
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                      {logoUrl ? "Change" : "Upload"} Logo
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max 500 KB. Displayed in navbar.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Colors</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Changes apply instantly across the entire site.
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {/* Primary Color */}
                <div>
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) =>
                        updateTheme({ primaryColor: e.target.value })
                      }
                      className="h-9 w-12 cursor-pointer rounded-md border p-0.5"
                    />
                    <input
                      value={primaryColor}
                      onChange={(e) => {
                        if (/^#[0-9a-f]{6}$/i.test(e.target.value))
                          updateTheme({ primaryColor: e.target.value });
                      }}
                      maxLength={7}
                      className="h-9 w-28 rounded-md border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Used for buttons, links, and highlights.
                  </p>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="text-sm font-medium">Secondary Color</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) =>
                        updateTheme({ secondaryColor: e.target.value })
                      }
                      className="h-9 w-12 cursor-pointer rounded-md border p-0.5"
                    />
                    <input
                      value={secondaryColor}
                      onChange={(e) => {
                        if (/^#[0-9a-f]{6}$/i.test(e.target.value))
                          updateTheme({ secondaryColor: e.target.value });
                      }}
                      maxLength={7}
                      className="h-9 w-28 rounded-md border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Used for accents and badges.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6">
                <label className="text-sm font-medium">Preview</label>
                <div className="mt-2 flex flex-wrap items-center gap-3 rounded-md border bg-background p-4">
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Primary Button
                  </button>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Accent Badge
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    Primary text
                  </span>
                </div>
              </div>
            </div>

            {/* Save + Reset */}
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    await updateDealership.mutateAsync({
                      name: dealershipName,
                      logoUrl,
                      primaryColor,
                      secondaryColor,
                      heroTitle,
                      heroSubtitle,
                    });
                    toast.success("Customization saved");
                  } catch (err: any) {
                    toast.error(err.message || "Failed to save");
                  }
                }}
                disabled={updateDealership.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {updateDealership.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Customization
              </button>
              <button
                onClick={() => {
                  resetTheme();
                  toast.success("Theme reset to defaults");
                }}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                <RotateCcw className="h-4 w-4" /> Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* ── Listings Tab ──────────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <>
            <div className="mt-6 flex items-center justify-end">
              {!showForm && (
                <button
                  onClick={() => {
                    setCreating(true);
                    setEditing(null);
                    setForm(emptyForm);
                    setImages([]);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" /> Add Listing
                </button>
              )}
            </div>

            {/* Form */}
            {showForm && (
              <div className="mt-6 animate-fade-in rounded-lg border bg-card p-6">
                <h2 className="font-display text-lg font-semibold">
                  {editing ? "Edit Listing" : "New Listing"}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Brand *</label>
                    <input
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model *</label>
                    <input
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price (€) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: Number(e.target.value) })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mileage (km)</label>
                    <input
                      type="number"
                      value={form.mileage}
                      onChange={(e) =>
                        setForm({ ...form, mileage: Number(e.target.value) })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Power (HP)</label>
                    <input
                      type="number"
                      value={form.power}
                      onChange={(e) =>
                        setForm({ ...form, power: Number(e.target.value) })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fuel</label>
                    <select
                      value={form.fuel}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fuel: e.target.value as Car["fuel"],
                        })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {fuelTypes.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Transmission</label>
                    <select
                      value={form.transmission}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          transmission: e.target.value as Car["transmission"],
                        })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {transmissionTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Condition</label>
                    <select
                      value={form.condition}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          condition: e.target.value as Car["condition"],
                        })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {conditions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <input
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Features</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addFeature())
                        }
                        placeholder="Add feature and press Enter"
                        className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="rounded-md bg-secondary px-3 text-sm font-medium">
                        Add
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {form.features.map((f, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
                          {f}
                          <button
                            onClick={() =>
                              setForm({
                                ...form,
                                features: form.features.filter(
                                  (_, j) => j !== i,
                                ),
                              })
                            }
                            className="hover:text-destructive">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Images</label>
                    <p className="text-xs text-muted-foreground">
                      First image is the cover photo. Drag to reorder or click
                      the star to set as cover.
                    </p>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="mt-2 flex flex-wrap gap-3">
                      {images.map((src, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(idx)}
                          className={`group relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                            idx === 0
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground/30"
                          }`}>
                          <img
                            src={src}
                            alt={`Car image ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 flex items-start justify-end gap-0.5 bg-black/0 p-1 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setAsPrimary(idx)}
                              title="Set as cover"
                              className="rounded bg-black/50 p-1 text-white hover:bg-black/70">
                              <Star className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Remove"
                              className="rounded bg-black/50 p-1 text-white hover:bg-destructive">
                              <XIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <GripVertical className="absolute bottom-1 left-1 h-4 w-4 text-white/70 opacity-0 group-hover:opacity-100" />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs font-medium">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={createCar.isPending || updateCar.isPending}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    {(createCar.isPending || updateCar.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {editing ? "Update" : "Create"} Listing
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setEditing(null);
                      setForm(emptyForm);
                      setImages([]);
                    }}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Listings table */}
            {isLoading ? (
              <div className="mt-8 flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium text-muted-foreground">
                        Vehicle
                      </th>
                      <th className="p-3 text-left font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="p-3 text-left font-medium text-muted-foreground">
                        Year
                      </th>
                      <th className="p-3 text-left font-medium text-muted-foreground">
                        Condition
                      </th>
                      <th className="p-3 text-right font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((car) => (
                      <tr key={car.id} className="border-b last:border-0">
                        <td className="p-3 font-medium">
                          {car.brand} {car.model}
                        </td>
                        <td className="p-3">€{car.price.toLocaleString()}</td>
                        <td className="p-3">{car.year}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              car.condition === "New"
                                ? "bg-success/10 text-success"
                                : "bg-secondary text-secondary-foreground"
                            }`}>
                            {car.condition}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/d/${slug}/car/${car.id}`}
                              className="rounded p-1.5 hover:bg-secondary"
                              title="View">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            <button
                              onClick={() => handleEdit(car)}
                              className="rounded p-1.5 hover:bg-secondary"
                              title="Edit">
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleShare(car)}
                              className="rounded p-1.5 hover:bg-secondary"
                              title="Share to Social">
                              <Share2 className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDelete(car.id)}
                              className="rounded p-1.5 hover:bg-secondary"
                              title="Delete">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
