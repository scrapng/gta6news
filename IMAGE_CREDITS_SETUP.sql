-- Image Credits Schema Migration
-- Add image photographer attribution to articles table

-- Add image credit columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_photographer_name TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_photographer_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_source_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_source TEXT DEFAULT 'unsplash';

-- Create index for image credit lookups
CREATE INDEX IF NOT EXISTS idx_articles_image_source ON articles(image_source) WHERE image_source IS NOT NULL;

-- Add comment describing the image credit system
COMMENT ON COLUMN articles.image_photographer_name IS 'Name of the photographer/image creator for proper attribution';
COMMENT ON COLUMN articles.image_photographer_url IS 'URL to photographer profile (e.g., Unsplash profile link)';
COMMENT ON COLUMN articles.image_source_url IS 'URL to original image source for attribution link';
COMMENT ON COLUMN articles.image_source IS 'Image source platform (unsplash, pexels, pixabay, etc)';

-- Verify columns were added
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name='articles' ORDER BY ordinal_position;
