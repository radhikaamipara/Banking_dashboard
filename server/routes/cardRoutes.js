const express = require('express');
const router = express.Router();
const {
  getMyCards,
  toggleCardFreeze,
  updateCardSettings,
  setCardPin,
  applyForCard,
} = require('../controllers/cardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMyCards);
router.post('/apply', applyForCard);
router.put('/:id/toggle-freeze', toggleCardFreeze);
router.put('/:id/settings', updateCardSettings);
router.put('/:id/pin', setCardPin);

module.exports = router;
