const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  setTPin,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/tpin', protect, setTPin);
router.put('/change-password', protect, changePassword);

module.exports = router;
