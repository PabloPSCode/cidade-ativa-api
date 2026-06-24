/*
  Warnings:

  - Added the required column `institutionName` to the `PublicPhone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublicPhone" ADD COLUMN     "institutionName" TEXT NOT NULL;
