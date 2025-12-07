import express from 'express';
import exampleRoutes from './example.routes.js';
import transactionRoutes from './transaction.routes.js';

const router = express.Router();

// Example routes
router.use('/examples', exampleRoutes);

// Transaction routes
router.use('/transactions', transactionRoutes);

export default router;

