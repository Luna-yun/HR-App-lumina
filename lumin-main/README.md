# LuminaHR - Modern HR Management Platform

LuminaHR is a modern, enterprise-grade HR management platform designed to streamline your entire workforce operations. Built with React, TypeScript, and Tailwind CSS, it offers a beautiful, responsive interface for managing employees, teams, and HR processes.

## ✨ Features

- **Employee Management** - Add, organize, and manage employee data with ease
- **Team Collaboration** - Foster communication with dedicated team spaces
- **Settings & Operations** - Configure HR services with granular role-based access
- **Enterprise Security** - SOC 2 & GDPR compliant with audit logging
- **Self-Service Portal** - Empower employees with personal dashboards
- **Global Support** - Built for multinational organizations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion, Anime.js
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── components/
│   ├── landing/     # Landing page components
│   └── ui/          # Reusable UI components (shadcn)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
└── main.tsx         # Application entry point
```

## 🎨 Customization

The design system uses CSS custom properties defined in `src/index.css`. You can customize colors, fonts, and spacing by modifying these variables.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For questions or support, contact us at hello@luminahr.com
