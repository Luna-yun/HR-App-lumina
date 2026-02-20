# Railway Deployment Guide

## Quick Start

### Prerequisites
- Railway.app account
- GitHub repository connected to Railway
- Environment variables configured

### Deploy Backend

1. Connect your GitHub repository to Railway
2. Create a new service and select the repository
3. Configure rootDirectory to `backend/`
4. Set environment variables:
   ```
   MONGO_URL=<your_mongodb_atlas_connection_string>
   SECRET_KEY=<your_secret_key>
   GROQ_API_KEY=<your_groq_api_key>
   QDRANT_URL=<your_qdrant_url>
   DB_NAME=ems_database
   CORS_ORIGINS=*
   ```
5. Railway will auto-detect the Dockerfile and deploy

### Deploy Frontend

1. Create another service for frontend
2. Configure rootDirectory to `frontend/`
3. Set environment variables:
   ```
   VITE_BACKEND_URL=<your_backend_railway_url>
   ```
4. Railway will auto-detect the Dockerfile and deploy

## Environment Variables

### Backend

- `MONGO_URL`: MongoDB Atlas connection string
- `SECRET_KEY`: JWT secret for token signing
- `GROQ_API_KEY`: Groq API key for AI features
- `QDRANT_URL`: Qdrant vector database URL
- `DB_NAME`: MongoDB database name (default: ems_database)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: *)

### Frontend

- `VITE_BACKEND_URL`: Backend API URL (e.g., `https://your-backend.up.railway.app`)

## Configuration Files

- `railway.toml`: Main Railway configuration (defines services, environment, build settings)
- `backend/Dockerfile`: Backend container setup (FastAPI + uvicorn)
- `frontend/Dockerfile`: Frontend container setup (React + Vite)
- `backend/Procfile`: Alternative process definition for Heroku compatibility
- `.railwayignore`: Files/folders to exclude from Railway builds
- `.dockerignore`: Files/folders to exclude from Docker builds

## Monitoring

Railway provides:
- Logs viewer for real-time logs
- Metrics dashboard for memory/CPU usage
- Deployment history and rollback capability

Access these from your Railway project dashboard.

## Troubleshooting

### Backend won't start
- Check logs for Python import errors
- Verify MONGO_URL is correct
- Ensure all required environment variables are set

### Frontend won't build
- Check that Node.js dependencies are installed
- Verify VITE_BACKEND_URL is set to the correct backend URL
- Check build logs for TypeScript or compilation errors

### API calls failing
- Verify CORS_ORIGINS on backend includes frontend URL
- Check that authentication token is being sent correctly
- Verify API endpoint URLs match between frontend and backend

## API Tests

To test the production backend:
```bash
cd frontend
npm run test:api
```

This runs against `https://brighthr.emergent.host/` (configured in package.json scripts).

## Local Development

For local development without Railway:
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```
