-- DropForeignKey
ALTER TABLE "DoneCoolAction" DROP CONSTRAINT "DoneCoolAction_solicitationId_fkey";

-- DropIndex
DROP INDEX "DoneCoolAction_solicitationId_key";

-- AlterTable
ALTER TABLE "DoneCoolAction" DROP COLUMN "solicitationId";
