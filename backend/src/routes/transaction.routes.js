import express from 'express';
import {
  getTransactions,
  getTransactionById,
  searchTransactions,
  getStatistics,
  getFilterOptions
} from '../controllers/transaction.controller.js';

const router = express.Router();

// Get all transactions with pagination
router.get('/', getTransactions);

// Search/filter transactions
router.get('/search', searchTransactions);

// Get statistics
router.get('/statistics', getStatistics);

// Get filter options (unique values for dropdowns)
router.get('/filter-options', getFilterOptions);

// Get transaction by ID
router.get('/:id', getTransactionById);

export default router;

