const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Generate unique Reference ID (e.g., TXN2026090712345)
const generateRefId = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TXN${timestamp}${random}`;
};

// @desc    Transfer money (Intra-Bank, Inter-Bank, UPI, Self)
// @route   POST /api/transactions/transfer
// @access  Private
exports.transferMoney = async (req, res) => {
  try {
    const {
      senderAccountId,
      transferType, // 'intra' | 'neft' | 'rtgs' | 'imps' | 'upi' | 'own'
      receiverAccountNumber,
      receiverIfsc = 'SBIN0001234',
      receiverName,
      receiverUpiId,
      targetAccountId, // for self-transfer
      amount,
      remarks,
      category = 'Transfer',
      tPin,
    } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid transfer amount.' });
    }

    // 1. Verify User & T-PIN
    const user = await User.findById(req.user._id);
    if (user.tPin) {
      if (!tPin) {
        return res.status(400).json({ success: false, message: 'Transaction PIN (T-PIN) is required.' });
      }
      const isPinValid = await user.matchTPin(tPin);
      if (!isPinValid) {
        return res.status(401).json({ success: false, message: 'Invalid 4-digit Transaction PIN.' });
      }
    }

    // 2. Verify Sender Account
    const senderAccount = await Account.findOne({ _id: senderAccountId, userId: user._id });
    if (!senderAccount) {
      return res.status(404).json({ success: false, message: 'Sender account not found.' });
    }

    if (senderAccount.status === 'frozen') {
      return res.status(403).json({ success: false, message: 'Sender account is currently frozen. Cannot transfer.' });
    }

    // 3. Check Balance & Limits
    if (senderAccount.balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Available balance: ₹${senderAccount.balance.toLocaleString('en-IN')}`,
      });
    }

    if (senderAccount.dailyTransferLimit && (senderAccount.usedTodayTransfer + numAmount > senderAccount.dailyTransferLimit)) {
      return res.status(400).json({
        success: false,
        message: `Daily transfer limit of ₹${senderAccount.dailyTransferLimit.toLocaleString('en-IN')} exceeded.`,
      });
    }

    const refId = generateRefId();

    // 4. Handle Transfer by Type
    // Case A: Self-Transfer (Between own accounts)
    if (transferType === 'own') {
      const targetAccount = await Account.findOne({ _id: targetAccountId, userId: user._id });
      if (!targetAccount) {
        return res.status(404).json({ success: false, message: 'Target destination account not found.' });
      }
      if (String(senderAccount._id) === String(targetAccount._id)) {
        return res.status(400).json({ success: false, message: 'Source and destination accounts must be different.' });
      }

      senderAccount.balance -= numAmount;
      senderAccount.ledgerBalance = senderAccount.balance;
      senderAccount.usedTodayTransfer += numAmount;
      await senderAccount.save();

      targetAccount.balance += numAmount;
      targetAccount.ledgerBalance = targetAccount.balance;
      await targetAccount.save();

      const txn = await Transaction.create({
        referenceId: refId,
        senderUserId: user._id,
        senderAccountId: senderAccount._id,
        senderName: user.name,
        receiverUserId: user._id,
        receiverAccountId: targetAccount._id,
        receiverName: `${user.name} (${targetAccount.accountType})`,
        receiverAccountNumber: targetAccount.accountNumber,
        receiverIfsc: targetAccount.ifscCode,
        amount: numAmount,
        type: 'transfer_intra',
        category: 'Transfer',
        direction: 'debit',
        status: 'completed',
        remarks: remarks || `Self transfer to ${targetAccount.accountType}`,
        balanceAfter: senderAccount.balance,
      });

      await Notification.create({
        userId: user._id,
        title: 'Transfer Completed',
        message: `₹${numAmount.toLocaleString('en-IN')} transferred from ${senderAccount.accountType} to ${targetAccount.accountType}.`,
        type: 'transaction',
      });

      return res.json({
        success: true,
        message: 'Self-transfer completed successfully.',
        transaction: txn,
        updatedBalance: senderAccount.balance,
      });
    }

    // Case B: Intra-Bank Transfer (SBI to SBI)
    if (transferType === 'intra') {
      const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
      if (!receiverAccount) {
        return res.status(404).json({
          success: false,
          message: 'Beneficiary account number not found in our system. Verify or use Inter-Bank (NEFT/IMPS).',
        });
      }

      if (String(receiverAccount._id) === String(senderAccount._id)) {
        return res.status(400).json({ success: false, message: 'Cannot transfer to the same source account.' });
      }

      const receiverUser = await User.findById(receiverAccount.userId);

      // Debit sender
      senderAccount.balance -= numAmount;
      senderAccount.ledgerBalance = senderAccount.balance;
      senderAccount.usedTodayTransfer += numAmount;
      await senderAccount.save();

      // Credit receiver
      receiverAccount.balance += numAmount;
      receiverAccount.ledgerBalance = receiverAccount.balance;
      await receiverAccount.save();

      // Sender Transaction Record
      const debitTxn = await Transaction.create({
        referenceId: refId,
        senderUserId: user._id,
        senderAccountId: senderAccount._id,
        senderName: user.name,
        receiverUserId: receiverUser ? receiverUser._id : null,
        receiverAccountId: receiverAccount._id,
        receiverName: receiverUser ? receiverUser.name : receiverName || 'SBI Customer',
        receiverAccountNumber: receiverAccount.accountNumber,
        receiverIfsc: receiverAccount.ifscCode,
        amount: numAmount,
        type: 'transfer_intra',
        category,
        direction: 'debit',
        status: 'completed',
        remarks: remarks || 'Intra-Bank Transfer',
        balanceAfter: senderAccount.balance,
      });

      // Receiver Transaction Record
      await Transaction.create({
        referenceId: refId + '-CR',
        senderUserId: user._id,
        senderAccountId: senderAccount._id,
        senderName: user.name,
        receiverUserId: receiverUser ? receiverUser._id : null,
        receiverAccountId: receiverAccount._id,
        receiverName: receiverUser ? receiverUser.name : receiverName,
        receiverAccountNumber: receiverAccount.accountNumber,
        receiverIfsc: receiverAccount.ifscCode,
        amount: numAmount,
        type: 'transfer_intra',
        category,
        direction: 'credit',
        status: 'completed',
        remarks: `Received from ${user.name}: ${remarks || 'Intra-Bank Transfer'}`,
        balanceAfter: receiverAccount.balance,
      });

      // Notifications
      await Notification.create({
        userId: user._id,
        title: 'Money Sent Successfully',
        message: `₹${numAmount.toLocaleString('en-IN')} debited from A/C ...${senderAccount.accountNumber.slice(-4)} to ${receiverUser?.name || 'SBI Beneficiary'}. Ref: ${refId}.`,
        type: 'transaction',
      });

      if (receiverUser) {
        await Notification.create({
          userId: receiverUser._id,
          title: 'Money Credited',
          message: `₹${numAmount.toLocaleString('en-IN')} credited to A/C ...${receiverAccount.accountNumber.slice(-4)} from ${user.name}. Ref: ${refId}.`,
          type: 'transaction',
        });
      }

      return res.json({
        success: true,
        message: 'Fund transfer executed successfully.',
        transaction: debitTxn,
        updatedBalance: senderAccount.balance,
      });
    }

    // Case C: Inter-Bank (NEFT / RTGS / IMPS) & UPI
    let txnType = 'transfer_neft';
    if (transferType === 'rtgs') txnType = 'transfer_rtgs';
    else if (transferType === 'imps') txnType = 'transfer_imps';
    else if (transferType === 'upi') txnType = 'transfer_upi';

    senderAccount.balance -= numAmount;
    senderAccount.ledgerBalance = senderAccount.balance;
    senderAccount.usedTodayTransfer += numAmount;
    await senderAccount.save();

    const externalTxn = await Transaction.create({
      referenceId: refId,
      senderUserId: user._id,
      senderAccountId: senderAccount._id,
      senderName: user.name,
      receiverName: receiverName || receiverUpiId || 'External Payee',
      receiverAccountNumber: receiverAccountNumber || receiverUpiId,
      receiverIfsc: receiverIfsc || 'EXTERNAL',
      amount: numAmount,
      type: txnType,
      category,
      direction: 'debit',
      status: 'completed',
      remarks: remarks || `${txnType.toUpperCase()} Transfer`,
      balanceAfter: senderAccount.balance,
    });

    await Notification.create({
      userId: user._id,
      title: `${txnType.toUpperCase()} Transfer Sent`,
      message: `₹${numAmount.toLocaleString('en-IN')} debited from A/C ...${senderAccount.accountNumber.slice(-4)} to ${receiverName || receiverUpiId}. Ref: ${refId}.`,
      type: 'transaction',
    });

    return res.json({
      success: true,
      message: `${txnType.toUpperCase()} transfer executed successfully.`,
      transaction: externalTxn,
      updatedBalance: senderAccount.balance,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: error.message || 'Transfer failed.' });
  }
};

// @desc    Get transactions of current user
// @route   GET /api/transactions
// @access  Private
exports.getMyTransactions = async (req, res) => {
  try {
    const { type, direction, category, search, page = 1, limit = 20 } = req.query;

    const userAccounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = userAccounts.map((a) => a._id);

    const query = {
      $or: [{ senderUserId: req.user._id }, { receiverUserId: req.user._id }, { senderAccountId: { $in: accountIds } }, { receiverAccountId: { $in: accountIds } }],
    };

    if (direction && direction !== 'all') {
      query.direction = direction;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { referenceId: { $regex: search, $options: 'i' } },
        { receiverName: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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

// @desc    Get single transaction receipt
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    res.json({ success: true, transaction: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user spending analytics for charts
// @route   GET /api/transactions/analytics
// @access  Private
exports.getSpendingAnalytics = async (req, res) => {
  try {
    const userAccounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = userAccounts.map((a) => a._id);

    const transactions = await Transaction.find({
      $or: [{ senderUserId: req.user._id }, { senderAccountId: { $in: accountIds } }],
      direction: 'debit',
    });

    // Group by category
    const categoryTotals = {
      'Transfer': 0,
      'Bills & Utilities': 0,
      'Shopping': 0,
      'Food & Dining': 0,
      'Entertainment': 0,
      'Investments': 0,
      'Other': 0,
    };

    transactions.forEach((t) => {
      const cat = categoryTotals[t.category] !== undefined ? t.category : 'Other';
      categoryTotals[cat] += t.amount;
    });

    // Last 6 months cashflow (Credit vs Debit)
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const monthlyDebits = [24500, 18200, 32400, 21900, 28500, 14200];
    const monthlyCredits = [65000, 65000, 72000, 65000, 68000, 65000];

    res.json({
      success: true,
      categoryAnalytics: categoryTotals,
      cashflow: {
        months,
        debits: monthlyDebits,
        credits: monthlyCredits,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved beneficiaries
// @route   GET /api/transactions/beneficiaries
// @access  Private
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: beneficiaries.length, beneficiaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new beneficiary
// @route   POST /api/transactions/beneficiaries
// @access  Private
exports.addBeneficiary = async (req, res) => {
  try {
    const { name, accountNumber, bankName, ifscCode, transferType, upiId, nickname } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Beneficiary name is required.' });
    }

    const beneficiary = await Beneficiary.create({
      userId: req.user._id,
      name,
      accountNumber: accountNumber || '',
      bankName: bankName || 'State Bank of India',
      ifscCode: ifscCode || 'SBIN0001234',
      transferType: transferType || 'Intra-Bank',
      upiId: upiId || '',
      nickname: nickname || name,
    });

    res.status(201).json({ success: true, message: 'Beneficiary added successfully.', beneficiary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete beneficiary
// @route   DELETE /api/transactions/beneficiaries/:id
// @access  Private
exports.deleteBeneficiary = async (req, res) => {
  try {
    await Beneficiary.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Beneficiary removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
