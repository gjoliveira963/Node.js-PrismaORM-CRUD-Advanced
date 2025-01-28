-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_directorId_fkey";

-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "directorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "directors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
