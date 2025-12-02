# 🎯 Trivia Titans

A modern, full-featured trivia game management system built with Next.js and Supabase. Track players, manage games, and analyze statistics with a beautiful, responsive interface.

## ✨ Features

- **Player Management**: Add, track, and manage trivia players with autocomplete
- **Game Tracking**: Record game results with detailed statistics
- **Real-time Stats**: View comprehensive analytics and leaderboards
- **Admin Dashboard**: Secure admin panel for game management
- **Mobile Responsive**: Fully optimized for all device sizes
- **Toast Notifications**: Clean, non-intrusive user feedback
- **Dark Mode Support**: Modern UI with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Framer Motion
- **Charts**: Recharts
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/trivia-titans.git
cd trivia-titans
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

4. Set up the database:
- Run the SQL migrations in the `supabase/migrations/` folder in your Supabase SQL editor
- Optionally, run the seed data script to populate sample data

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
trivia-titans/
├── app/              # Next.js app directory (routes & pages)
├── components/       # Reusable React components
├── lib/             # Utility functions and Supabase client
├── public/          # Static assets
├── supabase/        # Database migrations and schema
└── seed_data.ts     # Sample data for testing
```

## 🎮 Usage

1. **Add Players**: Navigate to the admin panel to add new players
2. **Record Games**: Track game results with player scores
3. **View Stats**: Check leaderboards and player statistics
4. **Manage Data**: Edit or delete games through the admin interface

## 🔒 Security

- Admin routes protected with middleware
- Environment variables for sensitive data
- Supabase Row Level Security (RLS) policies

## 📦 Build & Deploy

Build for production:
```bash
npm run build
```

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any Node.js hosting platform

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and Supabase
