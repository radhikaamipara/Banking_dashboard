const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Generate unique 11-digit SBI Account Number
const generateAccountNumber = () => {
  const prefix = '309';
  const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
  return prefix + random8;
};

// @desc    Get all accounts of logged-in user
// @route   GET /api/accounts
// @access  Private
exports.getMyAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    res.json({
      success: true,
      count: accounts.length,
      totalBalance,
      accounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get account details by ID
// @route   GET /api/accounts/:id
// @access  Private
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found or access denied.' });
    }

    // Get recent transactions for this account
    const transactions = await Transaction.find({
      $or: [{ senderAccountId: account._id }, { receiverAccountId: account._id }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      account,
      recentTransactions: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Open a new account (e.g., Current or Fixed Deposit)
// @route   POST /api/accounts/open
// @access  Private
exports.openAccount = async (req, res) => {
  try {
    const { accountType, initialDeposit = 10000, nomineeName } = req.body;

    if (!['Savings', 'Current', 'Fixed Deposit'].includes(accountType)) {
      return res.status(400).json({ success: false, message: 'Invalid account type requested.' });
    }

    let accNumber = generateAccountNumber();
    let isUnique = false;
    while (!isUnique) {
      const check = await Account.findOne({ accountNumber: accNumber });
      if (!check) isUnique = true;
      else accNumber = generateAccountNumber();
    }

    const interestRate = accountType === 'Fixed Deposit' ? 7.1 : accountType === 'Current' ? 0.0 : 3.5;

    const account = await Account.create({
      userId: req.user._id,
      accountNumber: accNumber,
      accountType,
      balance: Number(initialDeposit),
      ledgerBalance: Number(initialDeposit),
      interestRate,
      nomineeName: nomineeName || 'Family Nominee',
      isPrimary: false,
    });

    await Notification.create({
      userId: req.user._id,
      title: `New ${accountType} Opened`,
      message: `Your new ${accountType} #${accNumber} is now active with starting balance ₹${Number(initialDeposit).toLocaleString('en-IN')}.`,
      type: 'system',
    });

    res.status(201).json({
      success: true,
      message: `${accountType} opened successfully!`,
      account,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get account statement
// @route   GET /api/accounts/:id/statement
// @access  Private
exports.getAccountStatement = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const query = {
      $or: [{ senderAccountId: account._id }, { receiverAccountId: account._id }],
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (type && type !== 'all') {
      if (type === 'credit') query.direction = 'credit';
      else if (type === 'debit') query.direction = 'debit';
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    const totalDebits = transactions
      .filter((t) => t.direction === 'debit' || String(t.senderAccountId) === String(account._id))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredits = transactions
      .filter((t) => t.direction === 'credit' || String(t.receiverAccountId) === String(account._id))
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      accountInfo: {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        ifscCode: account.ifscCode,
        branch: account.branch,
      },
      period: {
        startDate: startDate || 'All Time',
        endDate: endDate || 'Current Date',
      },
      summary: {
        totalDebits,
        totalCredits,
        transactionCount: transactions.length,
      },
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
