import express from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ── Dealership CRUD ────────────────────────────────────────────────────────

// Register a new dealership
app.post("/api/dealerships", async (req, res) => {
  const { name, slug, ownerEmail, phone, address } = req.body;

  if (!name || !slug || !ownerEmail) {
    return res
      .status(400)
      .json({ error: "name, slug, and ownerEmail are required" });
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({
      error: "Slug must contain only lowercase letters, numbers, and hyphens",
    });
  }

  const existing = await prisma.dealership.findUnique({ where: { slug } });
  if (existing) {
    return res
      .status(409)
      .json({ error: "A dealership with this slug already exists" });
  }

  const dealership = await prisma.dealership.create({
    data: {
      name,
      slug,
      ownerEmail,
      phone: phone ?? "",
      address: address ?? "",
    },
  });
  res.status(201).json(dealership);
});

// Get dealership by slug (public – used for storefront)
app.get("/api/dealerships/:slug", async (req, res) => {
  const dealership = await prisma.dealership.findUnique({
    where: { slug: req.params.slug },
  });
  if (!dealership)
    return res.status(404).json({ error: "Dealership not found" });
  res.json(dealership);
});

// Get dealership(s) by owner email
app.get("/api/dealerships", async (req, res) => {
  const email = req.query.ownerEmail as string | undefined;
  if (!email) {
    return res
      .status(400)
      .json({ error: "ownerEmail query parameter required" });
  }
  const dealerships = await prisma.dealership.findMany({
    where: { ownerEmail: email },
    orderBy: { createdAt: "desc" },
  });
  res.json(dealerships);
});

// Update dealership settings
app.patch("/api/dealerships/:slug", async (req, res) => {
  const {
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    heroTitle,
    heroSubtitle,
    phone,
    address,
  } = req.body;
  const dealership = await prisma.dealership.update({
    where: { slug: req.params.slug },
    data: {
      ...(name !== undefined && { name }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(primaryColor !== undefined && { primaryColor }),
      ...(secondaryColor !== undefined && { secondaryColor }),
      ...(heroTitle !== undefined && { heroTitle }),
      ...(heroSubtitle !== undefined && { heroSubtitle }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
    },
  });
  res.json(dealership);
});

// ── Cars CRUD (scoped to dealership) ───────────────────────────────────────

// List all cars for a dealership (public)
app.get("/api/dealerships/:slug/cars", async (req, res) => {
  const dealership = await prisma.dealership.findUnique({
    where: { slug: req.params.slug },
  });
  if (!dealership)
    return res.status(404).json({ error: "Dealership not found" });

  const cars = await prisma.car.findMany({
    where: { dealershipId: dealership.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(cars);
});

// Get a single car (public)
app.get("/api/cars/:id", async (req, res) => {
  const car = await prisma.car.findUnique({ where: { id: req.params.id } });
  if (!car) return res.status(404).json({ error: "Not found" });
  res.json(car);
});

// Create a car for a dealership
app.post("/api/dealerships/:slug/cars", async (req, res) => {
  const dealership = await prisma.dealership.findUnique({
    where: { slug: req.params.slug },
  });
  if (!dealership)
    return res.status(404).json({ error: "Dealership not found" });

  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    power,
    color,
    condition,
    description,
    images,
    features,
  } = req.body;
  const car = await prisma.car.create({
    data: {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      power,
      color,
      condition,
      description,
      images,
      features,
      dealershipId: dealership.id,
    },
  });
  res.status(201).json(car);
});

// Update a car
app.patch("/api/cars/:id", async (req, res) => {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    power,
    color,
    condition,
    description,
    images,
    features,
  } = req.body;
  const car = await prisma.car.update({
    where: { id: req.params.id },
    data: {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      power,
      color,
      condition,
      description,
      images,
      features,
    },
  });
  res.json(car);
});

// Delete a car
app.delete("/api/cars/:id", async (req, res) => {
  await prisma.car.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ── Start ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`API server running on http://localhost:${PORT}`),
);
