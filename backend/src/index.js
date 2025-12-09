import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transaction.routes.js';
import { initializeDataService, isDataLoaded, getDataCount } from './services/data.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware

app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection and data service
async function initializeServer() {
  try {
    console.log('Initializing database connection...');
    await initializeDataService();
    const count = await getDataCount();
    console.log(`Database initialized successfully. Total transactions: ${count}`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Routes
app.use('/api/transactions', transactionRoutes);

// Health check route
app.get('/health', async (req, res) => {
  const dataLoaded = isDataLoaded();
  const count = dataLoaded ? await getDataCount() : 0;
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    dataLoaded: dataLoaded,
    dataCount: count
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeServer();
});

