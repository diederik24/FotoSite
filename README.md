# Straver Pflanzen Export Website

Next.js website voor Straver Pflanzen Export met Supabase database integratie.

## Features

- Product catalogus met 397+ artikelen
- Supabase database integratie
- Zoekfunctionaliteit
- Responsive design
- Product detail pagina's

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL database)

## Setup

1. Installeer dependencies:
```bash
npm install
```

2. Maak een `.env.local` bestand met je Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run de development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Zie `SUPABASE_SETUP.md` voor instructies over het opzetten van de Supabase database.

## Import Producten

Om producten te importeren naar Supabase:
```bash
npm run import-supabase
```

## Build voor Productie

Voor statische export:
```bash
STATIC_EXPORT=true npm run build
```

Voor normale Next.js build:
```bash
npm run build
```

## Project Structuur

```
straver-website/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── product/           # Product detail pages
│   └── globals.css        # Global styles
├── components/            # React components
├── data/                  # Static product data
├── lib/                   # Utilities (Supabase client, types)
├── public/                # Static assets (images)
└── scripts/               # Utility scripts
```

## License

Private project - Straver Pflanzen Export


