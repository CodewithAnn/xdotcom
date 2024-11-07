/*
  Warnings:

  - Changed the type of `emailToken` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "emailToken",
ADD COLUMN     "emailToken" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");
