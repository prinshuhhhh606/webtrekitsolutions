const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
      trim: true,
    },
    client: {
      type: String,
      default: 'Confidential Client',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Web Development',
    },
    image: {
      type: String,
      required: [true, 'Project image is required'],
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    budget: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: String,
      default: '$65',
      trim: true,
    },
    completionDate: {
      type: String,
      default: '',
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Project', projectSchema);

