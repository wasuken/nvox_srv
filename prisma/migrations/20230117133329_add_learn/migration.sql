-- CreateTable
CREATE TABLE "Learn" (
    "learn_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Learn_pkey" PRIMARY KEY ("learn_id")
);

-- CreateTable
CREATE TABLE "LearnHistory" (
    "learn_history_id" SERIAL NOT NULL,
    "learn_id" INTEGER NOT NULL,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnHistory_pkey" PRIMARY KEY ("learn_history_id")
);

-- CreateTable
CREATE TABLE "LearnHistoryItem" (
    "learn_history_item_id" SERIAL NOT NULL,
    "learn_history_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "LearnHistoryItem_pkey" PRIMARY KEY ("learn_history_item_id")
);

-- CreateTable
CREATE TABLE "LearnHistoryItemWav" (
    "learn_history_item_wav_id" SERIAL NOT NULL,
    "learn_history_item_id" INTEGER NOT NULL,
    "wavpath" TEXT NOT NULL,
    "contents" TEXT NOT NULL,

    CONSTRAINT "LearnHistoryItemWav_pkey" PRIMARY KEY ("learn_history_item_wav_id")
);

-- AddForeignKey
ALTER TABLE "LearnHistory" ADD CONSTRAINT "LearnHistory_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "Learn"("learn_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearnHistoryItem" ADD CONSTRAINT "LearnHistoryItem_learn_history_id_fkey" FOREIGN KEY ("learn_history_id") REFERENCES "LearnHistory"("learn_history_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearnHistoryItemWav" ADD CONSTRAINT "LearnHistoryItemWav_learn_history_item_id_fkey" FOREIGN KEY ("learn_history_item_id") REFERENCES "LearnHistoryItem"("learn_history_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
