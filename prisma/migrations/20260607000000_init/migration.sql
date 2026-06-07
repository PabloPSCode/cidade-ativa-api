-- CreateEnum
CREATE TYPE "SolicitationStatus" AS ENUM ('not_resolved', 'in_progress', 'resolved', 'unconsidered');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activityDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isCouncilman" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitationType" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    CONSTRAINT "SolicitationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitation" (
    "id" TEXT NOT NULL,
    "protocolNumber" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "requestingUserId" TEXT NOT NULL,
    "solicitationTypeId" TEXT NOT NULL,
    "status" "SolicitationStatus" NOT NULL DEFAULT 'not_resolved',
    "unsolvedImageUrls" JSONB NOT NULL DEFAULT '[]',
    "solvedImageUrls" JSONB,
    "solvedDate" TIMESTAMP(3),
    "solvedCommentary" TEXT,
    "solvedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    CONSTRAINT "Solicitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoolAction" (
    "id" TEXT NOT NULL,
    "solicitationTypeId" TEXT NOT NULL,
    "solicitationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoolAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoneCoolAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coolActionId" TEXT NOT NULL,
    "solicitationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DoneCoolAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicPhone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    CONSTRAINT "PublicPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UF" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "UF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ufId" TEXT NOT NULL,
    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitationType_description_key" ON "SolicitationType"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitation_protocolNumber_key" ON "Solicitation"("protocolNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CoolAction_solicitationId_key" ON "CoolAction"("solicitationId");

-- CreateIndex
CREATE UNIQUE INDEX "DoneCoolAction_solicitationId_key" ON "DoneCoolAction"("solicitationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicPhone_phone_key" ON "PublicPhone"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UF_name_key" ON "UF"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_ufId_key" ON "City"("name", "ufId");

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_name_cityId_key" ON "Neighborhood"("name", "cityId");

-- AddForeignKey
ALTER TABLE "Solicitation" ADD CONSTRAINT "Solicitation_requestingUserId_fkey" FOREIGN KEY ("requestingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitation" ADD CONSTRAINT "Solicitation_solicitationTypeId_fkey" FOREIGN KEY ("solicitationTypeId") REFERENCES "SolicitationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_ufId_fkey" FOREIGN KEY ("ufId") REFERENCES "UF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neighborhood" ADD CONSTRAINT "Neighborhood_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoolAction" ADD CONSTRAINT "CoolAction_solicitationTypeId_fkey" FOREIGN KEY ("solicitationTypeId") REFERENCES "SolicitationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoolAction" ADD CONSTRAINT "CoolAction_solicitationId_fkey" FOREIGN KEY ("solicitationId") REFERENCES "Solicitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoneCoolAction" ADD CONSTRAINT "DoneCoolAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoneCoolAction" ADD CONSTRAINT "DoneCoolAction_coolActionId_fkey" FOREIGN KEY ("coolActionId") REFERENCES "CoolAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoneCoolAction" ADD CONSTRAINT "DoneCoolAction_solicitationId_fkey" FOREIGN KEY ("solicitationId") REFERENCES "Solicitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
