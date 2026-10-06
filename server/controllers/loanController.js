const Loan = require('../models/Loan');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Calculate Monthly EMI
const calculateEmiHelper = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / (12 * 100);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

// @desc    Calculate EMI preview
// @route   POST /api/loans/calculate
// @access  Public / Private
exports.calculateEmi = async (req, res) => {
  try {
    const { amount, interestRate = 8.5, tenureMonths } = req.body;
    const P = Number(amount);
    const R = Number(interestRate);
    const N = Number(tenureMonths);

    if (!P || !N) {
      return res.status(400).json({ success: false, message: 'Please provide amount and tenure months.' });
    }

    const emi = calculateEmiHelper(P, R, N);
    const totalRepayment = emi * N;
    const totalInterest = totalRepayment - P;

    res.json({
      success: true,
      amount: P,
      interestRate: R,
      tenureMonths: N,
      monthlyEmi: emi,
      totalRepayment,
      totalInterest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a new loan
// @route   POST /api/loans/apply
// @access  Private
exports.applyLoan = async (req, res) => {
  try {
    const { loanType, amount, tenureMonths, purpose, employmentType, monthlyIncome, accountId } = req.body;

    const numAmount = Number(amount);
    const numTenure = Number(tenureMonths);

    if (!loanType || !numAmount || !numTenure) {
      return res.status(400).json({ success: false, message: 'Please fill in all required loan details.' });
    }

    // Default interest rates by loan product
    let interestRate = 8.5;
    if (loanType === 'Home Loan') interestRate = 8.4;
    else if (loanType === 'Car Loan') interestRate = 8.75;
    else if (loanType === 'Education Loan') interestRate = 7.9;
    else if (loanType === 'Personal Loan') interestRate = 10.5;

    // Find linked account
    let account;
    if (accountId) {
      account = await Account.findOne({ _id: accountId, userId: req.user._id });
    }
    if (!account) {
      account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    }
    if (!account) {
      return res.status(400).json({ success: false, message: 'No active bank account found to link loan.' });
    }

    const monthlyEmi = calculateEmiHelper(numAmount, interestRate, numTenure);
    const totalRepayment = monthlyEmi * numTenure;

    const loan = await Loan.create({
      userId: req.user._id,
      accountId: account._id,
      loanType,
      amount: numAmount,
      interestRate,
      tenureMonths: numTenure,
      monthlyEmi,
      totalRepayment,
      outstandingAmount: totalRepayment,
      purpose: purpose || 'Personal Need',
      employmentType: employmentType || 'Salaried',
      monthlyIncome: Number(monthlyIncome) || 50000,
      status: 'pending',
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Loan Application Submitted',
      message: `Your application for ${loanType} of ₹${numAmount.toLocaleString('en-IN')} has been submitted for branch approval. Application ID: ${loan._id}`,
      type: 'loan',
    });

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully. Pending Admin approval.',
      loan,
    });
  } catch (error) {
    console.error('Loan apply error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's loans
// @route   GET /api/loans
// @access  Private
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id })
      .populate('accountId', 'accountNumber accountType')
      .sort({ createdAt: -1 });

    const totalBorrowed = loans
      .filter((l) => l.status === 'disbursed' || l.status === 'approved')
      .reduce((sum, l) => sum + l.amount, 0);

    const totalOutstanding = loans
      .filter((l) => l.status === 'disbursed' || l.status === 'approved')
      .reduce((sum, l) => sum + l.outstandingAmount, 0);

    res.json({
      success: true,
      count: loans.length,
      totalBorrowed,
      totalOutstanding,
      loans,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pay Monthly EMI
// @route   POST /api/loans/:id/pay-emi
// @access  Private
exports.payEmi = async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan account not found.' });
    }

    if (loan.status !== 'disbursed' && loan.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'This loan is not active for repayments.' });
    }

    if (loan.outstandingAmount <= 0) {
      return res.status(400).json({ success: false, message: 'This loan has already been fully paid off!' });
    }

    const account = await Account.findById(loan.accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Linked repayment account not found.' });
    }

    const emiAmount = Math.min(loan.monthlyEmi, loan.outstandingAmount);

    if (account.balance < emiAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance (₹${account.balance.toLocaleString('en-IN')}) to pay EMI of ₹${emiAmount.toLocaleString('en-IN')}.`,
      });
    }

    // Deduct from user account
    account.balance -= emiAmount;
    account.ledgerBalance = account.balance;
    await account.save();

    // Update loan details
    loan.outstandingAmount -= emiAmount;
    loan.paidAmount += emiAmount;
    loan.emisPaidCount += 1;
    if (loan.outstandingAmount <= 0) {
      loan.status = 'closed';
      loan.outstandingAmount = 0;
    }
    await loan.save();

    // Record Transaction
    const refId = `EMI${Date.now().toString().slice(-8)}`;
    await Transaction.create({
      referenceId: refId,
      senderUserId: req.user._id,
      senderAccountId: account._id,
      senderName: req.user.name,
      receiverName: `YONO Loans Department (${loan.loanType})`,
      amount: emiAmount,
      type: 'loan_repayment',
      category: 'Loan',
      direction: 'debit',
      status: 'completed',
      remarks: `EMI Installment #${loan.emisPaidCount} for ${loan.loanType}`,
      balanceAfter: account.balance,
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Loan EMI Paid',
      message: `EMI of ₹${emiAmount.toLocaleString('en-IN')} paid for ${loan.loanType}. Outstanding: ₹${loan.outstandingAmount.toLocaleString('en-IN')}.`,
      type: 'loan',
    });

    res.json({
      success: true,
      message: 'EMI installment paid successfully.',
      loan,
      updatedBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
