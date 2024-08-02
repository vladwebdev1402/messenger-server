/*
  Warnings:

  - You are about to drop the column `idSocket` on the `User` table. All the data in the column will be lost.
  - Added the required column `idSocket` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Connection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "idSocket" TEXT NOT NULL,
    CONSTRAINT "Connection_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Connection" ("id", "idUser") SELECT "id", "idUser" FROM "Connection";
DROP TABLE "Connection";
ALTER TABLE "new_Connection" RENAME TO "Connection";
CREATE UNIQUE INDEX "Connection_idSocket_key" ON "Connection"("idSocket");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "isOnline", "login", "password") SELECT "id", "isOnline", "login", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
