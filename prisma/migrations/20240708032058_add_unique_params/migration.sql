/*
  Warnings:

  - A unique constraint covering the columns `[idSocket]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_idSocket_key" ON "User"("idSocket");
