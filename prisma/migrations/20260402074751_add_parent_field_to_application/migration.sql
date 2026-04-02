/*
  Warnings:

  - Added the required column `address` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentEmail` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentPhone` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "applyingClass" TEXT NOT NULL,
    "previousSchool" TEXT,
    "parentId" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Application_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applyingClass", "createdAt", "deletedAt", "dob", "gender", "id", "parentId", "previousSchool", "status", "studentName", "updatedAt") SELECT "applyingClass", "createdAt", "deletedAt", "dob", "gender", "id", "parentId", "previousSchool", "status", "studentName", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_parentId_idx" ON "Application"("parentId");
CREATE INDEX "Application_status_idx" ON "Application"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
