/*
  Warnings:

  - The values [TF,MT] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `id` on the `Metadata` table. The data in that column will be cast from `Int` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `Quiz` table. The data in that column will be cast from `Int` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to drop the column `question` on the `Questions` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Questions` table. The data in that column will be cast from `Int` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - Added the required column `label` to the `Questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solution` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "QuestionType"DROP VALUE 'TF';
ALTER TYPE "QuestionType"DROP VALUE 'MT';

-- RedefineTables
CREATE TABLE "_prisma_new_Metadata" (
    "id" STRING NOT NULL,
    "topic" "Topics" NOT NULL,
    "subtopics" STRING[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Metadata" ("createdAt","id","subtopics","topic","updatedAt") SELECT "createdAt","id","subtopics","topic","updatedAt" FROM "Metadata";
DROP TABLE "Metadata" CASCADE;
ALTER TABLE "_prisma_new_Metadata" RENAME TO "Metadata";
CREATE UNIQUE INDEX "Metadata_topic_key" ON "Metadata"("topic");
CREATE TABLE "_prisma_new_Quiz" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "topic" "Topics" NOT NULL,
    "difficulty" "QuizDifficulty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" INT4 NOT NULL DEFAULT 0,
    "reviewNotes" STRING NOT NULL DEFAULT '',
    "analysis" STRING[] DEFAULT ARRAY[]::STRING[],

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Quiz" ("createdAt","difficulty","email","id","reviewNotes","score","topic","updatedAt") SELECT "createdAt","difficulty","email","id","reviewNotes","score","topic","updatedAt" FROM "Quiz";
DROP TABLE "Quiz" CASCADE;
ALTER TABLE "_prisma_new_Quiz" RENAME TO "Quiz";
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_Questions" (
    "id" STRING NOT NULL,
    "quizId" STRING NOT NULL,
    "label" STRING NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MCQ',
    "options" STRING[] DEFAULT ARRAY[]::STRING[],
    "answer" STRING,
    "solution" STRING NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Questions" ("answer","id","options","quizId","type") SELECT "answer","id","options","quizId","type" FROM "Questions";
DROP TABLE "Questions" CASCADE;
ALTER TABLE "_prisma_new_Questions" RENAME TO "Questions";
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
