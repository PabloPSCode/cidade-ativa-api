-- DropForeignKey
ALTER TABLE "Neighborhood" DROP CONSTRAINT "Neighborhood_cityId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_ufId_fkey";

-- DropTable
DROP TABLE "Neighborhood";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "UF";
