const express = require('express');
const router = express.Router();
const {
  calculateEmi,
  applyLoan,
  getMyLoans,
  payEmi,
} = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

// Public preview for EMI calculator widget
router.post('/calculate', calculateEmi);

// Protected routes
router.use(protect);
router.get('/', getMyLoans);
router.post('/apply', applyLoan);
router.post('/:id/pay-emi', payEmi);

module.exports = router;
