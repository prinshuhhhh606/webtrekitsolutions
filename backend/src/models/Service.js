const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'Code',
    },
    image: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'Development',
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);

