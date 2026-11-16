const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service selection is required'],
      default: 'Website Development',
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description or requirement is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      default: 'Not Decided Yet',
      trim: true,
    },
    timeline: {
      type: String,
      default: 'Just Exploring',
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['Any', 'Phone', 'WhatsApp', 'Email'],
      default: 'Any',
    },
    enquiryType: {
      type: String,
      enum: ['General', 'Service', 'Quote', 'Consultation', 'Project'],
      default: 'General',
    },
    relatedProject: {
      type: String,
      default: '',
      trim: true,
    },
    sourcePage: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
      default: null,
    },
    followUpStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    contactHistory: [
      {
        date: { type: Date, default: Date.now },
        channel: { type: String, default: 'Phone Call' },
        notes: { type: String, default: '' },
        createdBy: { type: String, default: 'Admin' },
      },
    ],
    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure fullName and name, projectDescription and message stay synchronized
enquirySchema.pre('save', function (next) {
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.name && !this.fullName) this.fullName = this.name;
  if (this.projectDescription && !this.message) this.message = this.projectDescription;
  if (this.message && !this.projectDescription) this.projectDescription = this.message;
  next();
});

// Indexes for fast lookup & filtering in Admin dashboard
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ service: 1 });
enquirySchema.index({ email: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
