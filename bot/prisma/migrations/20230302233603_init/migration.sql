-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideRoleID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "guildID" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    CONSTRAINT "Guide_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guide_guildID_fkey" FOREIGN KEY ("guildID") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Character" (
    "name" TEXT NOT NULL,
    "dcenter" TEXT NOT NULL,
    "charURI" TEXT NOT NULL,
    "playerID" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    CONSTRAINT "Character_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_world_key" ON "Character"("world");
