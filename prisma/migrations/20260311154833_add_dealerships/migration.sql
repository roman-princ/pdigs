-- AlterTable
ALTER TABLE "cars" ALTER COLUMN "year" SET DEFAULT extract(year from now())::int;
