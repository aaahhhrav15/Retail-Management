import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for transactions
let transactions = [];
let isLoaded = false;

/**
 * Load CSV data into memory
 */
export async function loadDataFromCSV() {
  if (isLoaded) {
    console.log('Data already loaded in memory');
    return transactions;
  }

  const CSV_FILE_PATH = path.join(__dirname, '../../../truestate_assignment_dataset.csv');
  
  return new Promise((resolve, reject) => {
    const data = [];
    
    console.log(`Loading CSV file: ${CSV_FILE_PATH}`);
    console.log('This may take a moment...');

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Parse tags from comma-separated string to array
          const tags = row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [];

          // Pre-process and normalize data for faster filtering
          const transaction = {
            transactionId: parseInt(row['Transaction ID']),
            date: new Date(row.Date),
            customerId: row['Customer ID'],
            customerName: row['Customer Name'],
            customerNameLower: (row['Customer Name'] || '').toLowerCase(), // Pre-normalize for faster search
            phoneNumber: row['Phone Number'],
            gender: row.Gender,
            genderLower: (row.Gender || '').toLowerCase(), // Pre-normalize
            age: parseInt(row.Age),
            customerRegion: row['Customer Region'],
            customerRegionLower: (row['Customer Region'] || '').toLowerCase(), // Pre-normalize
            customerType: row['Customer Type'],
            productId: row['Product ID'],
            productName: row['Product Name'],
            brand: row.Brand,
            brandLower: (row.Brand || '').toLowerCase(), // Pre-normalize
            productCategory: row['Product Category'],
            productCategoryLower: (row['Product Category'] || '').toLowerCase(), // Pre-normalize
            tags: tags,
            tagsLower: tags.map(tag => tag.toLowerCase()), // Pre-normalize tags
            quantity: parseInt(row.Quantity),
            pricePerUnit: parseFloat(row['Price per Unit']),
            discountPercentage: parseFloat(row['Discount Percentage']),
            totalAmount: parseFloat(row['Total Amount']),
            finalAmount: parseFloat(row['Final Amount']),
            paymentMethod: row['Payment Method'],
            paymentMethodLower: (row['Payment Method'] || '').toLowerCase(), // Pre-normalize
            orderStatus: row['Order Status'],
            orderStatusLower: (row['Order Status'] || '').toLowerCase(), // Pre-normalize
            deliveryType: row['Delivery Type'],
            storeId: row['Store ID'],
            storeLocation: row['Store Location'],
            salespersonId: row['Salesperson ID'],
            employeeName: row['Employee Name']
          };

          data.push(transaction);
        } catch (error) {
          console.error('Error parsing row:', error.message);
        }
      })
      .on('end', () => {
        transactions = data;
        isLoaded = true;
        console.log(`Successfully loaded ${transactions.length} transactions into memory`);
        resolve(transactions);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

/**
 * Get all transactions (with optional pagination)
 */
export function getAllTransactions(page = 1, limit = 100) {
  if (!isLoaded) {
    throw new Error('Data not loaded. Please load data first.');
  }

  // Ensure valid page and limit
  page = Math.max(1, page);
  limit = Math.max(1, limit);

  const total = transactions.length;
  const calculatedTotalPages = total > 0 ? Math.ceil(total / limit) : 1;
  
  // Clamp page to valid range
  page = Math.min(page, calculatedTotalPages);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Format dates in the response data and remove internal optimization fields
  const paginatedData = transactions.slice(startIndex, endIndex).map(t => {
    const { customerNameLower, genderLower, customerRegionLower, brandLower, 
            productCategoryLower, paymentMethodLower, orderStatusLower, tagsLower, ...rest } = t;
    return {
      ...rest,
      date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date
    };
  });
  
  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages: calculatedTotalPages
  };
}

/**
 * Get transaction by ID
 */
export function getTransactionById(transactionId) {
  if (!isLoaded) {
    throw new Error('Data not loaded. Please load data first.');
  }
  
  const transaction = transactions.find(t => t.transactionId === parseInt(transactionId));
  if (transaction) {
    const { customerNameLower, genderLower, customerRegionLower, brandLower, 
            productCategoryLower, paymentMethodLower, orderStatusLower, tagsLower, ...rest } = transaction;
    return {
      ...rest,
      date: transaction.date instanceof Date ? transaction.date.toISOString().split('T')[0] : transaction.date
    };
  }
  return null;
}

/**
 * Search/filter transactions - Optimized single-pass filtering
 */
export function searchTransactions(filters = {}, page = 1, limit = 100) {
  if (!isLoaded) {
    throw new Error('Data not loaded. Please load data first.');
  }

  // Pre-compute filter values to avoid repeated calculations
  const filterValues = {};
  
  if (filters.customerName) {
    filterValues.customerNameLower = filters.customerName.toLowerCase();
  }
  if (filters.customerRegion) {
    filterValues.customerRegionLower = filters.customerRegion.toLowerCase();
  }
  if (filters.gender) {
    filterValues.genderLower = filters.gender.toLowerCase();
  }
  if (filters.productCategory) {
    filterValues.productCategoryLower = filters.productCategory.toLowerCase();
  }
  if (filters.brand) {
    filterValues.brandLower = filters.brand.toLowerCase();
  }
  if (filters.paymentMethod) {
    filterValues.paymentMethodLower = filters.paymentMethod.toLowerCase();
  }
  if (filters.orderStatus) {
    filterValues.orderStatusLower = filters.orderStatus.toLowerCase();
  }
  if (filters.tags) {
    filterValues.tagsLower = filters.tags.toLowerCase();
  }

  // Pre-compute date filters
  let filterDate, nextDay, dateFrom, dateTo;
  if (filters.date) {
    filterDate = new Date(filters.date);
    filterDate.setHours(0, 0, 0, 0);
    nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
  }
  if (filters.dateFrom) {
    dateFrom = new Date(filters.dateFrom);
  }
  if (filters.dateTo) {
    dateTo = new Date(filters.dateTo);
  }

  // Pre-compute amount filters
  const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : null;
  const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : null;

  // Pre-compute age range
  let ageMin = null, ageMax = null;
  if (filters.ageRange) {
    const ageRange = filters.ageRange;
    if (ageRange.includes('+')) {
      ageMin = parseInt(ageRange.replace('+', ''));
    } else if (ageRange.includes('-')) {
      const [min, max] = ageRange.split('-').map(age => parseInt(age.trim()));
      ageMin = min;
      ageMax = max;
    }
  }

  // Single-pass filtering - much faster than multiple filter() calls
  const filtered = transactions.filter(t => {
    // Customer ID
    if (filters.customerId && t.customerId !== filters.customerId) return false;
    
    // Customer Name (use pre-normalized)
    if (filterValues.customerNameLower && !t.customerNameLower.includes(filterValues.customerNameLower)) return false;
    
    // Phone Number
    if (filters.phoneNumber && !t.phoneNumber.includes(filters.phoneNumber)) return false;
    
    // Customer Region (use pre-normalized)
    if (filterValues.customerRegionLower && !t.customerRegionLower.includes(filterValues.customerRegionLower)) return false;
    
    // Gender (use pre-normalized)
    if (filterValues.genderLower && t.genderLower !== filterValues.genderLower) return false;
    
    // Product Category (use pre-normalized)
    if (filterValues.productCategoryLower && !t.productCategoryLower.includes(filterValues.productCategoryLower)) return false;
    
    // Order Status (use pre-normalized)
    if (filterValues.orderStatusLower && t.orderStatusLower !== filterValues.orderStatusLower) return false;
    
    // Store ID
    if (filters.storeId && t.storeId !== filters.storeId) return false;
    
    // Brand (use pre-normalized)
    if (filterValues.brandLower && !t.brandLower.includes(filterValues.brandLower)) return false;
    
    // Payment Method (use pre-normalized)
    if (filterValues.paymentMethodLower && t.paymentMethodLower !== filterValues.paymentMethodLower) return false;
    
    // Date filters
    if (filterDate && nextDay) {
      const transactionDate = t.date;
      if (transactionDate < filterDate || transactionDate >= nextDay) return false;
    }
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    
    // Amount filters
    if (minAmount !== null && t.finalAmount < minAmount) return false;
    if (maxAmount !== null && t.finalAmount > maxAmount) return false;
    
    // Age range filter
    if (ageMin !== null) {
      if (ageMax !== null) {
        if (t.age < ageMin || t.age > ageMax) return false;
      } else {
        if (t.age < ageMin) return false;
      }
    }
    
    // Tags filter (use pre-normalized)
    if (filterValues.tagsLower) {
      if (!t.tagsLower || !t.tagsLower.some(tag => tag.includes(filterValues.tagsLower))) return false;
    }
    
    return true;
  });

  // Sort
  const sortBy = filters.sortBy || 'customerName';
  const sortOrder = filters.sortOrder === 'desc' ? -1 : 1; // Default to ascending
  
  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      return (new Date(a.date) - new Date(b.date)) * sortOrder;
    } else if (sortBy === 'finalAmount') {
      return (a.finalAmount - b.finalAmount) * sortOrder;
    } else if (sortBy === 'customerName') {
      // Use pre-normalized field for faster sorting
      const nameA = a.customerNameLower || a.customerName.toLowerCase();
      const nameB = b.customerNameLower || b.customerName.toLowerCase();
      if (nameA < nameB) return -1 * sortOrder;
      if (nameA > nameB) return 1 * sortOrder;
      return 0;
    }
    return 0;
  });

  // Ensure valid page and limit
  page = Math.max(1, page);
  limit = Math.max(1, limit);

  const total = filtered.length;
  const calculatedTotalPages = total > 0 ? Math.ceil(total / limit) : 1;
  
  // Clamp page to valid range
  page = Math.min(page, calculatedTotalPages);

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Format dates in the response data and remove internal optimization fields
  const paginatedData = filtered.slice(startIndex, endIndex).map(t => {
    const { customerNameLower, genderLower, customerRegionLower, brandLower, 
            productCategoryLower, paymentMethodLower, orderStatusLower, tagsLower, ...rest } = t;
    return {
      ...rest,
      date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date
    };
  });

  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages: calculatedTotalPages,
    filters: filters
  };
}

/**
 * Get statistics
 * @param {Array} filteredTransactions - Optional filtered transactions to calculate statistics for
 */
export function getStatistics(filteredTransactions = null) {
  if (!isLoaded) {
    throw new Error('Data not loaded. Please load data first.');
  }

  const dataToAnalyze = filteredTransactions || transactions;
  const totalTransactions = dataToAnalyze.length;
  const totalRevenue = dataToAnalyze.reduce((sum, t) => sum + t.finalAmount, 0);
  const totalAmount = dataToAnalyze.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalQuantity = dataToAnalyze.reduce((sum, t) => sum + t.quantity, 0);
  
  // Unique counts
  const uniqueCustomers = new Set(dataToAnalyze.map(t => t.customerId)).size;
  const uniqueProducts = new Set(dataToAnalyze.map(t => t.productId)).size;
  const uniqueStores = new Set(dataToAnalyze.map(t => t.storeId)).size;

  // Revenue by region
  const revenueByRegion = {};
  dataToAnalyze.forEach(t => {
    revenueByRegion[t.customerRegion] = (revenueByRegion[t.customerRegion] || 0) + t.finalAmount;
  });

  // Revenue by category
  const revenueByCategory = {};
  dataToAnalyze.forEach(t => {
    revenueByCategory[t.productCategory] = (revenueByCategory[t.productCategory] || 0) + t.finalAmount;
  });

  // Order status distribution
  const orderStatusCounts = {};
  dataToAnalyze.forEach(t => {
    orderStatusCounts[t.orderStatus] = (orderStatusCounts[t.orderStatus] || 0) + 1;
  });

  return {
    totalTransactions,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalQuantity,
    uniqueCustomers,
    uniqueProducts,
    uniqueStores,
    revenueByRegion,
    revenueByCategory,
    orderStatusCounts,
    averageOrderValue: totalTransactions > 0 ? Math.round((totalRevenue / totalTransactions) * 100) / 100 : 0
  };
}

/**
 * Check if data is loaded
 */
export function isDataLoaded() {
  return isLoaded;
}

/**
 * Get data count
 */
export function getDataCount() {
  return transactions.length;
}

/**
 * Get unique values for filter options
 */
export function getUniqueFilterValues() {
  if (!isLoaded) {
    throw new Error('Data not loaded. Please load data first.');
  }

  const uniqueCategories = [...new Set(transactions.map(t => t.productCategory))].sort();
  const uniqueRegions = [...new Set(transactions.map(t => t.customerRegion))].sort();
  const uniqueGenders = [...new Set(transactions.map(t => t.gender))].sort();
  const uniquePaymentMethods = [...new Set(transactions.map(t => t.paymentMethod))].sort();
  const uniqueTags = [...new Set(transactions.flatMap(t => t.tags || []))].sort();

  return {
    productCategories: uniqueCategories,
    customerRegions: uniqueRegions,
    genders: uniqueGenders,
    paymentMethods: uniquePaymentMethods,
    tags: uniqueTags
  };
}

