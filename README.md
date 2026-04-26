# FitTrack — Fitness Tracker App

A full-stack fitness tracking web application built with Next.js and Supabase. FitTrack lets users log workouts, track progress over time, and visualize their fitness data through interactive charts and 3D animations.

## Live Demo

[fitness-tracker-app-jet.vercel.app](https://fitness-tracker-app-jet.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React |
| 3D Animations | Three.js |
| Charts | Recharts |
| Backend / Auth / DB | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Features

- **User Authentication** — Secure sign-up and login with email confirmation via Supabase Auth
- **Workout Logging** — Add and manage workout sessions with relevant fitness data
- **Progress Visualization** — Interactive charts (Recharts) to track progress over time
- **3D UI Elements** — Three.js powered animated visuals for an engaging experience
- **Custom Login Page** — Animated SVG stick figure that reacts to keystrokes on the login screen
- **Responsive Design** — Works across desktop and mobile browsers
- **Email Confirmation** — Purple-themed Supabase transactional email for account verification

## Project Structure

```
fitness-tracker-app/
├── public/          # Static assets
├── server/          # Server-side logic / API routes
├── tests/           # Test files
├── index.js         # App entry point
├── vercel.json      # Vercel deployment config
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) account and project

### Installation

```bash
git clone https://github.com/ShlokPathak28/fitness-tracker-app.git
cd fitness-tracker-app
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under **Settings > API**.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the environment variables in the Vercel dashboard
4. Deploy

## Author

**Shlok Pathak**
- GitHub: [@ShlokPathak28](https://github.com/ShlokPathak28)
- Project: [fitness-tracker-app](https://github.com/ShlokPathak28/fitness-tracker-app)

## License

This project is open source and available under the [MIT License](LICENSE).
