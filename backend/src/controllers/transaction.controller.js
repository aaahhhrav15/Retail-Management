import * as dataService from '../services/data.service.js';

export const getTransactions = (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    
    // Validate page and limit
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.max(1, Math.min(limit, 1000)); // Ensure limit is between 1 and 1000
    
    const result = dataService.getAllTransactions(page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = (req, res) => {
  try {
    const { id } = req.params;
    const transaction = dataService.getTransactionById(id);
    
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

export const searchTransactions = (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    
    // Validate page and limit
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.max(1, Math.min(limit, 1000)); // Ensure limit is between 1 and 1000
    
    // Extract filter parameters from query string
    const filters = {
      customerId: req.query.customerId,
      customerName: req.query.customerName,
      phoneNumber: req.query.phoneNumber,
      customerRegion: req.query.customerRegion,
      gender: req.query.gender,
      ageRange: req.query.ageRange,
      productCategory: req.query.productCategory,
      tags: req.query.tags,
      orderStatus: req.query.orderStatus,
      storeId: req.query.storeId,
      brand: req.query.brand,
      paymentMethod: req.query.paymentMethod,
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
      }
    });

    const result = dataService.searchTransactions(filters, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStatistics = (req, res) => {
  try {
    const stats = dataService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilterOptions = (req, res) => {
  try {
    const filterOptions = dataService.getUniqueFilterValues();
    res.json({ success: true, data: filterOptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

