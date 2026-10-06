const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    loanType: {
      type: String,
      enum: ['Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Business Loan'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [10000, 'Minimum loan amount is ₹10,000'],
    },
    interestRate: {
      type: Number,
      required: true,
      default: 8.5,
    },
    tenureMonths: {
      type: Number,
      required: true,
      min: [6, 'Minimum tenure is 6 months'],
      max: [360, 'Maximum tenure is 360 months'],
    },
    monthlyEmi: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    outstandingAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    emisPaidCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'disbursed', 'rejected', 'closed'],
      default: 'pending',
    },
    purpose: {
      type: String,
      default: 'Personal Requirement',
    },
    employmentType: {
      type: String,
      enum: ['Salaried', 'Self-Employed', 'Business Owner', 'Student'],
      default: 'Salaried',
    },
    monthlyIncome: {
      type: Number,
      default: 50000,
    },
    adminComment: {
      type: String,
      default: '',
    },
    disbursedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Loan', loanSchema);
