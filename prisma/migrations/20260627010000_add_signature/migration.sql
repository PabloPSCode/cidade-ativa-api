-- CreateTable
CREATE TABLE "Signature" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solicitationId" TEXT,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signature_userId_key" ON "Signature"("userId");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_solicitationId_fkey" FOREIGN KEY ("solicitationId") REFERENCES "Solicitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
