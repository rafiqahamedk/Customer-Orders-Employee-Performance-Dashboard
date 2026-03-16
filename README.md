# Halleyx Dashboard

## Project Structure
```
frontend/   → React + Vite + Tailwind  (deploy to Vercel)
backend/    → Node + Express + MongoDB  (deploy to Render)
```

## MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com and sign in
2. Create a free cluster (M0)
3. Under **Database Access** → add a user with read/write permissions
4. Under **Network Access** → add `0.0.0.0/0` (allow all IPs for Render)
5. Click **Connect** → **Drivers** → copy the connection string
6. Paste it into `backend/.env` as `MONGODB_URI`

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGODB_URI
npm run dev               # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL=http://localhost:5000/api
npm run dev               # runs on http://localhost:5173
```

## Deploy

### Backend → Render
- New Web Service → connect repo → set root to `backend/`
- Build: `npm install` | Start: `npm start`
- Environment variables:
  - `MONGODB_URI` = your Atlas connection string
  - `CLIENT_URL` = your Vercel frontend URL

### Frontend → Vercel
- Import repo → set root to `frontend/`
- Environment variable:
  - `VITE_API_URL` = your Render backend URL + `/api`
