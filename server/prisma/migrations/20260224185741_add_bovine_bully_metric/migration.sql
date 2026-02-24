-- AlterEnum
ALTER TYPE "public"."metric" ADD VALUE 'bovine_bully';

-- AlterTable
ALTER TABLE "public"."snapshots" ADD COLUMN     "bovine_bullyKills" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "bovine_bullyRank" INTEGER NOT NULL DEFAULT -1;
