/*
  Warnings:

  - Added the required column `bank_details` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upi_id` to the `Customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "bank_details" TEXT NOT NULL,
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "upi_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bank_details" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "purchaseAmount" INTEGER NOT NULL,
    "sellingAmount" INTEGER NOT NULL,
    "clearing_rate" INTEGER NOT NULL,
    "cha_name" TEXT NOT NULL,
    "transporter" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "shippingLine" TEXT NOT NULL,
    "material_description" TEXT NOT NULL,
    "net_weight" TEXT NOT NULL,
    "gross_weight" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "vat_rate" INTEGER NOT NULL DEFAULT 0,
    "order_type" TEXT NOT NULL,
    "shipped_on_date" TEXT NOT NULL,
    "loaded_on_date" TEXT NOT NULL,
    "gate_in_date" TEXT NOT NULL,
    "arrival_date" TEXT NOT NULL,
    "port_of_loading" TEXT NOT NULL,
    "port_of_deloading" TEXT NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingDocs" (
    "id" TEXT NOT NULL,
    "doc_name" TEXT NOT NULL,
    "doc_url" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "ShippingDocs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutwardPayment" (
    "id" TEXT NOT NULL,
    "advance_amount" INTEGER NOT NULL,
    "balance_amount" INTEGER NOT NULL,
    "advance_paid" BOOLEAN NOT NULL,
    "balance_paid" BOOLEAN NOT NULL,
    "ORTT_DOC_1" TEXT NOT NULL DEFAULT '',
    "ORTT_DOC_2" TEXT NOT NULL DEFAULT '',
    "order_id" TEXT NOT NULL,

    CONSTRAINT "OutwardPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InwardPayment" (
    "id" TEXT NOT NULL,
    "advance_amount" INTEGER NOT NULL,
    "balance_amount" INTEGER NOT NULL,
    "advance_paid" BOOLEAN NOT NULL,
    "balance_paid" BOOLEAN NOT NULL,
    "proof_of_payment" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "InwardPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingDocs" ADD CONSTRAINT "ShippingDocs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutwardPayment" ADD CONSTRAINT "OutwardPayment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InwardPayment" ADD CONSTRAINT "InwardPayment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
