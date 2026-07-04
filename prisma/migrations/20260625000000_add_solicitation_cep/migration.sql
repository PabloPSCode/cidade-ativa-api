-- Add the mandatory CEP column to Solicitation.
-- Existing rows are backfilled with a placeholder CEP before the NOT NULL
-- constraint is enforced, since the column has no default.
ALTER TABLE "Solicitation" ADD COLUMN "cep" TEXT;
UPDATE "Solicitation" SET "cep" = '00000-000' WHERE "cep" IS NULL;
ALTER TABLE "Solicitation" ALTER COLUMN "cep" SET NOT NULL;
