const express = require('express');
const router = express.Router();
const {
  getMyAccounts,
  getAccountById,
  openAccount,
  getAccountStatement,
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMyAccounts);
router.post('/open', openAccount);
router.get('/:id', getAccountById);
router.get('/:id/statement', getAccountStatement);

module.exports = router;
