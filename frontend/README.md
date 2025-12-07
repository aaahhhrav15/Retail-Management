# Frontend Application

React frontend application for the retail sales system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are provided):
```bash
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

- Development mode:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Preview production build:
```bash
npm run preview
```

The application will run on `http://localhost:3000` by default.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── routes/         # React Router routes (if needed)
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # CSS styles
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── package.json
└── README.md
```

## Features

- React 18 with Vite for fast development
- React Router for navigation
- Axios for API calls
- Custom hooks for reusable logic
- Modern ES6+ syntax

