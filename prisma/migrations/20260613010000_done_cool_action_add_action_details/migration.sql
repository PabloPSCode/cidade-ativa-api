-- AlterTable
ALTER TABLE "DoneCoolAction"
  ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "neighborhood" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "city" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "uf" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "street" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "actionPhotoURL" TEXT NOT NULL DEFAULT '';

-- Drop the temporary defaults; columns remain NOT NULL and must be provided on insert.
ALTER TABLE "DoneCoolAction"
  ALTER COLUMN "description" DROP DEFAULT,
  ALTER COLUMN "neighborhood" DROP DEFAULT,
  ALTER COLUMN "city" DROP DEFAULT,
  ALTER COLUMN "uf" DROP DEFAULT,
  ALTER COLUMN "street" DROP DEFAULT,
  ALTER COLUMN "actionPhotoURL" DROP DEFAULT;
