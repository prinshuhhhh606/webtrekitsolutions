const mongoose = require('mongoose');

const clientProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enquiry',
      default: null,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
      default: null,
    },
    actualDeliveryDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'],
      default: 'Planning',
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    assignedTeam: {
      type: String,
      default: 'Webtrek Dev Team',
      trim: true,
    },
    internalNotes: {
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
clientProjectSchema.index({ status: 1 });
clientProjectSchema.index({ clientEmail: 1 });

module.exports = mongoose.model('ClientProject', clientProjectSchema);

