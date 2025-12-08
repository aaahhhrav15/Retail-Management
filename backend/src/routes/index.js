import express from 'express';
import transactionRoutes from './transaction.routes.js';

const router = express.Router();

// Transaction routes
router.use('/transactions', transactionRoutes);

export default router;

