-- Scope public phone uniqueness per city, so each city can keep its own set of
-- numbers (e.g. 190, 199) instead of them being globally unique.
DROP INDEX "PublicPhone_phone_key";
CREATE UNIQUE INDEX "PublicPhone_cityId_phone_key" ON "PublicPhone"("cityId", "phone");
