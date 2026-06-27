-- CreateTable
CREATE TABLE "SolicitationSignature" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solicitationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolicitationSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitationSignature_userId_solicitationId_key" ON "SolicitationSignature"("userId", "solicitationId");

-- AddForeignKey
ALTER TABLE "SolicitationSignature" ADD CONSTRAINT "SolicitationSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitationSignature" ADD CONSTRAINT "SolicitationSignature_solicitationId_fkey" FOREIGN KEY ("solicitationId") REFERENCES "Solicitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
