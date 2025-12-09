import axios from 'axios'

// Get API URL from env, remove trailing slash if present, then append /api
const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const API_BASE_URL = envApiUrl.replace(/\/$/, '') + '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const apiService = {
  // Transaction API calls
  getTransactions: async (page = 1, limit = 100) => {
    const response = await apiClient.get('/transactions', {
      params: { page, limit }
    })
    return response.data
  },

  searchTransactions: async (filters = {}, page = 1, limit = 100) => {
    // Convert arrays to comma-separated strings for query params
    const params = { ...filters, page, limit }
    if (Array.isArray(params.tags) && params.tags.length > 0) {
      params.tags = params.tags.join(',')
    }
    if (Array.isArray(params.customerRegion) && params.customerRegion.length > 0) {
      params.customerRegion = params.customerRegion.join(',')
    }
    if (Array.isArray(params.productCategory) && params.productCategory.length > 0) {
      params.productCategory = params.productCategory.join(',')
    }
    if (Array.isArray(params.paymentMethod) && params.paymentMethod.length > 0) {
      params.paymentMethod = params.paymentMethod.join(',')
    }
    const response = await apiClient.get('/transactions/search', { params })
    return response.data
  },

  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`)
    return response.data
  },

  getStatistics: async (filters = {}) => {
    // Convert arrays to comma-separated strings for query params
    const params = { ...filters }
    if (Array.isArray(params.tags) && params.tags.length > 0) {
      params.tags = params.tags.join(',')
    }
    if (Array.isArray(params.customerRegion) && params.customerRegion.length > 0) {
      params.customerRegion = params.customerRegion.join(',')
    }
    if (Array.isArray(params.productCategory) && params.productCategory.length > 0) {
      params.productCategory = params.productCategory.join(',')
    }
    if (Array.isArray(params.paymentMethod) && params.paymentMethod.length > 0) {
      params.paymentMethod = params.paymentMethod.join(',')
    }
    const response = await apiClient.get('/transactions/statistics', {
      params
    })
    return response.data
  },

  getFilterOptions: async () => {
    const response = await apiClient.get('/transactions/filter-options')
    return response.data
  }
}

export default apiService
