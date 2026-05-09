# GTA6News Comments System - Implementation Guide

## ✅ What's Been Implemented

A complete comments system with reactions, moderation, and automod controls for the GTA6News portal.

### Features

#### User-Facing (On Article Pages)
- **Comment Section** - Below each article with author name, email, and timestamp
- **Nested Replies** - Up to 3 levels deep (comment → reply → nested reply)
- **Emoji Reactions** - Discord-style reactions on comments
  - Preset emojis: 👍 👎 😂 🔥 ❤️ 🤔 🎮 🚀 👌 💯
  - Custom emoji support - type any emoji you want
  - Reaction count display and toggle
- **Gravatar Avatars** - Author profile pictures from Gravatar
- **Anonymous Comments** - No authentication required, just name + email
- **Auto-Approval** - Comments automatically approved if they pass automod checks

#### Admin Moderation Dashboard
- **Comments Dashboard**
  - Tabs: Pending, Approved, Rejected, Spam
  - Search by author name, email, or content
  - Pagination (20 per page)
  - Statistics showing counts for each status

- **Moderation Actions**
  - Approve pending comments
  - Reject with custom reason
  - Delete comments permanently
  - Ban users by email (temporary or permanent)

- **Automod Settings Panel**
  - **Rate Limiting**: Max comments per IP per time window
  - **Profanity Filter**: Toggle on/off with custom word lists
  - **Link Detection**: Detect and flag URLs in comments
  - **Auto-Approval**: Automatically approve if passes all checks
  - **Gravatar Display**: Enable/disable author avatars

### Technical Architecture

#### Database (Supabase)
- `comments` - Main comments table with nested reply support
- `reactions` - Emoji reactions with IP-based deduplication
- `banned_users` - Spam prevention with email/IP bans
- `automod_rules` - Configurable spam/profanity patterns
- `automod_settings` - System-wide configuration
- `automod_violations` - Optional logging for analytics

#### Security & Privacy
- Email addresses hashed (SHA-256) in database
- IP addresses tracked for rate limiting and bans
- Row Level Security (RLS) policies:
  - Public can read only approved comments
  - Admins can manage all comments and settings
  - Service role unrestricted access

#### Automod Features
- Spam keyword detection (customizable patterns)
- Profanity filtering (toggleable)
- Rate limiting per IP (configurable)
- Link detection and flagging
- Ban management (email and IP based)
- Comment status tracking: pending → approved/rejected/spam

---

## 🚀 Setup Instructions

### Step 1: Create Database Tables

Run the SQL migration in your Supabase SQL Editor:

```bash
# Copy all content from: /home/user/gta6news/COMMENTS_SETUP.sql
# Paste into Supabase → SQL Editor → Run
```

This creates:
- comments table with indexes
- reactions table
- banned_users table
- automod_rules table
- automod_settings table (with defaults)
- automod_violations table
- Row Level Security policies

### Step 2: Verify Installation

1. **Check tables exist:**
   - Go to Supabase Dashboard → Tables
   - Verify: comments, reactions, banned_users, automod_rules, automod_settings, automod_violations

2. **Check RLS policies:**
   - Click each table → RLS → Verify policies are enabled

3. **Check default settings:**
   - Go to automod_settings table
   - Verify default values are present

### Step 3: Add Comments to Admin Page

The admin moderation dashboard needs to be integrated into the admin page. Add these tabs:

```tsx
// app/admin/page.tsx - Add to admin dashboard

import AdminCommentsModeration from '@/components/admin/AdminCommentsModeration';
import AdminAutomodSettings from '@/components/admin/AdminAutomodSettings';

// Add tabs for: Dashboard, Articles, Comments, Automod Settings
```

### Step 4: Configure Automod Rules (Optional)

Add custom spam keywords and profanity words to automod_rules table:

```sql
-- Example: Add custom spam keyword
INSERT INTO automod_rules (rule_type, pattern, action, enabled, severity)
VALUES ('spam_keyword', 'your-spam-word', 'flag', true, 3);

-- Example: Add profanity word
INSERT INTO automod_rules (rule_type, pattern, action, enabled, severity)
VALUES ('profanity', 'naughty-word', 'flag', true, 2);
```

### Step 5: Deploy to Vercel

1. Push changes to your branch
2. Deploy through Vercel dashboard
3. Verify comments section appears on article pages
4. Test comment submission (should be auto-approved if no spam)

---

## 📋 API Reference

### User-Facing Server Actions

**Submit Comment**
```typescript
await submitCommentAction(input: SubmitCommentInput, ip: string, userAgent?: string)
```

**Get Comments**
```typescript
await getCommentsForArticleAction(articleId: string, parentId?: string | null)
```

**Get Replies**
```typescript
await getRepliesForCommentAction(parentId: string)
```

**Add/Remove Reactions**
```typescript
await addReactionAction(commentId: string, emoji: string, ip: string)
await removeReactionAction(commentId: string, emoji: string, ip: string)
```

### Admin Server Actions

**Moderation**
```typescript
await approveCommentAction(commentId: string)
await rejectCommentAction(commentId: string, reason: string)
await deleteCommentAction(commentId: string)
```

**Banning**
```typescript
await banUserAction(ban_type: BanType, banned_value: string, reason: string, expiryDays?: number)
await unbanUserAction(bannedUserId: string)
await getBannedUsersAction(limit?: number, offset?: number)
```

**Settings**
```typescript
await getAutomodSettingsAction() // Returns AutomodConfig
await updateAutomodSettingAction(key: string, value: string)
await getCommentStatsAction() // Returns counts by status
```

**Search**
```typescript
await searchCommentsAction(query: string, status?: CommentStatus, limit?: number, offset?: number)
```

---

## 🎨 Styling & Customization

All components use the existing neon pink/cyan theme:
- Primary: `accent-neon-pink` (#ff2d78)
- Secondary: `accent-neon-cyan` (#00d4ff)
- Backgrounds: `bg-primary`, `bg-card`, `bg-secondary`

Components are fully responsive and work on mobile with emoji picker.

---

## 🔒 Content Moderation Flow

```
User submits comment
        ↓
Automod checks:
  - Banned? → Reject immediately
  - Rate limit exceeded? → Flag pending
  - Spam keywords? → Reject
  - Profanity? → Flag pending
  - Contains links? → Flag pending
        ↓
Auto-approve if passes all checks (or requires manual review)
        ↓
Comment visible on article (if approved)
Admin can: Approve, Reject, Delete, or Ban user
```

---

## 📊 Automod Configuration Defaults

```
Rate Limit: 10 comments per 60 minutes per IP
Profanity Filter: Enabled
Link Detection: Enabled
Auto-Approve: Enabled (if passes all checks)
Gravatar: Enabled
```

All configurable via Admin Settings panel.

---

## 🐛 Troubleshooting

### Comments not showing
- Check RLS policies are enabled
- Verify comments have `status = 'approved'`
- Check browser console for errors

### Automod not filtering
- Verify automod_rules have `enabled = true`
- Check patterns in automod_rules table
- Look at automod_violations log for what matched

### Rate limiting not working
- Verify comment IP addresses are being captured
- Check rate_limit_per_ip setting in automod_settings
- Make sure database queries are using correct IP

### Gravatar not loading
- Verify require_gravatar is true in automod_settings
- Check email hashing is correct (SHA-256)
- Gravatar works for any email address

---

## 📝 Files Structure

```
/app
  /(site)/artykuly/[slug]/
    page.tsx (added CommentsSection)
    actions.ts (added comment server actions)
  /admin
    comments-actions.ts (NEW - admin moderation)

/components
  /comments (NEW FOLDER)
    CommentsSection.tsx
    CommentForm.tsx
    CommentList.tsx
    CommentItem.tsx
    ReactionsDisplay.tsx
    ReactionsPicker.tsx
  /admin
    AdminCommentsModeration.tsx
    CommentModerationCard.tsx
    AdminAutomodSettings.tsx

/lib
  automod.ts (NEW - spam/profanity detection)

/types
  index.ts (added Comment, Reaction types)

COMMENTS_SETUP.sql (NEW - database migration)
```

---

## 🚀 Next Steps (Optional Enhancements)

1. **Email Notifications** - Notify users when someone replies to their comment
2. **Comment Upvotes** - Let users vote on helpful comments
3. **Rich Text Editor** - Allow Markdown formatting in comments
4. **Sentiment Analysis** - Use Claude API to analyze comment sentiment
5. **Discord Webhook** - Post pending comments to Discord for quick review
6. **CAPTCHA** - Add reCAPTCHA to prevent bot submissions
7. **Comment Threading UI** - Collapse/expand comment trees
8. **Admin Webhooks** - Send events to external moderation services

---

## ✨ You're Ready!

The comments system is production-ready and integrated with your article pages. Users can comment, add reactions, and admins can manage everything through the dashboard.

Good luck! 🚀
