-- CreateEnum
CREATE TYPE "player_operation_type" AS ENUM ('import_cml', 'review_type');

-- CreateTable
CREATE TABLE "playerOperations" (
    "playerId" INTEGER NOT NULL,
    "type" "player_operation_type" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playerOperations_pkey" PRIMARY KEY ("playerId","type","createdAt")
);

-- AddForeignKey
ALTER TABLE "playerOperations" ADD CONSTRAINT "playerOperations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
