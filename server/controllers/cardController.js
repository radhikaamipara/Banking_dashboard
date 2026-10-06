const Card = require('../models/Card');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

const generateCardNumber = (type = 'Visa') => {
  const prefix = type.includes('RuPay') ? '6071' : type.includes('Mastercard') ? '5243' : '4591';
  let rest = '';
  for (let i = 0; i < 3; i++) {
    rest += ' ' + Math.floor(1000 + Math.random() * 9000).toString();
  }
  return prefix + rest;
};

// @desc    Get all cards of current user
// @route   GET /api/cards
// @access  Private
exports.getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id }).populate('accountId', 'accountNumber accountType');
    res.json({ success: true, count: cards.length, cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle card freeze/unfreeze status
// @route   PUT /api/cards/:id/toggle-freeze
// @access  Private
exports.toggleCardFreeze = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    if (card.status === 'blocked') {
      return res.status(400).json({ success: false, message: 'This card is permanently blocked. Contact branch.' });
    }

    const newStatus = card.status === 'frozen' ? 'active' : 'frozen';
    card.status = newStatus;
    await card.save();

    await Notification.create({
      userId: req.user._id,
      title: `Card ${newStatus === 'frozen' ? 'Locked' : 'Unlocked'}`,
      message: `Your ${card.cardType} card ending in ${card.cardNumber.slice(-4)} has been ${newStatus}.`,
      type: 'card',
      metadata: { cardId: card._id, status: newStatus },
    });

    res.json({
      success: true,
      message: `Card has been ${newStatus === 'frozen' ? 'temporarily frozen' : 'unfrozen and activated'}.`,
      card,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update card settings (Limits & channels)
// @route   PUT /api/cards/:id/settings
// @access  Private
exports.updateCardSettings = async (req, res) => {
  try {
    const { dailyAtmLimit, dailyOnlineLimit, internationalEnabled, onlineEnabled, contactlessEnabled } = req.body;

    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    if (dailyAtmLimit !== undefined) card.dailyAtmLimit = Number(dailyAtmLimit);
    if (dailyOnlineLimit !== undefined) card.dailyOnlineLimit = Number(dailyOnlineLimit);
    if (internationalEnabled !== undefined) card.internationalEnabled = Boolean(internationalEnabled);
    if (onlineEnabled !== undefined) card.onlineEnabled = Boolean(onlineEnabled);
    if (contactlessEnabled !== undefined) card.contactlessEnabled = Boolean(contactlessEnabled);

    await card.save();

    await Notification.create({
      userId: req.user._id,
      title: 'Card Security Preferences Updated',
      message: `Security controls were updated for your card ending in ${card.cardNumber.slice(-4)}.`,
      type: 'card',
      metadata: { cardId: card._id },
    });

    res.json({
      success: true,
      message: 'Card security preferences updated successfully.',
      card,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or change Card ATM/POS PIN
// @route   PUT /api/cards/:id/pin
// @access  Private
exports.setCardPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'Card PIN must be a 4-digit number.' });
    }

    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found.' });

    const salt = await bcrypt.genSalt(10);
    card.pin = await bcrypt.hash(pin, salt);
    await card.save();

    await Notification.create({
      userId: req.user._id,
      title: 'Card PIN Changed',
      message: `ATM/POS PIN updated for card ending in ${card.cardNumber.slice(-4)}.`,
      type: 'security',
    });

    res.json({ success: true, message: 'Card PIN changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a new card
// @route   POST /api/cards/apply
// @access  Private
exports.applyForCard = async (req, res) => {
  try {
    const { accountId, cardType = 'Debit', network = 'Visa Platinum', variant = 'Platinum' } = req.body;

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Linked bank account not found.' });
    }

    const newCard = await Card.create({
      userId: req.user._id,
      accountId: account._id,
      cardNumber: generateCardNumber(network),
      cardHolderName: req.user.name.toUpperCase(),
      cardType,
      network,
      variant,
      expiryMonth: '08',
      expiryYear: '2030',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      status: 'active',
    });

    await Notification.create({
      userId: req.user._id,
      title: `New ${cardType} Issued`,
      message: `Your new ${network} (${variant}) has been generated and linked to A/C ...${account.accountNumber.slice(-4)}.`,
      type: 'card',
    });

    res.status(201).json({
      success: true,
      message: `Congratulations! Your new ${cardType} is active.`,
      card: newCard,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
