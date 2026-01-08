-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SuperAdmin', 'Admin');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('Pending', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Admin',
    "last_login_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "demo_patients_created" INTEGER NOT NULL DEFAULT 0,
    "demo_tests_created" INTEGER NOT NULL DEFAULT 0,
    "demo_reports_generated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender",
    "age_value" DOUBLE PRECISION,
    "age_unit" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_tests" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "test_type" TEXT NOT NULL,
    "test_code" TEXT,
    "status" "TestStatus" NOT NULL DEFAULT 'Pending',
    "results" JSONB,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "demo_tests" ADD CONSTRAINT "demo_tests_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "demo_patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
