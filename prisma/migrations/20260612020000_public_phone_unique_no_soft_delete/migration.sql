-- Remove duplicate phones (keep the earliest row per phone) so the unique index can be created
DELETE FROM "PublicPhone" a
USING "PublicPhone" b
WHERE a.phone = b.phone
  AND a.ctid > b.ctid;

-- AlterTable
ALTER TABLE "PublicPhone" DROP COLUMN IF EXISTS "deletedAt";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PublicPhone_phone_key" ON "PublicPhone"("phone");
