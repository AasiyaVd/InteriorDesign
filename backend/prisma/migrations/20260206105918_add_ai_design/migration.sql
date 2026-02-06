-- CreateTable
CREATE TABLE "AIDesign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "style" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "colorMood" TEXT,
    "lighting" TEXT,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
