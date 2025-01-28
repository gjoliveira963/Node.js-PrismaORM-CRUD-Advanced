/*
  Warnings:

  - You are about to drop the `_CategoryToMovie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToMovie" DROP CONSTRAINT "_CategoryToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToMovie" DROP CONSTRAINT "_CategoryToMovie_B_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CategoryToMovie";

-- CreateTable
CREATE TABLE "categories_movies" (
    "categoryId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "categories_movies_pkey" PRIMARY KEY ("categoryId","movieId")
);

-- AddForeignKey
ALTER TABLE "categories_movies" ADD CONSTRAINT "categories_movies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_movies" ADD CONSTRAINT "categories_movies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
