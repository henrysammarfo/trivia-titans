# Trivia Titans 🏆

A bilingual (English/Spanish) trivia leaderboard application for Malaga Trivia quiz nights, built with Next.js and Supabase.

## 🌟 Features

- **Bilingual Support**: Full English and Spanish translations with language toggle
- **Real-time Leaderboard**: Track player scores across multiple quiz sessions
- **Admin Panel**: Secure admin interface for managing quiz results
- **Responsive Design**: Optimized for both mobile and desktop
- **Malaga Branding**: Custom Red/Black theme matching Malaga Trivia identity

## 🚀 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-intl
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide Icons

## 📋 Prerequisites

- Node.js 20+ and npm
- Supabase account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/henrysammarfo/trivia-titans.git
cd trivia-titans
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from `COMPLETE_SCHEMA.sql`
4. Verify tables: `players`, `results`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
trivia-titans/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer
│   ├── LeaderboardTable.tsx
│   └── LanguagePicker.tsx
├── lib/                   # Utilities
│   └── supabase.ts        # Supabase client
├── messages/              # i18n translations
│   ├── en.json           # English
│   └── es.json           # Spanish
├── public/assets/         # Static assets
└── supabase/migrations/   # Database migrations
```

## 🎨 Branding

- **Primary Color**: Malaga Red (#E31C23)
- **Secondary Color**: Black (#1A1A1A)
- **Font**: Oswald (headings), Lato (body)
- **Logo**: Located in `/public/assets/malaga logo.jpg`

## 🔐 Admin Access

The admin panel is located at `/admin/login`. Access is controlled via Supabase authentication.

**Default Setup:**
- Admin users must be created in Supabase Auth dashboard
- Row Level Security (RLS) is enabled on all tables

## 📊 Adding Quiz Results

1. Log in to admin panel
2. Select quiz date
3. Enter player names and scores (0-40)
4. Click "Save Results"

Results are automatically aggregated for the leaderboard.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain

1. Go to Vercel project settings
2. Add domain `trivia-titans.com`
3. Configure DNS records as shown by Vercel

## 🐛 Troubleshooting

**Build fails:**
- Verify all environment variables are set
- Run `npm run build` locally to check for errors

**Database connection issues:**
- Check Supabase URL and anon key
- Verify RLS policies are configured

**Images not loading:**
- Ensure images are in `/public/assets/`
- Check Next.js Image component configuration

## 📝 Future Enhancements

See `feature_backlog.md` for planned features including:
- Delete user/quiz functionality
- CSV export
- Season-based archiving

## 📄 License

Private project for Malaga Trivia.

## 👥 Contact

For questions or support, contact the development team.

---

**Last Updated**: December 2025
**Version**: 1.0.0
