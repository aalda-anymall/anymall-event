ALTER TABLE "SubmissionSlot"
ADD COLUMN "receiptEmailSentAt" TIMESTAMP(3);

DROP INDEX IF EXISTS "Submission_verificationToken_key";

ALTER TABLE "Submission"
DROP COLUMN "verified",
DROP COLUMN "verifiedAt",
DROP COLUMN "verificationToken",
DROP COLUMN "tokenExpiresAt";
