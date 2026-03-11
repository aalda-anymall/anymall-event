-- CreateEnum
CREATE TYPE "SlotState" AS ENUM ('APPLICATIONS_CLOSED', 'ACCEPTING_APPLICATIONS');

-- CreateEnum
CREATE TYPE "SlotApplicationStatus" AS ENUM ('APPLIED', 'WAITLISTED', 'ACCEPTED', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "state" "SlotState" NOT NULL DEFAULT 'ACCEPTING_APPLICATIONS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionSlot" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SlotApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissionSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Slot_venueId_startsAt_idx" ON "Slot"("venueId", "startsAt");

-- CreateIndex
CREATE INDEX "Slot_state_idx" ON "Slot"("state");

-- CreateIndex
CREATE INDEX "SubmissionSlot_slotId_status_idx" ON "SubmissionSlot"("slotId", "status");

-- CreateIndex
CREATE INDEX "SubmissionSlot_submissionId_idx" ON "SubmissionSlot"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionSlot_submissionId_slotId_key" ON "SubmissionSlot"("submissionId", "slotId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionSlot" ADD CONSTRAINT "SubmissionSlot_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionSlot" ADD CONSTRAINT "SubmissionSlot_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
