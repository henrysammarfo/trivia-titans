# 🏛️ Trivia Titans

A premium, ancient-Greek themed trivia management system built with Next.js 16 and Supabase. Track players, manage games, and analyze statistics with a beautiful, responsive interface.

![Trivia Titans](public/assets/hero.jpg)

## ✨ Features

- **🏛️ Premium Design**: Ancient Greek aesthetic with marble textures and gold accents
- **👥 Player Management**: Add, track, and manage trivia players with smart autocomplete
- **📊 Game Tracking**: Record game results with detailed statistics
- **📈 Real-time Stats**: View comprehensive analytics and leaderboards
- **🛡️ Admin Dashboard**: Secure admin panel for game management
- **📱 Mobile Responsive**: Fully optimized for all device sizes
- **🔔 Toast Notifications**: Clean, non-intrusive user feedback
- **⌨️ Keyboard Shortcuts**: Ctrl+S to save, Escape to clear forms

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Framer Motion, Sonner
- **Charts**: Recharts
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/trivia-titans.git
   cd trivia-titans
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database (One-Step):**
   - Go to your Supabase project dashboard.
   - Open the **SQL Editor**.
   - Copy the contents of `COMPLETE_SCHEMA.sql` from this repository.
   - Paste it into the SQL Editor and click **Run**.
   - *This will create all tables, enable security policies, and set up indexes automatically.*

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Asset Setup

To customize the look:
1. Go to `public/assets/`
2. Replace `logo.jpg` with your logo
3. Replace `hero.jpg` with your preferred background image

## 🎮 Usage

1. **Login**: Go to `/admin/login` to access the dashboard.
2. **Add Players**: Use the bulk entry form to add players and scores.
3. **Shortcuts**: Use `Ctrl+S` to save entries quickly.
4. **Leaderboard**: The homepage displays the public leaderboard with filters.

## 🔒 Security

- Admin routes protected with middleware
- Supabase Row Level Security (RLS) policies enforced
- Secure session management

## 📦 Build & Deploy

Build for production:
```bash
npm run build
```

Deploy to **Vercel** (recommended):
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy!

## 📝 License

This project is open source and available under the MIT License.
