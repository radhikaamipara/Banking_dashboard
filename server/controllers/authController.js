const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Account = require('../models/Account');
const Card = require('../models/Card');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sbi_yono_super_secure_jwt_secret_key_2026_mca_sem3', {
    expiresIn: '30d',
  });
};

// Generate unique 11-digit SBI Account Number
const generateAccountNumber = () => {
  const prefix = '309';
  const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
  return prefix + random8;
};

// Generate 16-digit Card Number
const generateCardNumber = () => {
  const prefix = '4591'; // SBI Visa Platinum prefix
  let rest = '';
  for (let i = 0; i < 3; i++) {
    rest += ' ' + Math.floor(1000 + Math.random() * 9000).toString();
  }
  return prefix + rest;
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, tPin, initialDeposit = 25000 } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash T-PIN if provided, otherwise default to hashed 1234
    const plainPin = tPin || '1234';
    const pinSalt = await bcrypt.genSalt(10);
    const hashedTPin = await bcrypt.hash(plainPin, pinSalt);

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      phone,
      tPin: hashedTPin,
      kycStatus: 'pending',
    });

    // Automatically create primary savings account
    let accNumber = generateAccountNumber();
    let isUnique = false;
    while (!isUnique) {
      const check = await Account.findOne({ accountNumber: accNumber });
      if (!check) isUnique = true;
      else accNumber = generateAccountNumber();
    }

    const account = await Account.create({
      userId: user._id,
      accountNumber: accNumber,
      accountType: 'Savings',
      balance: Number(initialDeposit),
      ledgerBalance: Number(initialDeposit),
      isPrimary: true,
      ifscCode: 'SBIN0001234',
      branch: 'Main Financial District, Mumbai',
    });

    // Automatically issue primary Visa Platinum Debit Card
    const card = await Card.create({
      userId: user._id,
      accountId: account._id,
      cardNumber: generateCardNumber(),
      cardHolderName: user.name.toUpperCase(),
      cardType: 'Debit',
      network: 'Visa Platinum',
      expiryMonth: '09',
      expiryYear: '2029',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      status: 'active',
      pin: hashedTPin,
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to YONO SBI Digital Banking',
      message: `Dear ${user.name}, your Primary Savings Account #${accNumber} has been opened with ₹${initialDeposit.toLocaleString('en-IN')}. T-PIN is set.`,
      type: 'system',
    });

    // Audit log
    await AuditLog.create({
      performedBy: user._id,
      role: 'user',
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id,
      details: { email: user.email, accountNumber: accNumber },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
        avatar: user.avatar,
      },
      account,
      card,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your banking account has been temporarily blocked. Please contact branch support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Fetch primary account
    const primaryAccount = await Account.findOne({ userId: user._id, isPrimary: true });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
        status: user.status,
        avatar: user.avatar,
        hasTPin: !!user.tPin,
      },
      account: primaryAccount,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accounts = await Account.find({ userId: user._id });
    const cards = await Card.find({ userId: user._id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        kycStatus: user.kycStatus,
        kycDetails: user.kycDetails,
        avatar: user.avatar,
        securitySettings: user.securitySettings,
        hasTPin: !!user.tPin,
        createdAt: user.createdAt,
      },
      accounts,
      cards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile & KYC
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, occupation, address, city, state, pincode, panNumber, aadharMasked, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (occupation) user.occupation = occupation;
    if (avatar !== undefined) user.avatar = avatar;

    if (!user.kycDetails) user.kycDetails = {};
    if (address !== undefined) user.kycDetails.address = address;
    if (city !== undefined) user.kycDetails.city = city;
    if (state !== undefined) user.kycDetails.state = state;
    if (pincode !== undefined) user.kycDetails.pincode = pincode;

    const panChanged = panNumber && panNumber !== user.kycDetails.panNumber;
    const aadharChanged = aadharMasked && aadharMasked !== user.kycDetails.aadharMasked;

    if (panNumber !== undefined) user.kycDetails.panNumber = panNumber;
    if (aadharMasked !== undefined) user.kycDetails.aadharMasked = aadharMasked;

    if (panChanged || aadharChanged) {
      user.kycStatus = 'pending';
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation,
        role: user.role,
        status: user.status,
        kycStatus: user.kycStatus,
        kycDetails: user.kycDetails,
        avatar: user.avatar,
        hasTPin: !!user.tPin,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or change Transaction PIN (T-PIN)
// @route   POST /api/auth/tpin
// @access  Private
exports.setTPin = async (req, res) => {
  try {
    const { pin, currentPassword } = req.body;

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'T-PIN must be exactly 4 digits.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is required to update T-PIN.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.tPin = await bcrypt.hash(pin, salt);
    await user.save();

    await Notification.create({
      userId: user._id,
      title: 'Security Alert: T-PIN Changed',
      message: 'Your 4-digit Transaction PIN (T-PIN) has been updated successfully.',
      type: 'security',
    });

    res.json({ success: true, message: '4-digit Transaction PIN set successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
