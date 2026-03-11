-- 1. Create dealerships table first
CREATE TABLE "dealerships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "logo_url" TEXT,
    "primary_color" TEXT NOT NULL DEFAULT '#2563eb',
    "secondary_color" TEXT NOT NULL DEFAULT '#f97316',
    "hero_title" TEXT NOT NULL DEFAULT 'Find Your Perfect Drive',
    "hero_subtitle" TEXT NOT NULL DEFAULT 'Browse our curated selection of premium vehicles.',
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealerships_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "dealerships_slug_key" ON "dealerships"("slug");

-- 2. Insert a default dealership so existing cars have somewhere to go
INSERT INTO "dealerships" ("id", "name", "slug", "owner_email")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Dealership', 'default', 'admin@example.com');

-- 3. Add the column with a default pointing to the placeholder, then drop the default
ALTER TABLE "cars"
  ADD COLUMN "dealership_id" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  ALTER COLUMN "year" SET DEFAULT extract(year from now())::int;

ALTER TABLE "cars" ALTER COLUMN "dealership_id" DROP DEFAULT;

-- 4. Foreign key
ALTER TABLE "cars" ADD CONSTRAINT "cars_dealership_id_fkey"
  FOREIGN KEY ("dealership_id") REFERENCES "dealerships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
