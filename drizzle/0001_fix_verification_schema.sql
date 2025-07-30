-- Fix verification token schema to match Better Auth requirements
ALTER TABLE "verificationToken" RENAME COLUMN "token" TO "value";
ALTER TABLE "verificationToken" RENAME COLUMN "expires" TO "expiresAt";