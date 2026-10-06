const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ['Savings', 'Current', 'Fixed Deposit', 'Salary'],
      default: 'Savings',
    },
    balance: {
      type: Number,
      required: true,
      default: 10000,
      min: [0, 'Balance cannot be negative'],
    },
    ledgerBalance: {
      type: Number,
      default: function () {
        return this.balance;
      },
    },
    currency: {
      type: String,
      default: 'INR',
    },
    ifscCode: {
      type: String,
      default: 'SBIN0001234',
    },
    branch: {
      type: String,
      default: 'Nariman Point, Mumbai',
    },
    branchCode: {
      type: String,
      default: '01234',
    },
    micrCode: {
      type: String,
      default: '400002015',
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'closed'],
      default: 'active',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    dailyTransferLimit: {
      type: Number,
      default: 100000, // 1 Lakh INR daily limit
    },
    usedTodayTransfer: {
      type: Number,
      default: 0,
    },
    interestRate: {
      type: Number,
      default: 3.5, // 3.5% for savings, or custom for FD
    },
    nomineeName: {
      type: String,
      default: 'Primary Nominee',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Account', accountSchema);
