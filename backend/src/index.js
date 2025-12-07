import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { loadDataFromCSV, isDataLoaded } from './services/data.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load CSV data into memory on startup
async function initializeServer() {
  try {
    console.log('Loading dataset into memory...');
    await loadDataFromCSV();
    console.log('Dataset loaded successfully into memory');
  } catch (error) {
    console.error('Failed to load dataset:', error);
    process.exit(1);
  }
}

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', async (req, res) => {
  const dataLoaded = isDataLoaded();
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    dataLoaded: dataLoaded,
    dataCount: dataLoaded ? (await import('./services/data.service.js')).getDataCount() : 0
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeServer();
});

