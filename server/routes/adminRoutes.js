const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserDeepDive,
  updateUserStatus,
  updateUserKyc,
  getAllAccounts,
  toggleAccountFreeze,
  adminAdjustBalance,
  getAllTransactions,
  toggleFlagTransaction,
  getAllLoans,
  reviewLoan,
  getAllCards,
  updateCardStatus,
  sendBroadcast,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDeepDive);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/kyc', updateUserKyc);

// Account Management
router.get('/accounts', getAllAccounts);
router.put('/accounts/:id/freeze', toggleAccountFreeze);
router.post('/accounts/:id/adjust', adminAdjustBalance);

// Transactions Ledger
router.get('/transactions', getAllTransactions);
router.put('/transactions/:id/flag', toggleFlagTransaction);

// Loan Underwriting & Auto-Disbursement
router.get('/loans', getAllLoans);
router.put('/loans/:id/review', reviewLoan);

// Card Management
router.get('/cards', getAllCards);
router.put('/cards/:id/status', updateCardStatus);

// Communications / Broadcasts
router.post('/broadcast', sendBroadcast);

module.exports = router;
