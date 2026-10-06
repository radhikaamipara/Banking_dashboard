const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Public contact submission
router.post('/', submitInquiry);

// Admin contact management
router.get('/all', protect, adminOnly, getAllInquiries);
router.put('/:id', protect, adminOnly, updateInquiryStatus);

module.exports = router;
