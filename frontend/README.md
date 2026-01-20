# LuminaHR Frontend

Modern, responsive React application built with TypeScript, TailwindCSS, and Framer Motion.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS + Shadcn UI Components
- **Animations**: Framer Motion + GSAP
- **Routing**: React Router v6
- **State Management**: React Context + TanStack Query
- **Build Tool**: Vite

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/           # Images and static files
│   ├── components/
│   │   ├── landing/      # Landing page components
│   │   ├── dashboard/    # Dashboard layout components
│   │   └── ui/           # Shadcn UI components
│   ├── contexts/         # React contexts (Auth, Theme)
│   ├── pages/
│   │   ├── Index.tsx     # Landing page
│   │   ├── Login.tsx     # Authentication
│   │   ├── Signup.tsx    # Registration
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── employee/     # Employee dashboard pages
│   │   └── features/     # Feature detail pages
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── App.tsx           # Root component with routing
├── public/               # Static public assets
├── .env                  # Environment variables
└── package.json          # Dependencies
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ or Bun
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/luminahr.git
cd luminahr/frontend

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with:

```env
# Backend API URL (change for production)
REACT_APP_BACKEND_URL=http://localhost:8001

# Optional: Analytics
REACT_APP_GA_ID=your-google-analytics-id
```

### Running the Development Server

```bash
# Start development server
yarn dev

# App will be available at http://localhost:3000
```

### Building for Production

```bash
# Create production build
yarn build

# Preview production build locally
yarn preview
```

---

## 🌐 Deploying to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/luminahr)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From frontend directory
   cd frontend
   vercel
   ```

4. **Configure Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `REACT_APP_BACKEND_URL` with your production backend URL

### Build Settings (Vercel Dashboard)

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `yarn build` |
| Output Directory | `dist` |
| Install Command | `yarn install` |
| Node.js Version | 18.x |

---

## 📱 Features

### Landing Page
- ✅ Hero section with GSAP animations
- ✅ Feature showcase with interactive cards
- ✅ Employee management preview
- ✅ Settings & Operations (parallax scroll)
- ✅ Testimonials carousel
- ✅ FAQ accordion
- ✅ Contact form
- ✅ Premium newsletter footer

### Theme Customization
- 5 color themes (Professional Blue, Modern Teal, Deep Indigo, Fresh Emerald, Executive Slate)
- 5 typography options
- Persistent preferences

### Dashboard
- Admin dashboard with analytics
- Employee self-service portal
- Leave management
- Attendance tracking
- AI Chat interface

---

## 🧪 Running Tests

```bash
# Run unit tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run E2E tests
yarn test:e2e
```

---

## 📝 Code Style

- ESLint + Prettier configured
- TypeScript strict mode
- Component naming: PascalCase
- File naming: PascalCase for components, camelCase for utilities

```bash
# Lint code
yarn lint

# Fix lint issues
yarn lint:fix
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Blank page on production**
- Ensure `REACT_APP_BACKEND_URL` is set correctly in Vercel
- Check browser console for CORS errors

**Issue: API calls failing**
- Verify backend is running and accessible
- Check that API endpoints are prefixed with `/api`

**Issue: Styles not loading**
- Run `yarn install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

---

## 📄 License

Copyright © 2024-2026 LuminaHR. All rights reserved.
