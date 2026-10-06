const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      default: 'State Bank of India',
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
    },
    transferType: {
      type: String,
      enum: ['Intra-Bank', 'Inter-Bank', 'UPI'],
      default: 'Intra-Bank',
    },
    upiId: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 50000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
