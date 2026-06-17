-- CreateEnum
CREATE TYPE "CoolActionCategory" AS ENUM ('LIMPEZA_URBANA', 'MEIO_AMBIENTE', 'EDUCACAO', 'BEM_ESTAR_ANIMAL', 'ZELADORIA', 'SEGURANCA_COMUNITARIA', 'ENGAJAMENTO_COMUNITARIO');

-- Clear data incompatible with the new schema (old CoolAction rows were per-solicitation links).
-- DoneCoolAction references CoolAction, so it is cleared as well.
TRUNCATE TABLE "DoneCoolAction", "CoolAction";

-- DropForeignKey
ALTER TABLE "CoolAction" DROP CONSTRAINT "CoolAction_solicitationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CoolAction" DROP CONSTRAINT "CoolAction_solicitationId_fkey";

-- DropIndex
DROP INDEX "CoolAction_solicitationId_key";

-- AlterTable
ALTER TABLE "CoolAction"
  DROP COLUMN "solicitationTypeId",
  DROP COLUMN "solicitationId",
  ADD COLUMN "title" TEXT NOT NULL,
  ADD COLUMN "category" "CoolActionCategory" NOT NULL,
  ADD COLUMN "points" INTEGER NOT NULL;
