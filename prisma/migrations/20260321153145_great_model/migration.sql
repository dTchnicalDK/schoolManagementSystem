/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "applyingClass" TEXT NOT NULL,
    "previousSchool" TEXT,
    "parentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Application_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT,
    "transactionId" TEXT,
    "applicationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT,
    "admittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'PARENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Application_parentId_idx" ON "Application"("parentId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_applicationId_key" ON "Payment"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_applicationId_key" ON "Student"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");
