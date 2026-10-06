const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const ContactInquiry = require('../models/ContactInquiry');
const AuditLog = require('../models/AuditLog');

// @desc    Get comprehensive Admin Dashboard metrics & charts
// @route   GET /api/admin/dashboard-stats
// @access  Private / Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const pendingKycUsers = await User.countDocuments({ role: 'user', kycStatus: 'pending' });

    const totalAccounts = await Account.countDocuments();
    const activeAccounts = await Account.countDocuments({ status: 'active' });

    // Aggregate total bank deposits
    const balanceAgg = await Account.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$balance' } } },
    ]);
    const totalDeposits = balanceAgg[0]?.totalBalance || 0;

    // Transaction stats
    const totalTransactions = await Transaction.countDocuments();
    const volumeAgg = await Transaction.aggregate([
      { $group: { _id: null, totalVolume: { $sum: '$amount' } } },
    ]);
    const totalVolume = volumeAgg[0]?.totalVolume || 0;

    // Loan stats
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });
    const activeLoans = await Loan.countDocuments({ status: { $in: ['approved', 'disbursed'] } });
    const loansDisbursedAgg = await Loan.aggregate([
      { $match: { status: { $in: ['approved', 'disbursed'] } } },
      { $group: { _id: null, totalBorrowed: { $sum: '$amount' }, totalOutstanding: { $sum: '$outstandingAmount' } } },
    ]);
    const totalBorrowed = loansDisbursedAgg[0]?.totalBorrowed || 0;
    const totalOutstanding = loansDisbursedAgg[0]?.totalOutstanding || 0;

    // Cards stats
    const totalCards = await Card.countDocuments();
    const activeCards = await Card.countDocuments({ status: 'active' });

    // Pending inquiries
    const pendingInquiries = await ContactInquiry.countDocuments({ status: 'new' });

    // Recent 10 transactions across the entire bank
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('senderUserId', 'name email')
      .populate('receiverUserId', 'name email');

    // Recent 5 loan applications
    const recentLoans = await Loan.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email phone');

    // Account distribution
    const savingsAccounts = await Account.countDocuments({ accountType: 'Savings' });
    const currentAccounts = await Account.countDocuments({ accountType: 'Current' });
    const fdAccounts = await Account.countDocuments({ accountType: 'Fixed Deposit' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        pendingKycUsers,
        totalAccounts,
        activeAccounts,
        totalDeposits,
        totalTransactions,
        totalVolume,
        pendingLoans,
        activeLoans,
        totalBorrowed,
        totalOutstanding,
        totalCards,
        activeCards,
        pendingInquiries,
      },
      accountDistribution: {
        savings: savingsAccounts,
        current: currentAccounts,
        fixedDeposit: fdAccounts,
      },
      recentTransactions,
      recentLoans,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with account and balance summary
// @route   GET /api/admin/users
// @access  Private / Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { search, status, kycStatus } = req.query;

    const query = { role: 'user' };
    if (status && status !== 'all') query.status = status;
    if (kycStatus && kycStatus !== 'all') query.kycStatus = kycStatus;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    // Attach account count & total balance for each user
    const usersWithData = await Promise.all(
      users.map(async (u) => {
        const accounts = await Account.find({ userId: u._id });
        const totalBal = accounts.reduce((sum, a) => sum + a.balance, 0);
        const cardCount = await Card.countDocuments({ userId: u._id });
        const loanCount = await Loan.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          accountsCount: accounts.length,
          totalBalance: totalBal,
          primaryAccount: accounts.find((a) => a.isPrimary) || accounts[0] || null,
          cardsCount: cardCount,
          loansCount: loanCount,
        };
      })
    );

    res.json({ success: true, count: usersWithData.length, users: usersWithData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user deep-dive
// @route   GET /api/admin/users/:id
// @access  Private / Admin
exports.getUserDeepDive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const accounts = await Account.find({ userId: user._id });
    const cards = await Card.find({ userId: user._id });
    const loans = await Loan.find({ userId: user._id });
    const recentTxns = await Transaction.find({
      $or: [{ senderUserId: user._id }, { receiverUserId: user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      user,
      accounts,
      cards,
      loans,
      recentTransactions: recentTxns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (Block/Unblock)
// @route   PUT /api/admin/users/:id/status
// @access  Private / Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.status = status;
    await user.save();

    await Notification.create({
      userId: user._id,
      title: `Account Status Update: ${status.toUpperCase()}`,
      message:
        status === 'blocked'
          ? 'Your online banking profile has been temporarily restricted by bank administration.'
          : 'Your online banking profile has been re-activated.',
      type: 'security',
    });

    await AuditLog.create({
      performedBy: req.user._id,
      role: 'admin',
      action: `USER_STATUS_${status.toUpperCase()}`,
      entityType: 'User',
      entityId: user._id,
      details: { email: user.email, newStatus: status },
    });

    res.json({ success: true, message: `User status changed to ${status}.`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user KYC verification
// @route   PUT /api/admin/users/:id/kyc
// @access  Private / Admin
exports.updateUserKyc = async (req, res) => {
  try {
    const { kycStatus, adminNotes } = req.body;
    if (!['verified', 'rejected', 'pending'].includes(kycStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.kycStatus = kycStatus;
    await user.save();

    await Notification.create({
      userId: user._id,
      title: `KYC Status: ${kycStatus.toUpperCase()}`,
      message:
        kycStatus === 'verified'
          ? 'Congratulations! Your KYC verification is approved. All daily transfer limits are now fully unlocked.'
          : `Your KYC verification request was rejected. Reason: ${adminNotes || 'Documentation unverified.'}`,
      type: 'security',
    });

    res.json({ success: true, message: `KYC updated to ${kycStatus}.`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all accounts across the entire bank
// @route   GET /api/admin/accounts
// @access  Private / Admin
exports.getAllAccounts = async (req, res) => {
  try {
    const { accountType, status, search } = req.query;

    const query = {};
    if (accountType && accountType !== 'all') query.accountType = accountType;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { accountNumber: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
      ];
    }

    const accounts = await Account.find(query)
      .populate('userId', 'name email phone avatar status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: accounts.length, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle account freeze status
// @route   PUT /api/admin/accounts/:id/freeze
// @access  Private / Admin
exports.toggleAccountFreeze = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('userId', 'name');
    if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });

    const newStatus = account.status === 'frozen' ? 'active' : 'frozen';
    account.status = newStatus;
    await account.save();

    await Notification.create({
      userId: account.userId._id,
      title: `Account #${account.accountNumber.slice(-4)} ${newStatus === 'frozen' ? 'Frozen' : 'Unfrozen'}`,
      message: `Your ${account.accountType} account has been ${newStatus} by bank administration.`,
      type: 'system',
    });

    res.json({ success: true, message: `Account has been marked as ${newStatus}.`, account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin manual balance adjustment (Credit or Debit)
// @route   POST /api/admin/accounts/:id/adjust
// @access  Private / Admin
exports.adminAdjustBalance = async (req, res) => {
  try {
    const { type, amount, remarks } = req.body; // type: 'credit' | 'debit'
    const numAmount = Number(amount);

    if (!['credit', 'debit'].includes(type) || !numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid adjustment type or amount.' });
    }

    const account = await Account.findById(req.params.id).populate('userId', 'name');
    if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });

    if (type === 'debit' && account.balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Cannot debit ₹${numAmount}. Available balance is only ₹${account.balance}.`,
      });
    }

    if (type === 'credit') {
      account.balance += numAmount;
    } else {
      account.balance -= numAmount;
    }
    account.ledgerBalance = account.balance;
    await account.save();

    const refId = `ADJ${Date.now().toString().slice(-8)}`;

    const txn = await Transaction.create({
      referenceId: refId,
      senderUserId: type === 'debit' ? account.userId._id : null,
      senderAccountId: type === 'debit' ? account._id : null,
      receiverUserId: type === 'credit' ? account.userId._id : null,
      receiverAccountId: type === 'credit' ? account._id : null,
      receiverName: account.userId.name,
      receiverAccountNumber: account.accountNumber,
      receiverIfsc: account.ifscCode,
      amount: numAmount,
      type: 'admin_adjustment',
      category: 'Other',
      direction: type,
      status: 'completed',
      remarks: remarks || `Administrative ${type.toUpperCase()} adjustment`,
      balanceAfter: account.balance,
      channel: 'Branch',
    });

    await Notification.create({
      userId: account.userId._id,
      title: `Account Adjustment: ${type.toUpperCase()}`,
      message: `An administrative adjustment of ₹${numAmount.toLocaleString('en-IN')} (${type}) has been processed for A/C ...${account.accountNumber.slice(-4)}. Reason: ${remarks || 'System Adjustment'}.`,
      type: 'transaction',
    });

    res.json({
      success: true,
      message: `Successfully adjusted balance by ₹${numAmount} (${type}).`,
      account,
      transaction: txn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions across entire system
// @route   GET /api/admin/transactions
// @access  Private / Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const { type, direction, isFlagged, search, page = 1, limit = 30 } = req.query;

    const query = {};
    if (type && type !== 'all') query.type = type;
    if (direction && direction !== 'all') query.direction = direction;
    if (isFlagged === 'true') query.isFlagged = true;

    if (search) {
      query.$or = [
        { referenceId: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { receiverName: { $regex: search, $options: 'i' } },
        { receiverAccountNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('senderUserId', 'name email')
      .populate('receiverUserId', 'name email');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Flag/Unflag suspicious transaction
// @route   PUT /api/admin/transactions/:id/flag
// @access  Private / Admin
exports.toggleFlagTransaction = async (req, res) => {
  try {
    const { flagReason } = req.body;
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    txn.isFlagged = !txn.isFlagged;
    if (txn.isFlagged && flagReason) txn.flagReason = flagReason;
    if (!txn.isFlagged) txn.flagReason = '';
    await txn.save();

    res.json({
      success: true,
      message: `Transaction ${txn.isFlagged ? 'flagged for audit' : 'cleared from audit'}.`,
      transaction: txn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all loan applications across system
// @route   GET /api/admin/loans
// @access  Private / Admin
exports.getAllLoans = async (req, res) => {
  try {
    const { status, loanType } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (loanType && loanType !== 'all') query.loanType = loanType;

    const loans = await Loan.find(query)
      .populate('userId', 'name email phone avatar kycStatus')
      .populate('accountId', 'accountNumber balance accountType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: loans.length, loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review & Approve/Reject loan application (With Auto-Disbursement!)
// @route   PUT /api/admin/loans/:id/review
// @access  Private / Admin
exports.reviewLoan = async (req, res) => {
  try {
    const { decision, adminComment, customInterestRate } = req.body; // decision: 'approved' | 'rejected'

    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision must be approved or rejected.' });
    }

    const loan = await Loan.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('accountId');

    if (!loan) return res.status(404).json({ success: false, message: 'Loan application not found.' });

    if (loan.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Loan is already in '${loan.status}' state.` });
    }

    loan.adminComment = adminComment || '';

    if (decision === 'rejected') {
      loan.status = 'rejected';
      await loan.save();

      await Notification.create({
        userId: loan.userId._id,
        title: 'Loan Application Decision: Rejected',
        message: `Your application for ${loan.loanType} of ₹${loan.amount.toLocaleString('en-IN')} could not be approved. Reason: ${adminComment || 'Bank underwriting policy criteria.'}`,
        type: 'loan',
      });

      return res.json({ success: true, message: 'Loan application rejected.', loan });
    }

    // DECISION === 'APPROVED' -> Auto Disburse directly into user's account!
    loan.status = 'disbursed';
    loan.approvedDate = new Date();
    loan.disbursedAt = new Date();
    if (customInterestRate) loan.interestRate = Number(customInterestRate);
    await loan.save();

    // Credit user's bank account
    const account = await Account.findById(loan.accountId._id);
    account.balance += loan.amount;
    account.ledgerBalance = account.balance;
    await account.save();

    // Create loan disbursement transaction record
    const refId = `LN${Date.now().toString().slice(-8)}`;
    await Transaction.create({
      referenceId: refId,
      receiverUserId: loan.userId._id,
      receiverAccountId: account._id,
      receiverName: loan.userId.name,
      receiverAccountNumber: account.accountNumber,
      receiverIfsc: account.ifscCode,
      amount: loan.amount,
      type: 'loan_disbursement',
      category: 'Loan',
      direction: 'credit',
      status: 'completed',
      remarks: `Loan Disbursed: ${loan.loanType} (Sanction #${loan._id.toString().slice(-6)})`,
      balanceAfter: account.balance,
      channel: 'Branch',
    });

    // Send congratulatory notification to user
    await Notification.create({
      userId: loan.userId._id,
      title: '🎉 Loan Approved & Disbursed!',
      message: `Congratulations ${loan.userId.name}! Your ${loan.loanType} of ₹${loan.amount.toLocaleString('en-IN')} has been approved and disbursed directly into your A/C ...${account.accountNumber.slice(-4)}. Available balance updated!`,
      type: 'loan',
    });

    res.json({
      success: true,
      message: `Loan approved and ₹${loan.amount.toLocaleString('en-IN')} disbursed into user account!`,
      loan,
      updatedAccountBalance: account.balance,
    });
  } catch (error) {
    console.error('Loan review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cards across the bank
// @route   GET /api/admin/cards
// @access  Private / Admin
exports.getAllCards = async (req, res) => {
  try {
    const { status, cardType } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (cardType && cardType !== 'all') query.cardType = cardType;

    const cards = await Card.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('accountId', 'accountNumber balance')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: cards.length, cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin block/activate card
// @route   PUT /api/admin/cards/:id/status
// @access  Private / Admin
exports.updateCardStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['active', 'frozen', 'blocked', 'requested'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid card status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const card = await Card.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('accountId', 'accountNumber accountType balance');

    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    const oldStatus = card.status;
    if (oldStatus === status) {
      return res.json({ success: true, message: `Card is already ${status}.`, card });
    }

    card.status = status;
    await card.save();

    await Notification.create({
      userId: card.userId._id,
      title: `Card ${status === 'blocked' ? 'Blocked' : status === 'frozen' ? 'Frozen' : status === 'active' ? 'Activated' : 'Updated'}`,
      message: `Your card ending in ${card.cardNumber.slice(-4)} was changed from ${oldStatus} to ${status} by SecureBank administration.`,
      type: 'card',
      metadata: { cardId: card._id, oldStatus, newStatus: status },
    });

    res.json({
      success: true,
      message: `Card status updated to ${status}. Customer notification sent.`,
      card,
    });
  } catch (error) {
    console.error('Admin card status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send broadcast or targeted announcement
// @route   POST /api/admin/broadcast
// @access  Private / Admin
exports.sendBroadcast = async (req, res) => {
  try {
    const { title, message, type = 'system', targetUserId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide notification title and message.' });
    }

    const notification = await Notification.create({
      userId: targetUserId || null, // null means broadcast to all users
      title,
      message,
      type,
    });

    res.status(201).json({
      success: true,
      message: targetUserId
        ? 'Targeted notification dispatched to customer.'
        : 'Broadcast notification published to all bank users.',
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
