# FitTrack Architecture & Setup Guide

**Date:** April 17, 2026  
**Version:** 1.0.0

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Setup Instructions](#setup-instructions)
5. [Running the Application](#running-the-application)
6. [Environment Configuration](#environment-configuration)
7. [Database Schema](#database-schema)
8. [System Architecture](#system-architecture)
9. [Data Flow Diagrams](#data-flow-diagrams)

---

## Project Overview

**FitTrack** is a Progressive Web App (PWA) fitness tracking platform that helps users log workouts, track goals, and monitor their fitness progress.

**Key Features:**
- User authentication (email/password via Supabase)
- Workout logging with exercise sets
- Goal tracking with progress monitoring
- Analytics dashboard with charts
- User profiles with biometric data
- Responsive design (mobile, tablet, desktop)

**Tech Philosophy:**
- Minimalist backend (Express.js routing to Supabase)
- Client-rendered frontend (Vanilla JS + Tailwind CSS)
- No build process (direct script tags)
- Focus on user experience over frameworks

---

## Technology Stack

### Frontend
```
├── HTML5
├── CSS3 (Tailwind CSS via CDN)
├── JavaScript (ES6+, Vanilla)
└── External Libraries:
    ├── Tailwind CSS (utility CSS framework)
    ├── Material Symbols Outlined (icons)
    └── Google Fonts (typography)
```

**Why Tailwind?**
- No build setup required (CDN delivery)
- Consistent design system
- Responsive utility classes
- Custom color theme via config

**No Frameworks:**
- No React, Vue, or Angular
- Direct script tags load JS files
- Minimal dependencies
- Faster initial load

### Backend
```
Express.js
├── Routing (api/auth, /api/workouts, /api/goals, /api/user)
├── Middleware (CORS, JSON parsing, authentication)
├── Static file serving (public folder)
└── Proxy to external services
```

**Minimal Backend:**
- No database on server
- All data stored in Supabase
- Server mainly routes requests
- Auth token validation only

### Database/Backend-as-a-Service
```
Supabase (PostgreSQL + Auth + Real-time)
├── Authentication (Email/Password signup & login)
├── Database Tables:
│   ├── users (managed by Supabase Auth)
│   ├── profiles (custom user data)
│   ├── workouts (exercise sessions)
│   ├── workout_sets (individual sets)
│   └── goals (fitness objectives)
└── REST API (automatically generated)
```

**Supabase Benefits:**
- Managed PostgreSQL database
- Built-in authentication
- Auto-generated REST API
- JWT tokens for validation
- No server-side database management

### Document Format
```
Environment Variables: .env file
Configuration: Implicit in code
Deployment: Vercel (configured in vercel.json)
```

---

## Directory Structure

```
fitness-tracker-app/
│
├── public/                          # Frontend assets (served statically)
│   ├── index.html                   # Served at root (unused, routes use specific HTML)
│   ├── landing.html                 # Public homepage
│   ├── login.html                   # Authentication page
│   ├── signup.html                  # Registration page
│   ├── dashboard.html               # Main hub after login
│   ├── workout.html                 # Workout logging & history
│   ├── goals.html                   # Goal tracking
│   ├── progress.html                # Analytics & charts
│   ├── profile.html                 # User profile & settings
│   ├── css/                         # Stylesheets (currently empty)
│   │   └── [future styles]
│   └── js/                          # Client-side JavaScript
│       ├── auth.js                  # AuthService class for signup/login
│       ├── workouts.js              # Workouts API wrapper & rendering
│       ├── goals.js                 # Goals API wrapper & rendering
│       ├── dashboard.js             # Dashboard logic
│       ├── progress.js              # Progress page logic
│       └── profile.js               # Profile page logic
│
├── server/                          # Backend (Node.js + Express)
│   ├── app.js                       # Express app setup & routing
│   ├── index.js                     # Server startup (listens on PORT)
│   ├── lib/
│   │   └── supabase.js              # Supabase API integration functions
│   ├── middleware/
│   │   └── auth.js                  # requireAuth middleware for protected routes
│   └── routes/
│       ├── auth.js                  # POST /signup, /login, /logout
│       ├── workouts.js              # GET/POST /workouts, POST /sets
│       ├── goals.js                 # GET/POST/PATCH /goals
│       └── user.js                  # GET/POST/PATCH /user/profile
│
├── tests/                           # Test files
│   ├── auth.routes.test.js
│   ├── goals.helpers.test.js
│   └── progress.helpers.test.js
│
├── docs/                            # Documentation
│   └── superpowers/                 # Project planning
│       ├── plans/
│       │   └── 2026-04-17-goals-page.md
│       └── specs/
│           └── 2026-04-17-goals-page-design.md
│
├── .env                             # Environment variables (NOT in git)
├── .env.example                     # Template for .env
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies & scripts
├── package-lock.json                # Locked dependency versions
├── vercel.json                      # Vercel deployment config
├── index.js                         # Root entry point (imports from server/app.js)
├── DOCUMENTATION.md                 # Complete system documentation
├── FRONTEND_PAGES_GUIDE.md         # Frontend pages detailed guide
├── BACKEND_API_REFERENCE.md        # API endpoints reference
└── README.md                        # Project overview (if exists)
```

### File Dependencies

```
Entry Point:
index.js → requires ./server/app.js

Server Initialization:
server/index.js → requires ../index.js → starts Express server

Routing Main App:
server/app.js → imports:
├── server/routes/auth.js → server/lib/supabase.js
├── server/routes/workouts.js → server/middleware/auth.js → server/lib/supabase.js
├── server/routes/goals.js → server/middleware/auth.js → server/lib/supabase.js
└── server/routes/user.js → server/middleware/auth.js → server/lib/supabase.js

Frontend Entry:
public/*.html → <script src="/js/*.js"></script>
├── auth.html files → js/auth.js
├── dashboard.html → js/auth.js, js/dashboard.js
├── workout.html → js/auth.js, js/workouts.js
├── goals.html → js/auth.js, js/goals.js
└── progress.html → js/auth.js, js/progress.js
```

---

## Setup Instructions

### Prerequisites

```
Node.js: v14+ (v16+ recommended)
npm: v6+
Git: For cloning repository
Supabase Account: For database and authentication
```

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/fitness-tracker-app.git
cd fitness-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

**What Gets Installed:**
```json
{
  "cors": "^2.8.5",          // Cross-origin requests
  "dotenv": "^16.3.1",       // Environment variables
  "express": "^4.18.2"        // Web framework
}
```

**Optional (for development):**
```bash
npm install --save-dev nodemon    # Auto-restart on file changes
```

### 3. Setup Supabase Project

**Visit:** https://supabase.com

**Steps:**
1. Create new project
2. Copy `SUPABASE_URL` (Project URL)
3. Copy `SUPABASE_ANON_KEY` (Anonymous Key)
4. Create database tables (see [Database Schema](#database-schema))

### 4. Create Environment File

**.env file:**
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
NODE_ENV=development
```

**Never commit .env file!** Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 5. Setup Database Tables

Run these in Supabase SQL Editor:

```sql
-- Profiles table (for user biometric data)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT,
  height INT,
  weight INT,
  experience_level TEXT,
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INT NOT NULL,
  calories INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout sets table
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id),
  exercise TEXT NOT NULL,
  weight INT NOT NULL,
  reps INT NOT NULL,
  rpe INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ongoing',
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS 
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS policies (allow users to read/write only their own data)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
  
-- Similar policies for other tables...
```

---

## Running the Application

### Development Mode

**Option 1: Node**
```bash
npm start
# or npm run dev

# Output:
# FitTrack server running on http://localhost:3000
```

**Option 2: With Auto-Reload (requires nodemon)**
```bash
npm install --save-dev nodemon
nodemon server/index.js
```

### Accessing the App

```
Landing Page: http://localhost:3000
Login Page: http://localhost:3000/login
Signup Page: http://localhost:3000/signup
Dashboard: http://localhost:3000/dashboard
(after login)
```

### Troubleshooting Startup

**Error: Cannot find module**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm start

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

**Error: Missing environment variables**
```
Check .env file exists with:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- PORT (optional, defaults to 3000)
```

---

## Environment Configuration

### Required Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anonymous-key-here
```

### Optional Variables

```env
PORT=3000                    # Default: 3000
NODE_ENV=development         # development | production
DEBUG=fittrack:*            # Enable debugging logs
```

### How Environment Variables Are Used

**In server/lib/supabase.js:**
```javascript
const SUPABASE_URL = getRequiredEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getRequiredEnv('SUPABASE_ANON_KEY');
```

**In server/index.js:**
```javascript
const PORT = process.env.PORT || 3000;
```

**Getting Supabase Credentials:**

1. Visit [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy Project URL → `SUPABASE_URL`
5. Copy Anonymous Key → `SUPABASE_ANON_KEY`

---

## Database Schema

### Users Table (Managed by Supabase Auth)
```
id              UUID (primary key)
email           TEXT (unique)
encrypted_password  TEXT
email_confirmed_at  TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
user_metadata   JSONB {full_name: "..."}
```

### Profiles Table (Custom)
```
id                  UUID (primary key)
user_id             UUID (FK to users, unique)
full_name           TEXT
height              INT (cm)
weight              INT (kg)
experience_level    TEXT (beginner/intermediate/advanced)
xp                  INT
created_at          TIMESTAMP
```

### Workouts Table
```
id              UUID (primary key)
user_id         UUID (FK to users)
name            TEXT (exercise name)
type            TEXT (Strength/Cardio/Yoga/etc)
duration        INT (minutes)
calories        INT
notes           TEXT
created_at      TIMESTAMP
```

### Workout_Sets Table
```
id              UUID (primary key)
workout_id      UUID (FK to workouts)
exercise        TEXT (exercise name)
weight          INT (kg)
reps            INT
rpe             INT (1-10 scale)
created_at      TIMESTAMP
```

### Goals Table
```
id              UUID (primary key)
user_id         UUID (FK to users)
title           TEXT
goal_type       TEXT (strength/endurance/body_composition)
target_value    NUMERIC
current_value   NUMERIC
status          TEXT (ongoing/completed/failed)
deadline        DATE
created_at      TIMESTAMP
```

### Entity Relationships

```
┌─────────────────────────────────────────────────────────┐
│ auth.users (Supabase)                                   │
│ ├─ id                                                   │
│ ├─ email                                                │
│ └─ user_metadata                                        │
└─────────────┬───────────────────────────────────────────┘
              │ (has one)
              ↓
┌─────────────────────────────────────────────────────────┐
│ profiles                                                │
│ ├─ id                                                   │
│ ├─ user_id (FK)                                         │
│ ├─ full_name                                            │
│ └─ experience_level                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ workouts                                                │
│ ├─ id                                                   │
│ ├─ user_id (FK)                                         │
│ ├─ name, duration, calories                             │
│ └─ created_at                                           │
└─────────────┬───────────────────────────────────────────┘
              │ (has many)
              ↓
┌─────────────────────────────────────────────────────────┐
│ workout_sets                                            │
│ ├─ id                                                   │
│ ├─ workout_id (FK)                                      │
│ ├─ exercise, weight, reps, rpe                          │
│ └─ created_at                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ goals                                                   │
│ ├─ id                                                   │
│ ├─ user_id (FK)                                         │
│ ├─ title, target_value, current_value                   │
│ └─ status                                               │
└─────────────────────────────────────────────────────────┘
```

---

## System Architecture

### Overall Architecture

```
┌──────────────────────────┐
│   Frontend (HTML/CSS/JS)  │
│   ├─ Landing Page        │
│   ├─ Auth Pages          │
│   ├─ Dashboard           │
│   ├─ Feature Pages       │
│   └─ LocalStorage(tokens)│
└──────────────┬───────────┘
               │ HTTP Requests
               │ (with JWT token)
               ↓
┌──────────────────────────────────────────┐
│   Express.js Server (Node.js)            │
│   ├─ Router (routes/*)                   │
│   ├─ Middleware (cors, json, auth)       │
│   ├─ Static Files (public/*)             │
│   └─ Proxy to Supabase                   │
└──────────────┬───────────────────────────┘
               │ REST API Calls
               │ (with API key)
               ↓
┌──────────────────────────────────────────┐
│   Supabase (Backend-as-a-Service)        │
│   ├─ Auth (JWT validation)               │
│   ├─ PostgreSQL Database                 │
│   ├─ REST API (auto-generated)           │
│   └─ Real-time (optional)                │
└──────────────────────────────────────────┘
```

### Request/Response Cycle

**Frontend Makes API Call:**
```javascript
fetch('/api/workouts', {
  headers: {
    'Authorization': 'Bearer jwt-token'
  }
})
```

**Express Server:**
1. Receives request
2. Middleware processes it
3. Routes to handler
4. Handler validates token via requireAuth
5. Handler calls supabaseRestFetch
6. Sends request to Supabase REST API
7. Returns response to client

**Example: GET /api/workouts**
```
Client Browser
       ↓
GET /api/workouts + Token
       ↓
Express Server (routes/workouts.js)
       ↓
requireAuth middleware
       ↓
Extract token, verify with Supabase
       ↓
GET https://supabase.com/rest/v1/workouts?user_id=eq.123
       ↓
Supabase returns data
       ↓
Express returns JSON response
       ↓
JavaScript updates DOM
```

---

## Data Flow Diagrams

### User Login Flow

```
User enters email/password
        ↓
Frontend: fetch('/api/auth/login')
        ↓
Backend: POST handler receives request
        ↓
Sends to Supabase Auth API
        ↓
Supabase validates email/password
        ↓
Returns JWT access token + refresh token
        ↓
Backend returns token to Frontend
        ↓
JavaScript: localStorage.setItem('supabase_token', token)
        ↓
Redirect to /dashboard
        ↓
Dashboard page loads
        ↓
JS fetches user data with Bearer token
        ↓
All subsequent requests include token
```

### Workout Logging Flow

```
User clicks "Log New Workout"
        ↓
Modal opens with form
        ↓
User fills: name, type, duration, calories
        ↓
Click "Save Session"
        ↓
Form validation (frontend)
        ↓
fetch('/api/workouts', {
  method: 'POST',
  body: {...},
  headers: {Authorization: 'Bearer token'}
})
        ↓
Express route handler:
  1. Validate token (requireAuth)
  2. Extract user_id from token
  3. Call supabaseRestFetch to INSERT
        ↓
Supabase inserts row with RLS check
  (ensures user_id matches auth user)
        ↓
Returns created workout object
        ↓
Frontend: refreshes workout grid
        ↓
New workout card appears
```

### Goal Progress Update Flow

```
User enters current_value: 275
        ↓
Click "Update"
        ↓
fetch('/api/goals/{id}', {
  method: 'PATCH',
  body: {current_value: 275}
})
        ↓
Backend validates token
        ↓
Supabase PATCH request
        ↓
Database updates current_value
        ↓
Progress percentage recalculated:
  progress = (current_value / target_value) * 100
  progress = (275 / 300) * 100 = 91.67%
        ↓
Frontend updates progress bar
        ↓
Goal card shows 91.67% complete
```

---

## Deployment

### Vercel Deployment

**Configuration File:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Production URL:** `https://your-app.vercel.app`

---

## Development Workflow

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes to files
vim file.js

# 3. Test locally
npm start
# Visit http://localhost:3000

# 4. Stage changes
git add .

# 5. Commit with message
git commit -m "feat: add new feature"

# 6. Push to GitHub
git push origin feature/new-feature

# 7. Create Pull Request
# Review → Merge → Deploy
```

### Common Tasks

**Add New API Endpoint:**
1. Create route file in `server/routes/`
2. Add route to `server/app.js`
3. Update frontend fetch calls
4. Test with curl or browser fetch

**Add New Frontend Page:**
1. Create `.html` file in `public/`
2. Add route in `server/app.js`
3. Add navigation link to other pages
4. Add sidebar link if needed

**Update Database:**
1. Create migration SQL in Supabase
2. Update JavaScript data models
3. Update API request payloads

---

## Monitoring & Logging

### Supabase Dashboard

- Monitor active users
- View database performance
- Check authentication logs
- Track REST API usage

### Server Logs

```bash
# Check server output
npm start
# Logs displayed in console

# Save logs to file
npm start > server.log 2>&1
```

### Browser DevTools

- Network tab: Monitor API calls
- Console: Check JavaScript errors
- Application: View localStorage tokens

---

## Performance Optimization

### Frontend Optimization
- Enable HTTP caching headers
- Minify CSS/JS (currently not done)
- Lazy load images
- Optimize font loading

### Backend Optimization
- Add database indexes on frequently queried columns
- Implement pagination for large result sets
- Cache responses where appropriate

### Database Optimization
- Add RLS policies for security (already done)
- Index on `user_id` for faster queries
- Archive old workouts periodically

---

## Security Considerations

### Authentication
- JWT tokens stored in localStorage (not perfect but acceptable for SPA)
- Tokens expire (managed by Supabase)
- Token refreshed transparently

### API Security
- All endpoints require JWT validation
- User can only access their own data (enforced in backend)
- CORS enabled only for same origins

### Database
- Row Level Security (RLS) enabled
- Each user can only see/modify their data
- SQL injection prevented by Supabase

### Environment
- Credentials never committed to git
- .env file in .gitignore
- Different keys for dev/prod

---

## Troubleshooting

### Common Issues

**"Cannot read property 'length' of undefined"**
- Check if API returned empty array
- Add null checks in JavaScript

**"401 Unauthorized"**
- Token expired or missing
- Check localStorage for token
- Refresh page to get new token

**"CORS error"**
- Check server CORS middleware is enabled
- Verify frontend is on same origin

**"Database query failed"**
- Check Supabase connection
- Verify table names and columns
- Check RLS policies

---

