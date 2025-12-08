import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  customerRegion: {
    type: String,
    required: true,
    index: true
  },
  customerType: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true,
    index: true
  },
  tags: {
    type: [String],
    default: []
  },
  quantity: {
    type: Number,
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    required: true,
    index: true
  },
  deliveryType: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true,
    index: true
  },
  storeLocation: {
    type: String,
    required: true
  },
  salespersonId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for common query patterns and performance optimization
// Composite indexes for common filter combinations (order matters - most selective first)
transactionSchema.index({ date: -1, customerRegion: 1 });
transactionSchema.index({ productCategory: 1, orderStatus: 1 });
transactionSchema.index({ storeId: 1, date: -1 });
transactionSchema.index({ customerRegion: 1, gender: 1, productCategory: 1 });
transactionSchema.index({ productCategory: 1, paymentMethod: 1 });
transactionSchema.index({ customerRegion: 1, date: -1 });

// Single field indexes for individual filters
transactionSchema.index({ customerName: 'text', phoneNumber: 'text' }); // Text search index
transactionSchema.index({ finalAmount: 1 }); // Sorting by amount
transactionSchema.index({ age: 1 }); // Age range filtering
transactionSchema.index({ tags: 1 }); // Tags filtering
transactionSchema.index({ customerName: 1 }); // For sorting by customerName
transactionSchema.index({ date: -1 }); // Default date sorting

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

