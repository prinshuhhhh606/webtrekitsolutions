const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enquiry',
      default: null,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Quotation title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    items: [quotationItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPercent: {
      type: Number,
      default: 18, // GST
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days valid
    },
    termsAndConditions: {
      type: String,
      default: '1. 50% advance upon project sign-off.\n2. 50% upon successful delivery and deployment.\n3. Includes 30 days of free bug-fix warranty.',
    },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
      default: 'Draft',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quotationSchema.index({ quotationNumber: 1 });
quotationSchema.index({ customerEmail: 1 });
quotationSchema.index({ status: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);

