# Backend Server

Backend API server for the retail sales application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

## Running the Server

- Development mode (with auto-reload):
```bash
npm run dev
```

- Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API routes
│   ├── models/         # Database models (if required)
│   ├── utils/          # Utility functions
│   └── index.js        # Entry point
├── package.json
└── README.md
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/examples` - Get all examples
- `POST /api/examples` - Create a new example

