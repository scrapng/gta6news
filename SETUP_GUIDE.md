# GTA6News Portal - Complete Setup Guide

## ✅ What's Been Built

A fully functional, production-ready AI-powered news portal for Grand Theft Auto VI with:

### Core Features
- **AI-Powered Content Generation** using Claude Sonnet 4 API
- **Automated News Pipeline** that searches, deduplicates, generates, and publishes articles
- **Dark Neon Aesthetic** with Vice City-inspired design and animations
- **Responsive Mobile-First UI** with Tailwind CSS
- **Admin Dashboard** for managing articles and viewing pipeline metrics
- **Vercel Cron Jobs** configured for 5x daily automated article generation
- **SEO Optimized** with dynamic metadata, structured data, and sitemaps

### Technology Stack
- Next.js 15 (App Router)
- Supabase (PostgreSQL)
- Anthropic Claude API
- Tavily News Search API
- Unsplash Image API
- Tailwind CSS
- Framer Motion (ready to use)

## 🚀 Next Steps - Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to initialize
4. Go to "SQL Editor" and copy the entire content of `SUPABASE_SETUP.sql`
5. Paste it into the SQL editor and execute it
6. Go to "Settings → API" and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Get API Keys

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or login
3. Go to "API Keys" → Create new key
4. Copy to `.env.local` as `OPENAI_API_KEY`

#### Tavily API Key
1. Go to [tavily.com](https://tavily.com)
2. Sign up and login
3. Go to dashboard and copy API key
4. Copy to `.env.local` as `TAVILY_API_KEY`

#### Unsplash API Key (Optional)
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Create account and app
3. Copy Access Key
4. Copy to `.env.local` as `UNSPLASH_ACCESS_KEY`

### Step 3: Configure Environment Variables

Create `.env.local` with your credentials (template provided):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Tavily
TAVILY_API_KEY=your-tavily-key-here

# Unsplash (optional)
UNSPLASH_ACCESS_KEY=your-unsplash-key-here

# Security
CRON_SECRET=generate-random-string-here-min-32-chars
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
```

### Step 4: Test Locally

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Step 5: Test the Pipeline

1. Go to http://localhost:3000/admin
2. Login with your `NEXT_PUBLIC_ADMIN_PASSWORD`
3. Click "Run Pipeline" button
4. Check the logs and recent articles
5. View generated articles on homepage

## 📁 Project Structure

```
gta6news/
├── app/
│   ├── (site)/                 # Public pages
│   │   ├── page.tsx            # Homepage
│   │   ├── artykuly/           # Articles pages
│   │   └── layout.tsx          # Nav & Footer wrapper
│   ├── api/
│   │   ├── generate/           # Manual trigger endpoint
│   │   ├── cron/               # Vercel Cron endpoint
│   │   └── articles/           # Articles API
│   └── admin/                  # Admin dashboard
├── components/
│   ├── Navbar.tsx              # Navigation
│   ├── HeroSection.tsx         # Landing hero
│   ├── Countdown.tsx           # Countdown timer
│   ├── ArticleCard.tsx         # Article card
│   ├── ArticleGrid.tsx         # Grid layout
│   └── Footer.tsx              # Footer
├── lib/
│   ├── pipeline.ts             # Core AI pipeline (⭐ Main logic)
│   ├── anthropic.ts            # Claude API client
│   ├── supabase.ts             # Database client
│   ├── tavily.ts               # News search client
│   └── utils.ts                # Helpers
├── types/
│   └── index.ts                # TypeScript interfaces
├── app/globals.css             # Global styles
├── tailwind.config.ts          # Tailwind configuration
├── vercel.json                 # Cron configuration
└── SUPABASE_SETUP.sql          # Database schema
```

## 🤖 How the AI Pipeline Works

### Architecture Flow

```
[Tavily API] → Search for news
     ↓
[Deduplication] → Filter out duplicates
     ↓
[Claude Sonnet 4] → Generate original article
     ↓
[Validation] → Check quality, length, content
     ↓
[Unsplash API] → Fetch cover image
     ↓
[Supabase] → Save article to database
     ↓
[Pipeline Logs] → Record execution metrics
```

### Key Files

**`lib/pipeline.ts`** - The core pipeline engine:
- `runPipeline(count, autoPublish)` - Main entry point
- Runs 5x daily via Vercel Cron
- Generates 1-6 articles per run
- Publishes immediately (auto_publish=true)

**`lib/tavily.ts`** - News aggregation:
- Searches 8 different GTA 6 related queries
- Returns 5 results per query
- Deduplicates by URL

**`lib/anthropic.ts`** - Claude API wrapper:
- Uses `claude-sonnet-4-20250514` model
- Custom system prompt for Polish content
- Paraphrasing and original content generation

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository (push your code there first)
- Vercel Pro plan (required for Cron Jobs)

### Steps

1. **Push code to GitHub**
   ```bash
   git remote add github https://github.com/yourusername/gta6news.git
   git push github main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Set environment variables in "Settings → Environment Variables"
   - Deploy!

3. **Enable Cron Jobs**
   - Go to project settings
   - Go to "Crons"
   - Enable cron job support (requires Pro plan)
   - Jobs will start running at scheduled times

## 📊 Admin Dashboard Features

Access at `/admin` with your password:

- **Statistics Dashboard**
  - Total articles generated
  - Published vs draft count
  - Automated tracking

- **Pipeline Logs**
  - View all past runs
  - Check execution times
  - See error messages
  - Track articles generated

- **Article Management**
  - List all recent articles
  - Publish draft articles
  - Reject low-quality articles
  - Quick status updates

- **Manual Triggers**
  - Generate articles on-demand
  - Test pipeline functionality
  - Monitor in real-time

## 🎨 Customization Guide

### Change Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  accent: {
    'neon-pink': '#ff2d78',    // Main accent
    'neon-cyan': '#00d4ff',    // Secondary
    'neon-yellow': '#ffd60a',  // Highlights
  }
}
```

### Change Article Categories

Edit `types/index.ts`:
```typescript
export type ArticleCategory = 
  | 'news' | 'gameplay' | 'story' 
  | 'leaks' | 'community' | 'analysis'
  | 'your-new-category'; // Add here
```

### Modify AI Prompt

Edit `lib/pipeline.ts` → `SYSTEM_PROMPT` variable to change writing style, language, or content approach.

### Change Article Generation Frequency

Edit `vercel.json` to modify cron schedule:
```json
{
  "path": "/api/cron",
  "schedule": "0 6 * * *"  // Change this to: 0 8 * * * (8 AM UTC)
}
```

## 🔧 Troubleshooting

### Pipeline not generating articles

**Check logs:**
1. Go to admin panel (`/admin`)
2. Check "Recent Runs" section
3. Look for error messages

**Common issues:**
- API keys invalid - verify in `.env.local`
- Supabase connection failed - check URL and keys
- Rate limiting - wait a few minutes between manual triggers
- No new sources found - Tavily API might be down

### Articles not appearing on homepage

- Check article status in admin (should be "published")
- Check Supabase database directly
- Clear browser cache (Ctrl+Shift+R)
- Check ISR revalidation (up to 60 seconds delay)

### Build errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📈 Performance Tips

1. **Image Optimization**
   - Images use Next.js Image component
   - Automatic WebP conversion
   - Lazy loading enabled

2. **Caching Strategy**
   - Homepage cached at build time
   - Article pages use ISR (60-second revalidate)
   - API responses cached via headers

3. **Database Indexes**
   - Optimized for published_at queries
   - Category filtering indexed
   - Status checks indexed

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use strong admin password** - Minimum 12 characters
3. **Rotate CRON_SECRET regularly** - Change monthly
4. **Keep API keys secret** - Don't share in URLs
5. **Enable Supabase RLS** - Already configured in schema

## 📝 Next Features to Add

- Newsletter signup integration (Beehiiv)
- Google AdSense integration
- Amazon affiliate links
- Social media sharing
- Reading progress bar
- Comments system
- Search functionality
- Article recommendations
- Analytics dashboard

## 📚 API Documentation

### POST /api/generate

Generate articles manually:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "x-api-key: your-cron-secret" \
  -H "Content-Type: application/json" \
  -d '{"count": 1, "auto_publish": true}'
```

### GET /api/articles

Fetch articles with filters:

```bash
# Published articles
curl "http://localhost:3000/api/articles?status=published&limit=10"

# By category
curl "http://localhost:3000/api/articles?category=news&limit=20"

# With pagination
curl "http://localhost:3000/api/articles?limit=10&offset=10"
```

## 🎯 Launch Checklist

Before going live:

- [ ] Test pipeline generates articles
- [ ] Admin dashboard works
- [ ] All environment variables set
- [ ] Database schema created
- [ ] Vercel deployed
- [ ] Cron jobs enabled
- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place

## 📞 Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Tavily API Docs](https://tavily.com/docs)

---

**GTA 6 Release**: November 19, 2026 | PS5 & Xbox Series X|S

Good luck with your portal! 🚀🎮
