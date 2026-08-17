const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  skillRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  schedule: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  message: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  rating: {
    requesterRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    providerRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    requesterFeedback: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    providerFeedback: {
      type: String,
      maxlength: 200,
      trim: true,
    },
  },
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
ExchangeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = Date.now();
  }
  
  // Set cancelledAt when status changes to cancelled or rejected
  if (this.isModified('status') && (this.status === 'cancelled' || this.status === 'rejected')) {
    this.cancelledAt = Date.now();
  }
  
  next();
});

// Index for faster queries
ExchangeSchema.index({ requester: 1, provider: 1 });
ExchangeSchema.index({ status: 1 });
ExchangeSchema.index({ createdAt: -1 });

// Virtual for duration in days
ExchangeSchema.virtual('durationDays').get(function() {
  if (this.startDate && this.endDate) {
    const diff = this.endDate - this.startDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for isActive
ExchangeSchema.virtual('isActive').get(function() {
  return ['pending', 'accepted', 'ongoing'].includes(this.status);
});

// Ensure virtuals are included in JSON output
ExchangeSchema.set('toJSON', { virtuals: true });
ExchangeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Exchange', ExchangeSchema);