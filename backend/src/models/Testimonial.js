const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    designation: {
      type: String,
      default: 'Business Owner',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    feedback: {
      type: String,
      required: [true, 'Feedback is required'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
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

module.exports = mongoose.model('Testimonial', testimonialSchema);

