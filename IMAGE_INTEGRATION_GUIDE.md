# Image Integration Guide - GTA6News Portal

## Overview

This document describes the complete image integration system implemented for GTA6News portal, including image fetching from Unsplash, photographer attribution, and proper copyright compliance.

## Architecture

### Core Components

#### 1. **Database Schema** (IMAGE_CREDITS_SETUP.sql)
Extends the `articles` table with image metadata columns:
- `image_photographer_name` - Name of the photographer
- `image_photographer_url` - Link to photographer's profile
- `image_source_url` - Link to image source for attribution
- `image_source` - Platform identifier (e.g., 'unsplash')

**Deployment Instructions:**
1. Log in to Supabase Dashboard
2. Navigate to SQL Editor
3. Create new query
4. Copy and paste the contents of `IMAGE_CREDITS_SETUP.sql`
5. Execute the query

#### 2. **Image Service** (lib/unsplash.ts)
Provides complete image handling with full metadata capture:

```typescript
export interface UnsplashImageMetadata {
  url: string | null;
  photographerName: string;
  photographerUrl: string | null;
  imageSourceUrl: string | null;
  source: 'unsplash' | 'internal';
}

export async function getImageFromUnsplash(query: string): Promise<UnsplashImageMetadata>
export async function generateImageSearchQueries(title: string, content: string, category: string): Promise<string[]>
```

**Key Features:**
- AI-generated image search queries (Claude) based on article content
- Multi-tier fallback search strategy
- Complete metadata capture for photographer attribution
- Graceful degradation to placeholder images if API fails

#### 3. **Attribution Component** (components/ImageCredit.tsx)
Reusable React component for displaying photographer credits:

**Variants:**
- `article` - Full attribution with photographer name, image source, and links
- `card` - Minimal footer overlay for article cards

**Props:**
```typescript
interface ImageCreditProps {
  photographerName?: string;
  photographerUrl?: string;
  imageSourceUrl?: string;
  imageSource?: string;
  variant?: 'article' | 'card';
}
```

#### 4. **Pipeline Integration** (lib/pipeline.ts)
Enhanced article generation pipeline that:
1. Generates context-aware search queries using Claude AI
2. Fetches images from Unsplash with full metadata
3. Implements fallback search strategies
4. Stores complete image metadata in database
5. Maintains photographer attribution records

## Implementation Details

### Phase 1: Database
- Created `IMAGE_CREDITS_SETUP.sql` migration
- Added 4 new columns to articles table
- Created index for efficient lookups
- Added documentation comments

### Phase 2: Image Service
- Implemented `lib/unsplash.ts` module
- Created `UnsplashImageMetadata` interface
- Implemented `getImageFromUnsplash()` with fallback logic
- Implemented `generateImageSearchQueries()` using Claude AI
- Added utility functions for credit formatting

### Phase 3: Type Definitions
- Updated `Article` interface in `types/index.ts`
- Updated `CreateArticleInput` interface
- Added image metadata fields to both interfaces
- Ensured type safety throughout the application

### Phase 4: Attribution Component
- Created `components/ImageCredit.tsx`
- Implemented both `article` and `card` variants
- Added responsive styling
- Integrated with existing design theme

### Phase 5: Pipeline Enhancement
- Updated `lib/pipeline.ts` to use new image system
- Integrated AI-generated search queries
- Implemented full metadata storage
- Added photographer attribution to all new articles

### Phase 6: Article Cards
- Updated `components/ArticleCard.tsx`
- Added ImageCredit display in card variant
- Shows photographer name as footer overlay
- Maintains minimal visual footprint

### Phase 7: Category Pages
- Enhanced `app/(site)/kategorie/[slug]/page.tsx`
- Added featured article section
- Displays full-size image with title overlay
- Shows complete photographer attribution

### Phase 8: Homepage
- Enhanced `app/(site)/page.tsx`
- Added featured article section
- Displays large hero-style featured image
- Excludes featured article from main grid

### Phase 9: Admin Panel
- Updated `app/admin/page.tsx`
- Display image thumbnails in article listings
- Show photographer names and image sources
- Track image metadata for compliance

### Phase 10: SEO Structured Data
- Added schema.org NewsArticle schema
- Included photographer attribution in metadata
- Added `creditText` and `copyrightHolder` fields
- Improves search engine visibility for images and credits

### Phase 11: About Page
- Created `app/(site)/o-nas/page.tsx`
- Documented image attribution policy
- Explained Unsplash licensing
- Listed all stored image metadata
- Updated footer with links to attribution information

## File Structure

```
gta6news/
├── lib/
│   ├── unsplash.ts                 # Image service
│   └── pipeline.ts                 # Updated pipeline
├── components/
│   ├── ImageCredit.tsx             # Attribution component
│   ├── ArticleCard.tsx             # Updated with image credits
│   └── AdminArticleActions.tsx      # Updated admin panel
├── app/
│   ├── (site)/
│   │   ├── page.tsx                # Updated homepage
│   │   ├── artykuly/[slug]/page.tsx # Updated article page
│   │   ├── kategorie/[slug]/page.tsx # Updated category page
│   │   ├── o-nas/                  # About page
│   │   │   └── page.tsx
│   │   └── admin/page.tsx           # Updated admin dashboard
│   └── ...
├── types/
│   └── index.ts                    # Updated interfaces
├── IMAGE_CREDITS_SETUP.sql         # Database migration
└── IMAGE_INTEGRATION_GUIDE.md      # This file
```

## Database Migration

### Required SQL
Execute `IMAGE_CREDITS_SETUP.sql` in Supabase SQL Editor:

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_photographer_name TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_photographer_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_source_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_source TEXT DEFAULT 'unsplash';

CREATE INDEX IF NOT EXISTS idx_articles_image_source ON articles(image_source) WHERE image_source IS NOT NULL;
```

### Verification
After running migration:
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name='articles' 
ORDER BY ordinal_position;
```

## Environment Variables

Required for image fetching:
```env
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

To get Unsplash API key:
1. Visit https://unsplash.com/developers
2. Register as developer
3. Create an application
4. Copy the Access Key
5. Add to `.env.local`

## Features

### For Users
- ✅ Professionally sourced images on all articles
- ✅ Clear photographer attribution on every image
- ✅ Clickable links to photographer profiles
- ✅ Visual consistency across the platform
- ✅ Responsive images at all breakpoints
- ✅ Fast image loading with CDN optimization

### For Administrators
- ✅ View image metadata in admin panel
- ✅ Track photographer names and sources
- ✅ Monitor image attribution compliance
- ✅ Automatic image source documentation
- ✅ Search-friendly metadata storage

### For Compliance
- ✅ Complete photographer attribution
- ✅ Proper Unsplash license compliance
- ✅ Legal image sourcing documentation
- ✅ Searchable attribution records
- ✅ Schema.org structured data
- ✅ Public About page explaining image usage

## Testing

### Manual Testing
1. **Article Pages**
   - Verify hero image displays with photographer credit
   - Check credit link points to Unsplash profile
   - Test on mobile (sm, md, lg breakpoints)

2. **Article Cards**
   - Verify photographer name shows in card overlay
   - Check visibility on different screen sizes
   - Confirm hover effects work

3. **Admin Panel**
   - View article with image thumbnail
   - Check photographer name displays
   - Verify image source information

4. **Homepage & Categories**
   - Featured article displays large image
   - Photographer credit visible below
   - Links functional

### Browser Testing
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

### Image Optimization
- Next.js Image component with automatic optimization
- Responsive image sizes via `sizes` prop
- Format optimization (AVIF/WebP when supported)
- CDN delivery via Unsplash

### Database
- Index created on `image_source` for efficient queries
- No additional performance impact
- Lightweight metadata storage

### API Rate Limiting
- Unsplash API: 50 requests/hour (free tier)
- Claude API: Integrated in pipeline, standard rate limits
- Consider implementing caching for high-traffic periods

## Future Enhancements

- [ ] Image caching strategy for API optimization
- [ ] Batch image metadata updates
- [ ] Analytics on photographer attribution
- [ ] Alternative image sources (Pexels, Pixabay)
- [ ] Image editing tools in admin panel
- [ ] Custom image upload support

## Troubleshooting

### Images not displaying
1. Check UNSPLASH_ACCESS_KEY is set
2. Verify Unsplash API quota
3. Check image URL in database is valid
4. Review server logs for API errors

### Missing photographer information
1. Verify image was fetched with correct metadata
2. Check database columns exist and contain data
3. Ensure ImageCredit component receives props
4. Check browser console for component errors

### Database migration issues
1. Verify you have database write permissions
2. Check for existing column conflicts
3. Review Supabase error messages
4. Ensure raw SQL mode is enabled

## References

- [Unsplash API Documentation](https://unsplash.com/developers)
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [Schema.org NewsArticle](https://schema.org/NewsArticle)
- [Unsplash License](https://unsplash.com/license)

## Support

For issues or questions:
1. Check this documentation
2. Review admin panel for image metadata
3. Check server logs and database
4. Review About page (/o-nas) for policy information
