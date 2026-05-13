# Step Challenge App - MVP

A modern fitness challenge app where users join step-based challenges, contribute entry fees to a prize pool, and compete to complete daily step goals. Features a dark, premium UI with real-time progress tracking and leaderboards.

## Features

- **Discover Challenges**: Browse upcoming, live, and available challenges
- **Challenge Details**: View full challenge information, rules, and participant list
- **Join Flow**: Secure entry with wallet integration and payment confirmation
- **Active Tracking**: Real-time step sync, daily progress, and streak tracking
- **Wallet System**: Track balance, deposits, withdrawals, and transaction history
- **Leaderboards**: Global rankings and personal performance metrics
- **Profile Management**: User settings and challenge history

## Tech Stack

- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Router**: Expo Router
- **Icons**: lucide-react-native
- **Styling**: Native StyleSheet with custom theme system
- **Utilities**: date-fns for date handling
- **Backend**: Mock API (ready for Supabase/Firebase integration)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (optional): `npm install -g expo-cli`

### Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

### Running the App

```bash
# Start Expo development server
npm start

# or
yarn start

# Then press:
# i - for iOS simulator
# a - for Android emulator
# w - for web

# Or scan QR code with Expo Go app
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ChallengeCard.tsx
│   ├── ProgressBar.tsx
│   ├── StatCard.tsx
│   └── TabBar.tsx
├── screens/          # Application screens
│   ├── DiscoverScreen.tsx
│   ├── ChallengeDetailScreen.tsx
│   ├── JoinChallengeScreen.tsx
│   ├── ActiveChallengeScreen.tsx
│   ├── MyChallengesScreen.tsx
│   ├── LeaderboardScreen.tsx
│   ├── ProfileScreen.tsx
│   └── WalletScreen.tsx
├── services/         # API layer and mock data
│   ├── api.ts
│   └── mockData.ts
├── store/           # Zustand global state
│   └── appStore.ts
├── theme/           # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── types/           # TypeScript definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── time.ts
├── RootLayout.tsx   # Main app layout & navigation
├── App.tsx          # Entry point
└── constants/       # App constants
    └── index.ts
```

## Design System

The app uses a premium dark theme with the following color palette:

- **Primary Background**: #0f0f0f (near black)
- **Secondary Background**: #1a1a1a (dark gray)
- **Accent Colors**: Gold (#ffd700), Orange (#ff8c42), Lime (#bfff00), Pink (#ff006e)
- **Status Colors**: Success (#4ade80), Warning (#facc15), Error (#ef4444)

### Typography Scale

- **xs**: 12px
- **sm**: 14px
- **base**: 16px
- **lg**: 18px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 30px
- **4xl**: 36px

### Spacing Scale

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px
- **4xl**: 64px

## Data Models

### Challenge
```typescript
{
  id: string
  name: string
  description: string
  createdBy: string
  dailyTarget: number      // steps per day
  durationDays: number
  entryFee: number
  prizePool: number
  participantCount: number
  status: 'upcoming' | 'live' | 'completed'
  startDate: string
  endDate: string
}
```

### User & Wallet
```typescript
User: {
  id: string
  name: string
  email: string
  createdAt: string
}

Wallet: {
  id: string
  userId: string
  balance: number
  totalDeposited: number
  totalWithdrawn: number
}
```

### Participant & Checkin
```typescript
ChallengeParticipant: {
  id: string
  challengeId: string
  userId: string
  status: 'active' | 'eliminated' | 'completed'
  daysCompleted: number
}

DailyCheckin: {
  id: string
  challengeId: string
  userId: string
  date: string
  steps: number
  targetMet: boolean
}
```

## Current Features

### MVP Screens

1. **Discover** - Search and browse challenges
   - Categorized sections (Upcoming, Available, Live)
   - Full-text search
   - Challenge cards with key metrics

2. **Challenge Details** - Full challenge information
   - Prize pool visualization
   - Rules and how-it-works guide
   - Participant list with avatars
   - Countdown timer for upcoming challenges

3. **Join Flow** - Entry and payment
   - Challenge summary
   - Wallet balance check
   - Payment confirmation
   - Success message

4. **Active Challenge** - Real-time tracking
   - Daily step count with live sync
   - Daily progress bars
   - Streak and days remaining
   - History of all daily checkins

5. **My Challenges** - User's active/upcoming challenges
   - Quick stats per challenge
   - Status indicators

6. **Leaderboard** - Global rankings
   - Top 8 steppers
   - User's current rank
   - Badge display

7. **Wallet** - Balance and transactions
   - Wallet overview with balance
   - Account statistics
   - Transaction history
   - Mock Add/Withdraw buttons

8. **Profile** - User information
   - User profile card
   - Account statistics
   - Settings section

## Mock Data

The app comes with comprehensive mock data:
- 5 sample challenges (varying durations, entry fees, participant counts)
- Sample participants and daily checkins
- Transaction history
- Leaderboard rankings

All API calls simulate network delays (150-500ms) for realistic UX testing.

## Future Enhancements

### Ready to Integrate

1. **Real Backend**
   - Supabase integration (schema ready)
   - Firebase as alternative
   - User authentication (OAuth)

2. **Step Tracking**
   - Apple HealthKit integration
   - Google Fit integration
   - Wearable device support
   - Real-time step data sync

3. **Payments**
   - Stripe integration
   - PayPal integration
   - Wallet top-up flow
   - Prize distribution

4. **Notifications**
   - Daily reminders
   - Challenge start alerts
   - Achievement notifications
   - Real-time updates

5. **Social Features**
   - Friend challenges
   - Team competitions
   - Challenge creation UI
   - Comments and messaging

6. **Analytics**
   - Performance tracking
   - User behavior analytics
   - Challenge completion rates
   - Revenue analytics

### Code Quality

- Add unit tests (Jest + React Native Testing Library)
- Add E2E tests (Detox)
- Set up CI/CD pipeline
- Add code coverage reporting
- API documentation

## Performance Optimization

- React Native Reanimated for smooth animations
- Lazy loading for challenge lists
- Memoization of expensive components
- Optimized image handling
- Debounced search

## Known Limitations (MVP)

- Mock API with simulated data
- Step data is randomly generated
- No real payment processing
- No persistent authentication
- No background sync
- No offline mode
- Limited to 5 sample challenges

## File Size

The app is optimized for mobile:
- ~15MB base app size (with assets)
- Lazy-loaded components
- Tree-shaking enabled
- Minified production build

## Browser Support

Works on:
- iOS 13+ (via Expo Go or development build)
- Android 8+ (via Expo Go or development build)
- Web (limited, via `expo start --web`)

## Testing

To test key flows:

1. **Join Challenge**
   - Go to Discover
   - Select "Cash Club"
   - Review details
   - Click "Join Challenge"
   - Confirm payment

2. **Track Steps**
   - Go to "My Challenges"
   - Click "Quick Win" (currently live)
   - Click "Sync Steps"
   - Observe progress update

3. **Check Wallet**
   - Go to Wallet tab
   - See balance: $2500
   - Review transactions

## Support

For development questions or issues:
1. Check the mock data in `src/services/mockData.ts`
2. Review type definitions in `src/types/index.ts`
3. Inspect API layer in `src/services/api.ts`
4. Check component implementations in `src/components/`

## License

MIT
