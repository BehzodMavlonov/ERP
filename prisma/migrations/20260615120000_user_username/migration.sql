-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

UPDATE "User" SET "username" = 'admin';

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

DROP INDEX IF EXISTS "User_email_key";
ALTER TABLE "User" DROP COLUMN "email";

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
