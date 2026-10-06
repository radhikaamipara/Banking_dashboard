const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    senderAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    senderName: {
      type: String,
      default: '',
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    receiverAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverAccountNumber: {
      type: String,
      default: '',
    },
    receiverIfsc: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least ₹1'],
    },
    fee: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: [
        'transfer_intra',
        'transfer_neft',
        'transfer_rtgs',
        'transfer_imps',
        'transfer_upi',
        'deposit',
        'withdrawal',
        'loan_disbursement',
        'loan_repayment',
        'card_payment',
        'interest_credit',
        'service_charge',
        'admin_adjustment',
      ],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Transfer',
        'Bills & Utilities',
        'Shopping',
        'Food & Dining',
        'Entertainment',
        'Investments',
        'Salary',
        'Loan',
        'Other',
      ],
      default: 'Transfer',
    },
    direction: {
      type: String,
      enum: ['debit', 'credit'],
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
    remarks: {
      type: String,
      default: '',
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
      default: '',
    },
    channel: {
      type: String,
      enum: ['YONO Web', 'YONO Mobile', 'Branch', 'ATM', 'UPI Gateway'],
      default: 'YONO Web',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
