/*
  Warnings:

  - You are about to drop the column `designerLink` on the `DesignRequest` table. All the data in the column will be lost.
  - You are about to drop the column `designerName` on the `DesignRequest` table. All the data in the column will be lost.
  - You are about to drop the column `spaceType` on the `DesignRequest` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `DesignRequest` table. All the data in the column will be lost.
  - Added the required column `designStyle` to the `DesignRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredContactMethod` to the `DesignRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectTimeline` to the `DesignRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `DesignRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomType` to the `DesignRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DesignRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "designId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "designStyle" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "projectTimeline" TEXT NOT NULL,
    "preferredContactMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DesignRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DesignRequest_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DesignRequest" ("budgetRange", "city", "createdAt", "designId", "id", "status", "userId") SELECT "budgetRange", "city", "createdAt", "designId", "id", "status", "userId" FROM "DesignRequest";
DROP TABLE "DesignRequest";
ALTER TABLE "new_DesignRequest" RENAME TO "DesignRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
