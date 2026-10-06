const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
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
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      enum: ['Debit', 'Credit'],
      default: 'Debit',
    },
    network: {
      type: String,
      enum: ['RuPay Global', 'Visa Platinum', 'Mastercard World'],
      default: 'Visa Platinum',
    },
    variant: {
      type: String,
      enum: ['Classic', 'Platinum', 'Signature', 'Corporate'],
      default: 'Platinum',
    },
    expiryMonth: {
      type: String,
      required: true,
      default: '12',
    },
    expiryYear: {
      type: String,
      required: true,
      default: '2029',
    },
    cvv: {
      type: String,
      required: true,
      default: '345',
    },
    pin: {
      type: String, // hashed PIN
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'blocked', 'requested'],
      default: 'active',
    },
    dailyAtmLimit: {
      type: Number,
      default: 40000,
    },
    dailyOnlineLimit: {
      type: Number,
      default: 75000,
    },
    internationalEnabled: {
      type: Boolean,
      default: false,
    },
    onlineEnabled: {
      type: Boolean,
      default: true,
    },
    contactlessEnabled: {
      type: Boolean,
      default: true,
    },
    atmWithdrawalEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Card', cardSchema);
