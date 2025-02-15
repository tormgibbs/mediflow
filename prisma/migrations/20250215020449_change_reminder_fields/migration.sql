/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `stepId` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `task` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "scheduledAt",
DROP COLUMN "stepId",
ADD COLUMN     "task" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
