const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters']
  },
  directorName: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true,
    minlength: [2, 'Director name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
partnerSchema.index({ email: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ submittedAt: -1 });

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;

