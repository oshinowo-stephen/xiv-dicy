/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `charID` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "name" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "dcenter" TEXT NOT NULL,
    "charURI" TEXT NOT NULL,
    "playerID" TEXT NOT NULL,
    "charID" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Character_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("charURI", "dcenter", "name", "playerID", "world") SELECT "charURI", "dcenter", "name", "playerID", "world" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
