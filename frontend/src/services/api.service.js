import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

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
    // Convert tags array to comma-separated string for query params
    const params = { ...filters, page, limit }
    if (Array.isArray(params.tags) && params.tags.length > 0) {
      params.tags = params.tags.join(',')
    }
    const response = await apiClient.get('/transactions/search', { params })
    return response.data
  },

  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`)
    return response.data
  },

  getStatistics: async (filters = {}) => {
    // Convert tags array to comma-separated string for query params
    const params = { ...filters }
    if (Array.isArray(params.tags) && params.tags.length > 0) {
      params.tags = params.tags.join(',')
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
