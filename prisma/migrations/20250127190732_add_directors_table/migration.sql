/*
  Warnings:

  - Added the required column `directorId` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "directorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "directors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "directors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
