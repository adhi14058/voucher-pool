-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_offers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discount_percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "special_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customer_id" TEXT NOT NULL,
    "special_offer_id" TEXT NOT NULL,

    CONSTRAINT "voucher_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_codes_code_key" ON "voucher_codes"("code");

-- CreateIndex
CREATE INDEX "voucher_codes_code_idx" ON "voucher_codes"("code");

-- CreateIndex
CREATE INDEX "voucher_codes_customer_id_idx" ON "voucher_codes"("customer_id");

-- CreateIndex
CREATE INDEX "voucher_codes_special_offer_id_idx" ON "voucher_codes"("special_offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_codes_customer_id_special_offer_id_key" ON "voucher_codes"("customer_id", "special_offer_id");

-- AddForeignKey
ALTER TABLE "voucher_codes" ADD CONSTRAINT "voucher_codes_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_codes" ADD CONSTRAINT "voucher_codes_special_offer_id_fkey" FOREIGN KEY ("special_offer_id") REFERENCES "special_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
