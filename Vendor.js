const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // Vendor Details
  vendorName: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  vendorType: {
    type: String,
    required: [true, 'Vendor type is required'],
    enum: {
      values: ['MANUFACTURER', 'DISTRIBUTOR', 'AGENT', 'OTHER', 'CFT', 'C&A'],
      message: '{VALUE} is not a valid vendor type'
    }
  },
  vendorComposition: {
    type: String,
    enum: {
      values: ['Company', 'Partnership', 'Firm', 'Other', ''],
      message: '{VALUE} is not a valid vendor composition'
    },
    default: ''
  },
  cin: {
    type: String,
    trim: true,
    default: ''
  },
  msmeRegNo: {
    type: String,
    trim: true,
    default: ''
  },
  contactAddress: {
    type: String,
    required: [true, 'Contact address is required'],
    trim: true
  },
  cityAndState: {
    type: String,
    required: [true, 'City and state is required'],
    trim: true
  },
  emailId: {
    type: String,
    required: [true, 'Email ID is required'],
    trim: true,
    lowercase: true
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  creditPeriodDays: {
    type: String,
    trim: true,
    default: ''
  },

  // Tax Details
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },
  pan: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },
  drugLicenceNo: {
    type: String,
    trim: true,
    default: ''
  },
  foodLicenceNo: {
    type: String,
    trim: true,
    default: ''
  },

  // Bank Details
  bankName: {
    type: String,
    trim: true,
    default: ''
  },
  bankAccountNo: {
    type: String,
    trim: true,
    default: ''
  },
  ifscCode: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },

  // Declaration
  declarantName: {
    type: String,
    trim: true,
    default: ''
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  declarationDate: {
    type: String,
    trim: true,
    default: ''
  },

  // System
  status: {
    type: String,
    default: 'New',
    enum: ['New', 'Verified', 'Approved', 'Rejected']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
