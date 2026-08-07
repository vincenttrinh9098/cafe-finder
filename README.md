# iSpots 

A mobile-first web app for discovering and reviewing cafes, tea houses, bakeries, and study spots near you. Users can search by location, leave reviews with photos, and find their perfect study spot.

**Live Demo**: [https://app.vincentktrinh.com](https://app.vincentktrinh.com)

---

## Features

- **Discover nearby places** — search cafes, tea houses, boba spots, and bakeries using Google Places API with location bias
- **Top Rated & Nearby sections** — curated lists based on Google rating and your current location
- **Detailed place info** — opening hours, contact info, Google Maps integration with ETA
- **Community reviews** — submit reviews with noise level, foot traffic, seating, outlets, parking ratings and a study score
- **Photo uploads** — attach up to 5 photos per review, stored in Supabase Storage
- **Study Score** — community-driven score (1–5) helping users find the best study spots
- **Facility Snapshot** — aggregated attribute bars showing the most common community ratings per place
- **User profiles** — view your own reviews and others' public profiles
- **Google OAuth** — secure sign-in with Google via Supabase Auth
- **Swipe-enabled photo viewer** — tap and swipe through review photos on mobile
- **Scroll restoration** — returns you to the exact card you were viewing when navigating back
- **Session caching** — search results and attributes cached in sessionStorage to minimize API calls

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| React Router | Client-side routing |
| Lucide React | Icon library |
| @react-google-maps/api | Google Maps JavaScript SDK |
| Supabase JS | Auth client and direct DB queries |
| CSS Modules | Scoped component styling |

### Backend
| Technology | Purpose |
|---|---|
| Express.js | REST API server |
| Supabase (service role) | Database and storage access |
| Google Places API | Place search, details, photos, nearby |
| Google Distance Matrix API | ETA and driving distance |
| express-validator | Input validation and sanitization |
| express-rate-limit | Rate limiting per route |
| helmet | HTTP security headers |
| multer | Multipart file upload handling |
| morgan | Request logging |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | PostgreSQL database + Auth + Storage |
| Google Cloud | Places API, Maps JavaScript API, Distance Matrix API |

---

## Project Structure

```
cafe-finder/
├── cafe-finder-frontend/         # React/Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── placesApi.js      # All API call functions
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RouteTracker.jsx
│   │   ├── hooks/
│   │   │   ├── useSwipe.js       # Touch swipe gesture hook
│   │   │   ├── useLockBodyScroll.js
│   │   │   └── useTrackLastRoute.js
│   │   ├── lib/
│   │   │   └── supabase.js       # Supabase client config
│   │   ├── pages/
│   │   │   ├── auth/             # OAuth callback
│   │   │   ├── discovery/        # Home, search, nearby, top rated
│   │   │   ├── login/            # Google OAuth login
│   │   │   ├── navigation/       # NavBar
│   │   │   ├── place-details/    # Place info, reviews, map tabs
│   │   │   └── profile/          # User profile and reviews
│   │   └── utils/
│   │       └── distance.js       # Haversine distance calculation
│   └── vercel.json               # SPA routing config
│
└── cafe-finder-backend/          # Express.js backend
    ├── routes/
    │   ├── places.js             # Google Places API proxy routes
    │   └── ratings.js            # Review CRUD + photo upload
    ├── supabase.js               # Supabase service role client
    └── index.js                  # Express app, middleware, server
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with these APIs enabled:
  - Places API
  - Maps JavaScript API
  - Distance Matrix API

### Backend Setup

```bash
cd cafe-finder-backend
npm install
```

Create `cafe-finder-backend/.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_backend_google_api_key
PORT=3000
```

```bash
node index.js
```

### Frontend Setup

```bash
cd cafe-finder-frontend
npm install
```

Create `cafe-finder-frontend/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_frontend_maps_api_key
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
```

```bash
npm run dev
```

---

## Database Schema

### `places`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| google_place_id | text | Unique Google place identifier |
| name | text | Place name |
| address | text | Formatted address |

### `ratings`
| Column | Type | Description |
|---|---|---|
| id | int | Primary key |
| place_id | uuid | Foreign key to places |
| user_id | uuid | Foreign key to auth.users |
| user_name | text | Display name at time of review |
| noise | text | Noise level rating |
| foot_traffic | text | Foot traffic rating |
| seating | text | Seating availability |
| outlet | text | Outlet availability |
| parking | text | Parking availability |
| study_score | int | Study score 1–5 |
| comments | text | Written review |
| photos | jsonb | Array of Supabase Storage URLs |
| created_at | timestamptz | Timestamp |

### `profiles`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key, references auth.users |
| name | text | Display name from Google OAuth |
| initials | text | First letter of name |
| created_at | timestamptz | Timestamp |

---

## Security

- **Row Level Security (RLS)** enabled on all tables
- **JWT token verification** on all mutating API routes (POST/PUT/DELETE)
- **Ownership checks** — users can only edit/delete their own reviews
- **Input validation** on all backend routes via `express-validator`
- **Rate limiting** — search (100/15min), reviews (10/hr), photo uploads (20/hr)
- **CORS** restricted to allowed origins
- **Helmet.js** security headers
- **Google API keys** split — frontend key (referrer-restricted) and backend key (API-restricted)
- **Supabase Storage** policies — authenticated upload, public read
- **Photo cleanup** on review deletion

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `cafe-finder-frontend`
3. Add environment variables
4. Deploy

### Backend (Render)
1. Connect GitHub repo to Render
2. Set root directory to `cafe-finder-backend`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables
6. Deploy

> **Note**: Render free tier spins down after 15 minutes of inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `your-backend-url/ping` every 14 minutes to prevent cold starts.

---

## Environment Variables Reference

### Backend
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |
| `GOOGLE_API_KEY` | Backend Google API key |
| `PORT` | Server port (Render sets this automatically) |
| `NODE_ENV` | Set to `production` on deployment |

### Frontend
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend Maps JavaScript API key |
| `VITE_API_BASE_URL` | Backend base URL |
| `VITE_APP_URL` | Frontend base URL (used for OAuth redirect) |

---

## Authors

- **Vincent Trinh** — [@vincenttrinh9098](https://github.com/vincenttrinh9098)
- **Vincent Nguyen** — [@vincentnguyen1090](https://github.com/vincentnguyen1090)
