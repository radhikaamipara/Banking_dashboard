const express = require('express');
const router = express.Router();
const {
  transferMoney,
  getMyTransactions,
  getTransactionById,
  getSpendingAnalytics,
  getBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/transfer', transferMoney);
router.get('/', getMyTransactions);
router.get('/analytics', getSpendingAnalytics);
router.get('/beneficiaries', getBeneficiaries);
router.post('/beneficiaries', addBeneficiary);
router.delete('/beneficiaries/:id', deleteBeneficiary);
router.get('/:id', getTransactionById);

module.exports = router;
