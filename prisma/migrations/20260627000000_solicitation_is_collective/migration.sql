-- Add the isCollective flag to Solicitation. Existing rows default to false.
ALTER TABLE "Solicitation" ADD COLUMN "isCollective" BOOLEAN NOT NULL DEFAULT false;
