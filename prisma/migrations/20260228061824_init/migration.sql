-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('USABLE', 'BROKEN', 'LOST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "equipment_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'USABLE',
    "location" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "set_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_asset_id_key" ON "equipment"("asset_id");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "equipment_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
