-- CreateTable
CREATE TABLE "naro" (
    "naro_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naro_pkey" PRIMARY KEY ("naro_id")
);

-- CreateTable
CREATE TABLE "naro_work" (
    "naro_work_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "naro_id" INTEGER NOT NULL,

    CONSTRAINT "naro_work_pkey" PRIMARY KEY ("naro_work_id")
);

-- AddForeignKey
ALTER TABLE "naro_work" ADD CONSTRAINT "naro_work_naro_id_fkey" FOREIGN KEY ("naro_id") REFERENCES "naro"("naro_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
