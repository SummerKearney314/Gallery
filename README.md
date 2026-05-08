# Photo Gallery

A React photo gallery app with Cloudinary image hosting and Firebase Realtime Database for view/favorite tracking.

New uploads appear automatically on the home page (via Firebase's real-time listener) — no manual refresh needed.
Once the database is reactivated, the gallery updates instantly when new images are uploaded.
The dev server also supports hot module replacement, so code changes reflect immediately without restarting `npm start`.

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials
2. Run `npm install`
3. Run `npm start`

## Available Scripts

- **`npm start`** — runs the app in development mode (hot reload enabled)
- **`npm test`** — launches the test runner
- **`npm run build`** — builds for production
