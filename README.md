# TourStack - Tour Management App

A modern tour management application built with Next.js and Supabase.

## Features
- 📊 Dashboard with tour overview
- 🎤 Tour stops with expandable details
- 🗺️ Interactive map with venue markers
- 🏨 Hotels management
- ✈️ Travel/transportation tracker
- ✅ Task management with priority filters
- 👥 Guest list management

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file (already done) with your Supabase credentials.

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel

1. Push this folder to your GitHub repo (`ryan57smith/tour-manager-app`)
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repo
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
6. Click Deploy!

### 5. Google Maps (Optional)
To enable the live map on the /map page:
1. Get a Google Maps API key at https://console.cloud.google.com
2. Replace `AIzaSyD-placeholder` in `pages/map.tsx` with your key
3. Add it to Vercel environment variables as `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + real-time)
- **Fonts**: Bebas Neue (display) + DM Sans (body)
- **Deployment**: Vercel
