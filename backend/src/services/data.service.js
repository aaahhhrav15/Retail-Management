import Transaction from '../models/Transaction.js';
import connectDB from '../utils/database.js';

// Cache for statistics and filter options (computed once on server start)
let cachedStats = null;
let cachedFilterOptions = null;
let isInitialized = false;

/**
 * Initialize database connection and cache statistics/filter options
 */
export async function initializeDataService() {
  if (isInitialized) {
    return;
  }

  try {
    await connectDB();
    
    // Pre-compute statistics and filter options on startup
    console.log('Pre-computing statistics and filter options...');
    cachedStats = await computeStatistics();
    cachedFilterOptions = await computeFilterOptions();
    
    isInitialized = true;
    console.log('Data service initialized successfully');
  } catch (error) {
    console.error('Error initializing data service:', error);
    throw error;
  }
}

/**
 * Get all transactions with pagination
 */
export async function getAllTransactions(page = 1, limit = 100) {
  // Ensure valid page and limit
  page = Math.max(1, page);
  limit = Math.max(1, limit);

  const total = await Transaction.countDocuments();
  const calculatedTotalPages = total > 0 ? Math.ceil(total / limit) : 1;
  
  // Clamp page to valid range
  page = Math.min(page, calculatedTotalPages);

  const skip = (page - 1) * limit;
  
  const data = await Transaction.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // lean() for better performance

  // Format dates
  const paginatedData = data.map(t => ({
    ...t,
    date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date,
    _id: undefined,
    __v: undefined
  }));

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
export async function getTransactionById(transactionId) {
  const transaction = await Transaction.findOne({ transactionId: parseInt(transactionId) }).lean();
  
  if (!transaction) {
    return null;
  }

  return {
    ...transaction,
    date: transaction.date instanceof Date ? transaction.date.toISOString().split('T')[0] : transaction.date,
    _id: undefined,
    __v: undefined
  };
}

/**
 * Build MongoDB query from filters
 */
function buildQuery(filters) {
  const query = {};

  if (filters.customerId) {
    query.customerId = filters.customerId;
  }

  // Handle search queries - if both customerName and phoneNumber are provided,
  // use OR logic to match either field (for general search functionality)
  // Otherwise, use AND logic for explicit filters
  const hasNameSearch = filters.customerName && filters.customerName.trim();
  const hasPhoneSearch = filters.phoneNumber && filters.phoneNumber.trim();
  
  if (hasNameSearch && hasPhoneSearch) {
    // Both provided - use OR logic for search (match either name OR phone)
    const escapedName = filters.customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cleanedPhone = filters.phoneNumber.replace(/\D/g, '');
    
    if (cleanedPhone) {
      const escapedPhone = cleanedPhone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Use $or to match either customerName OR phoneNumber
      if (!query.$or) query.$or = [];
      query.$or.push(
        { customerName: { $regex: escapedName, $options: 'i' } },
        { phoneNumber: { $regex: escapedPhone, $options: 'i' } }
      );
    } else {
      // Only name search if phone cleaning resulted in empty string
      query.customerName = { $regex: escapedName, $options: 'i' };
    }
  } else {
    // Only one provided - use individual field matching
    if (hasNameSearch) {
      // Escape special regex characters for accurate matching
      // Use case-insensitive regex for partial matching (for search functionality)
      const escapedName = filters.customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.customerName = { $regex: escapedName, $options: 'i' };
    }

    if (hasPhoneSearch) {
      // Escape special regex characters and make case-insensitive for consistency
      // Remove non-digit characters for phone number matching (handles +91, spaces, etc.)
      const cleanedPhone = filters.phoneNumber.replace(/\D/g, '');
      if (cleanedPhone) {
        const escapedPhone = cleanedPhone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match phone numbers that contain the cleaned digits (handles +91 prefix, spaces, etc.)
        query.phoneNumber = { $regex: escapedPhone, $options: 'i' };
      }
    }
  }

  // Use exact match for dropdown selections (faster with index)
  // Handle customerRegion as array (multi-select)
  if (filters.customerRegion) {
    if (Array.isArray(filters.customerRegion) && filters.customerRegion.length > 0) {
      query.customerRegion = { $in: filters.customerRegion };
    } else if (typeof filters.customerRegion === 'string') {
      query.customerRegion = filters.customerRegion;
    }
  }

  if (filters.gender) {
    query.gender = filters.gender;
  }

  // Handle productCategory as array (multi-select)
  if (filters.productCategory) {
    if (Array.isArray(filters.productCategory) && filters.productCategory.length > 0) {
      query.productCategory = { $in: filters.productCategory };
    } else if (typeof filters.productCategory === 'string') {
      query.productCategory = filters.productCategory;
    }
  }

  if (filters.orderStatus) {
    query.orderStatus = filters.orderStatus;
  }

  if (filters.storeId) {
    query.storeId = filters.storeId;
  }

  if (filters.brand) {
    query.brand = { $regex: filters.brand, $options: 'i' };
  }

  // Handle paymentMethod as array (multi-select)
  if (filters.paymentMethod) {
    if (Array.isArray(filters.paymentMethod) && filters.paymentMethod.length > 0) {
      query.paymentMethod = { $in: filters.paymentMethod };
    } else if (typeof filters.paymentMethod === 'string') {
      query.paymentMethod = filters.paymentMethod;
    }
  }

  // Date filters - date range takes priority over individual date
  if (filters.dateFrom || filters.dateTo) {
    // Date range filter
    query.date = {};
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      dateFrom.setHours(0, 0, 0, 0);
      query.date.$gte = dateFrom;
    }
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // Include entire day
      query.date.$lte = dateTo;
    }
  } else if (filters.date) {
    // Individual date filter (only if no date range is set)
    const filterDate = new Date(filters.date);
    filterDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: filterDate, $lt: nextDay };
  }

  if (filters.minAmount !== undefined && filters.minAmount !== null && filters.minAmount !== '') {
    if (!query.finalAmount) query.finalAmount = {};
    query.finalAmount.$gte = parseFloat(filters.minAmount);
  }

  if (filters.maxAmount !== undefined && filters.maxAmount !== null && filters.maxAmount !== '') {
    if (!query.finalAmount) query.finalAmount = {};
    query.finalAmount.$lte = parseFloat(filters.maxAmount);
  }

  // Age range filter
  if (filters.ageRange) {
    const ageRange = filters.ageRange;
    if (ageRange.includes('+')) {
      const minAge = parseInt(ageRange.replace('+', ''));
      query.age = { $gte: minAge };
    } else if (ageRange.includes('-')) {
      const [minAge, maxAge] = ageRange.split('-').map(age => parseInt(age.trim()));
      query.age = { $gte: minAge, $lte: maxAge };
    }
  }

  // Tags filter - support multiple tags (array or comma-separated string)
  if (filters.tags) {
    // Handle both array and comma-separated string formats
    let tagArray = [];
    if (Array.isArray(filters.tags)) {
      tagArray = filters.tags.filter(tag => tag && tag.trim());
    } else if (typeof filters.tags === 'string') {
      tagArray = filters.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    if (tagArray.length > 0) {
      // Use $in to match any of the selected tags (OR logic)
      // This means a transaction matches if it has ANY of the selected tags
      query.tags = { $in: tagArray };
    }
  }

  return query;
}

/**
 * Build sort object from filters
 */
function buildSort(sortBy, sortOrder) {
  const sort = {};
  const order = sortOrder === 'desc' ? -1 : 1;

  if (sortBy === 'date') {
    sort.date = order;
  } else if (sortBy === 'finalAmount') {
    sort.finalAmount = order;
  } else if (sortBy === 'quantity') {
    sort.quantity = order;
  } else if (sortBy === 'age') {
    sort.age = order;
  } else if (sortBy === 'transactionId') {
    sort.transactionId = order;
  } else if (sortBy === 'customerName') {
    sort.customerName = order;
  } else {
    // Default sort
    sort.customerName = 1;
  }

  return sort;
}

/**
 * Search/filter transactions - Optimized with MongoDB queries
 */
export async function searchTransactions(filters = {}, page = 1, limit = 100) {
  // Ensure valid page and limit
  page = Math.max(1, page);
  limit = Math.max(1, limit);

  // Build MongoDB query
  const query = buildQuery(filters);
  
  // Get total count
  const total = await Transaction.countDocuments(query);
  const calculatedTotalPages = total > 0 ? Math.ceil(total / limit) : 1;
  
  // Clamp page to valid range
  page = Math.min(page, calculatedTotalPages);

  // Build sort
  const sort = buildSort(filters.sortBy || 'customerName', filters.sortOrder || 'asc');

  // Pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination - using lean() for better performance
  // lean() returns plain JavaScript objects instead of Mongoose documents (faster)
  const data = await Transaction.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // Remove hint - let MongoDB query optimizer choose best index

  // Format dates and remove MongoDB-specific fields
  const paginatedData = data.map(t => ({
    ...t,
    date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date,
    _id: undefined,
    __v: undefined
  }));

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
 * Compute statistics from database with filters
 */
async function computeStatisticsWithFilters(filters) {
  // Build the same query as searchTransactions
  const query = buildQuery(filters);

  // Use parallel aggregation for better performance
  const [statsResult, revenueByRegionPipeline, revenueByCategoryPipeline, orderStatusPipeline] = await Promise.all([
    Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          totalAmount: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' },
          uniqueCustomers: { $addToSet: '$customerId' },
          uniqueProducts: { $addToSet: '$productId' },
          uniqueStores: { $addToSet: '$storeId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalTransactions: 1,
          totalRevenue: 1,
          totalAmount: 1,
          totalQuantity: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
          uniqueProducts: { $size: '$uniqueProducts' },
          uniqueStores: { $size: '$uniqueStores' }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$customerRegion',
          revenue: { $sum: '$finalAmount' }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$productCategory',
          revenue: { $sum: '$finalAmount' }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const stats = statsResult[0] || {
    totalTransactions: 0,
    totalRevenue: 0,
    totalAmount: 0,
    totalQuantity: 0,
    uniqueCustomers: 0,
    uniqueProducts: 0,
    uniqueStores: 0
  };

  const revenueByRegion = {};
  revenueByRegionPipeline.forEach(item => {
    revenueByRegion[item._id] = Math.round(item.revenue * 100) / 100;
  });

  const revenueByCategory = {};
  revenueByCategoryPipeline.forEach(item => {
    revenueByCategory[item._id] = Math.round(item.revenue * 100) / 100;
  });

  const orderStatusCounts = {};
  orderStatusPipeline.forEach(item => {
    orderStatusCounts[item._id] = item.count;
  });

  return {
    totalTransactions: stats.totalTransactions,
    totalRevenue: Math.round(stats.totalRevenue * 100) / 100,
    totalAmount: Math.round(stats.totalAmount * 100) / 100,
    totalQuantity: stats.totalQuantity,
    uniqueCustomers: stats.uniqueCustomers,
    uniqueProducts: stats.uniqueProducts,
    uniqueStores: stats.uniqueStores,
    revenueByRegion,
    revenueByCategory,
    orderStatusCounts,
    averageOrderValue: stats.totalTransactions > 0 
      ? Math.round((stats.totalRevenue / stats.totalTransactions) * 100) / 100 
      : 0
  };
}

/**
 * Compute statistics from database (all data)
 */
async function computeStatistics() {

  // Compute from database using optimized aggregation pipeline
  // Using parallel aggregation for better performance
  const [statsResult, revenueByRegionPipeline, revenueByCategoryPipeline, orderStatusPipeline] = await Promise.all([
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          totalAmount: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' },
          uniqueCustomers: { $addToSet: '$customerId' },
          uniqueProducts: { $addToSet: '$productId' },
          uniqueStores: { $addToSet: '$storeId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalTransactions: 1,
          totalRevenue: 1,
          totalAmount: 1,
          totalQuantity: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
          uniqueProducts: { $size: '$uniqueProducts' },
          uniqueStores: { $size: '$uniqueStores' }
        }
      }
    ]),
    // Get revenue by region
    Transaction.aggregate([
      {
        $group: {
          _id: '$customerRegion',
          revenue: { $sum: '$finalAmount' }
        }
      }
    ]),
    // Get revenue by category
    Transaction.aggregate([
      {
        $group: {
          _id: '$productCategory',
          revenue: { $sum: '$finalAmount' }
        }
      }
    ]),
    // Get order status counts
    Transaction.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const stats = statsResult;

  // Process aggregation results
  const revenueByRegion = {};
  revenueByRegionPipeline.forEach(item => {
    revenueByRegion[item._id] = Math.round(item.revenue * 100) / 100;
  });

  const revenueByCategory = {};
  revenueByCategoryPipeline.forEach(item => {
    revenueByCategory[item._id] = Math.round(item.revenue * 100) / 100;
  });

  const orderStatusCounts = {};
  orderStatusPipeline.forEach(item => {
    orderStatusCounts[item._id] = item.count;
  });

  const result = stats[0] || {
    totalTransactions: 0,
    totalRevenue: 0,
    totalAmount: 0,
    totalQuantity: 0,
    uniqueCustomers: 0,
    uniqueProducts: 0,
    uniqueStores: 0
  };

  return {
    totalTransactions: result.totalTransactions,
    totalRevenue: Math.round(result.totalRevenue * 100) / 100,
    totalAmount: Math.round(result.totalAmount * 100) / 100,
    totalQuantity: result.totalQuantity,
    uniqueCustomers: result.uniqueCustomers,
    uniqueProducts: result.uniqueProducts,
    uniqueStores: result.uniqueStores,
    revenueByRegion,
    revenueByCategory,
    orderStatusCounts,
    averageOrderValue: result.totalTransactions > 0 
      ? Math.round((result.totalRevenue / result.totalTransactions) * 100) / 100 
      : 0
  };
}

/**
 * Get statistics - with optional filters
 */
export async function getStatistics(filters = null) {
  // Use cached stats when no filters are provided
  if (!filters || Object.keys(filters).length === 0) {
    if (cachedStats) {
      return cachedStats;
    }
    return await computeStatistics();
  }

  // Compute statistics for filtered data
  return await computeStatisticsWithFilters(filters);
}

/**
 * Compute filter options from database
 */
async function computeFilterOptions() {
  const [
    uniqueCategories,
    uniqueRegions,
    uniqueGenders,
    uniquePaymentMethods,
    uniqueTags
  ] = await Promise.all([
    Transaction.distinct('productCategory'),
    Transaction.distinct('customerRegion'),
    Transaction.distinct('gender'),
    Transaction.distinct('paymentMethod'),
    Transaction.distinct('tags')
  ]);

  // Filter out 'Home' and 'Sports' from product categories
  const filteredCategories = uniqueCategories
    .filter(category => category && category.toLowerCase() !== 'home' && category.toLowerCase() !== 'sports')
    .sort();

  return {
    productCategories: filteredCategories,
    customerRegions: uniqueRegions.sort(),
    genders: uniqueGenders.sort(),
    paymentMethods: uniquePaymentMethods.sort(),
    tags: uniqueTags.filter(tag => tag).sort()
  };
}
 // Get unique values for filter options
 
export async function getUniqueFilterValues() {
  if (cachedFilterOptions) {
    return cachedFilterOptions;
  }

  cachedFilterOptions = await computeFilterOptions();
  return cachedFilterOptions;
}

// Check if data service is initialized
export function isDataLoaded() {
  return isInitialized;
}

// Get data count

export async function getDataCount() {
  return await Transaction.countDocuments();
}
