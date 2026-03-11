import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const cars = [
  {
    brand: "BMW",
    model: "M3 Competition",
    year: 2024,
    price: 78900,
    mileage: 1200,
    fuel: "Petrol",
    transmission: "Automatic",
    power: 510,
    color: "Alpine White",
    condition: "Certified Pre-Owned",
    description:
      "Stunning BMW M3 Competition with the iconic S58 twin-turbo inline-6. Full M Sport package, carbon fiber roof, and M carbon bucket seats.",
    images: [],
    features: [
      "M Sport Exhaust",
      "Carbon Roof",
      "Head-Up Display",
      "Harman Kardon",
      "Adaptive M Suspension",
      "M Drive Professional",
    ],
  },
  {
    brand: "Mercedes-Benz",
    model: "C 300 AMG Line",
    year: 2023,
    price: 52400,
    mileage: 15000,
    fuel: "Petrol",
    transmission: "Automatic",
    power: 258,
    color: "Obsidian Black",
    condition: "Used",
    description:
      "Elegant C-Class with AMG Line exterior and interior. Equipped with MBUX infotainment, 360° camera, and premium Burmester sound system.",
    images: [],
    features: [
      "AMG Line",
      "Burmester Sound",
      "360° Camera",
      "Digital Cockpit",
      "Keyless Go",
      "LED Multibeam",
    ],
  },
  {
    brand: "Audi",
    model: "RS 5 Sportback",
    year: 2024,
    price: 85000,
    mileage: 500,
    fuel: "Petrol",
    transmission: "Automatic",
    power: 450,
    color: "Nardo Grey",
    condition: "New",
    description:
      "Brand new RS 5 Sportback in the iconic Nardo Grey. 2.9L twin-turbo V6, quattro AWD, sport differential, and RS sport suspension plus.",
    images: [],
    features: [
      "Quattro AWD",
      "Sport Differential",
      "Matrix LED",
      "Virtual Cockpit Plus",
      "Bang & Olufsen",
      "RS Sport Suspension",
    ],
  },
  {
    brand: "Tesla",
    model: "Model 3 Performance",
    year: 2024,
    price: 54990,
    mileage: 3000,
    fuel: "Electric",
    transmission: "Automatic",
    power: 460,
    color: "Pearl White",
    condition: "Used",
    description:
      'Tesla Model 3 Performance with track mode, lowered suspension, and 20" Überturbine wheels. Full Self-Driving capability included.',
    images: [],
    features: [
      "Full Self-Driving",
      "Track Mode",
      "Glass Roof",
      '15" Touchscreen',
      "Premium Audio",
      "Heated Seats",
    ],
  },
  {
    brand: "Volkswagen",
    model: "Golf GTI",
    year: 2023,
    price: 35900,
    mileage: 22000,
    fuel: "Petrol",
    transmission: "Automatic",
    power: 245,
    color: "Kings Red",
    condition: "Used",
    description:
      "The iconic hot hatch. MK8 Golf GTI with DSG, digital cockpit pro, and adaptive chassis control. Perfect daily driver with a sporting edge.",
    images: [],
    features: [
      "DSG Gearbox",
      "Adaptive Chassis",
      "Digital Cockpit Pro",
      "IQ.Light",
      "Sport Seats",
      "Drive Mode Select",
    ],
  },
  {
    brand: "Toyota",
    model: "GR Supra 3.0",
    year: 2024,
    price: 58000,
    mileage: 800,
    fuel: "Petrol",
    transmission: "Manual",
    power: 382,
    color: "Renaissance Red",
    condition: "New",
    description:
      "The legendary Supra returns with a 6-speed manual. 3.0L turbocharged inline-6, limited-slip differential, and adaptive variable suspension.",
    images: [],
    features: [
      "6-Speed Manual",
      "Active Differential",
      "JBL Audio",
      "Adaptive Suspension",
      "Wireless CarPlay",
      "Sport Brakes",
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  // Create a demo dealership
  await prisma.car.deleteMany();
  await prisma.dealership.deleteMany();

  const dealership = await prisma.dealership.create({
    data: {
      name: "AutoVault Demo",
      slug: "demo",
      ownerEmail: "demo@autovault.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Auto City",
    },
  });

  const result = await prisma.car.createMany({
    data: cars.map((c) => ({ ...c, dealershipId: dealership.id })),
  });
  console.log(
    `Seeded dealership "${dealership.name}" with ${result.count} cars`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
