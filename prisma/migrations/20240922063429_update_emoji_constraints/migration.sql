-- Create a new column
ALTER TABLE "Vote" ADD COLUMN "new_emoji" TEXT;

-- Copy data from the old column to the new one
UPDATE "Vote" SET "new_emoji" = 
  CASE 
    WHEN "emoji" = 'HAPPY' THEN '😊'
    WHEN "emoji" = 'NEUTRAL' THEN '😐'
    WHEN "emoji" = 'SAD' THEN '😢'
    ELSE "emoji"
  END;

-- Drop the old column
ALTER TABLE "Vote" DROP COLUMN "emoji";

-- Rename the new column to the original name
ALTER TABLE "Vote" RENAME COLUMN "new_emoji" TO "emoji";

-- Add NOT NULL constraint to the new column
ALTER TABLE "Vote" ALTER COLUMN "emoji" SET NOT NULL;

-- Optional: Add a check constraint to ensure only allowed emojis are inserted
ALTER TABLE "Vote" ADD CONSTRAINT "emoji_check" CHECK ("emoji" IN ('😊', '😐', '😢'));
