# Retail Sales Application

A full-stack retail sales application built with React and Node.js.

## Project Structure

```
retail-sales/
├── backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   ├── models/
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/             # Documentation
│   └── architecture.md
│
├── README.md
└── package.json      # Monorepo root package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Monorepo Setup (Recommended)

1. Install all dependencies from the root:
```bash
npm run install:all
```

2. Start both backend and frontend in development mode:
```bash
npm run dev
```

Or start them individually:
```bash
npm run dev:backend   # Starts backend on http://localhost:5000
npm run dev:frontend  # Starts frontend on http://localhost:3000
```

### Individual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Technology Stack

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### Frontend
- React 18
- Vite
- React Router
- Axios

## Development

- Backend runs on port 5000
- Frontend runs on port 3000
- Frontend is configured to proxy API requests to the backend

## Documentation

- [Architecture Documentation](./docs/architecture.md) - Detailed architecture and design patterns

## Monorepo Scripts

From the root directory, you can run:

- `npm run install:all` - Install dependencies for all workspaces
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend server
- `npm run build` - Build both backend and frontend for production
- `npm run build:backend` - Build only the backend
- `npm run build:frontend` - Build only the frontend

## License

ISC

