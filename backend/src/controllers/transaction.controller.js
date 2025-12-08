import * as dataService from '../services/data.service.js';
import { validateFilters } from '../services/data.service.js';

export const getTransactions = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    
    // Validate page and limit
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.max(1, Math.min(limit, 1000)); // Ensure limit is between 1 and 1000
    
    const result = await dataService.getAllTransactions(page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await dataService.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    
    // For validating the page and limit
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.max(1, Math.min(limit, 1000)); // Ensure limit is between 1 and 1000
    
    // Extract filter parameters from query string
    const filters = {
      customerId: req.query.customerId,
      customerName: req.query.customerName,
      phoneNumber: req.query.phoneNumber,
      customerRegion: req.query.customerRegion ? (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : req.query.customerRegion.split(',')) : undefined,
      gender: req.query.gender,
      ageRange: req.query.ageRange,
      productCategory: req.query.productCategory ? (Array.isArray(req.query.productCategory) ? req.query.productCategory : req.query.productCategory.split(',')) : undefined,
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : req.query.tags.split(',')) : undefined,
      orderStatus: req.query.orderStatus,
      storeId: req.query.storeId,
      brand: req.query.brand,
      paymentMethod: req.query.paymentMethod ? (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : req.query.paymentMethod.split(',')) : undefined,
      date: req.query.date,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    // Remove undefined or empty string filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '' || filters[key] === null) {
        delete filters[key];
      } else if (Array.isArray(filters[key]) && filters[key].length === 0) {
        delete filters[key];
      }
    });

    const result = await dataService.searchTransactions(filters, page, limit);
    
    // Handle no search results gracefully
    if (!result.data || result.data.length === 0) {
      return res.json({ 
        success: true, 
        ...result,
        message: 'No transactions found matching your criteria.'
      });
    }
    
    res.json({ success: true, ...result });
  } catch (error) {
    // Check if it's a validation error (400) or server error (500)
    const statusCode = error.message.includes('Invalid') || error.message.includes('cannot') ? 400 : 500;
    const errorLimit = parseInt(req.query.limit) || 100;
    res.status(statusCode).json({ 
      success: false, 
      message: error.message || 'An error occurred while searching transactions.',
      data: [],
      total: 0,
      page: 1,
      limit: errorLimit,
      totalPages: 0
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    // Extract filter parameters from the query string 
    const filters = {
      customerId: req.query.customerId,
      customerName: req.query.customerName,
      phoneNumber: req.query.phoneNumber,
      customerRegion: req.query.customerRegion ? (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : req.query.customerRegion.split(',')) : undefined,
      gender: req.query.gender,
      ageRange: req.query.ageRange,
      productCategory: req.query.productCategory ? (Array.isArray(req.query.productCategory) ? req.query.productCategory : req.query.productCategory.split(',')) : undefined,
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : req.query.tags.split(',')) : undefined,
      orderStatus: req.query.orderStatus,
      storeId: req.query.storeId,
      brand: req.query.brand,
      paymentMethod: req.query.paymentMethod ? (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : req.query.paymentMethod.split(',')) : undefined,
      date: req.query.date,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount
    };

    // Remove undefined or empty string filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '' || filters[key] === null) {
        delete filters[key];
      } else if (Array.isArray(filters[key]) && filters[key].length === 0) {
        delete filters[key];
      }
    });

    // Validate filters before computing statistics
    if (Object.keys(filters).length > 0) {
      const validation = validateFilters(filters);
      if (!validation.valid) {
        return res.status(400).json({ 
          success: false, 
          message: validation.error,
          data: null
        });
      }
    }

    // Pass the filters to statistics - empty filters object means all data
    const hasFilters = Object.keys(filters).length > 0;
    const stats = await dataService.getStatistics(hasFilters ? filters : null);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while fetching statistics.',
      data: null
    });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const filterOptions = await dataService.getUniqueFilterValues();
    res.json({ success: true, data: filterOptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

