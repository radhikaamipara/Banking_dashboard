const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const Loan = require('../models/Loan');
const Beneficiary = require('../models/Beneficiary');
const Notification = require('../models/Notification');
const ContactInquiry = require('../models/ContactInquiry');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yono_banking';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Account.deleteMany();
    await Transaction.deleteMany();
    await Card.deleteMany();
    await Loan.deleteMany();
    await Beneficiary.deleteMany();
    await Notification.deleteMany();
    await ContactInquiry.deleteMany();
    console.log('[Seed] Cleared existing collections.');

    // Passwords & PIN
    // User model pre('save') automatically hashes plain text passwords, so pass plain text here:
    const passwordUser = 'User@123';
    const passwordAdmin = 'Admin@123';
    const tPinHash = await bcrypt.hash('1234', 10);

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'SBI Chief Administrator',
      email: 'admin@sbi.com',
      password: passwordAdmin,
      phone: '+91 98200 11223',
      role: 'admin',
      status: 'active',
      kycStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      tPin: tPinHash,
    });

    // Admin Central Treasury Reserve Account
    await Account.create({
      userId: adminUser._id,
      accountNumber: '30900000001',
      accountType: 'Current',
      balance: 100000000,
      ledgerBalance: 100000000,
      ifscCode: 'SBIN0000001',
      branch: 'State Bank Bhavan, Corporate Centre, Mumbai',
      isPrimary: true,
      interestRate: 0,
      nomineeName: 'State Bank of India Treasury',
    });
    console.log('[Seed] Created Admin: admin@sbi.com / Admin@123');

    // 2. Create User 1: Rahul Sharma
    const userRahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: passwordUser,
      phone: '+91 98765 43210',
      role: 'user',
      status: 'active',
      kycStatus: 'verified',
      kycDetails: {
        panNumber: 'ABCPS1234F',
        aadharMasked: 'XXXXXXXX7894',
        address: 'Flat 402, Sea View Towers, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      tPin: tPinHash,
    });

    // Rahul's Savings Account
    const rahulSavings = await Account.create({
      userId: userRahul._id,
      accountNumber: '30918274619',
      accountType: 'Savings',
      balance: 148500,
      ledgerBalance: 148500,
      ifscCode: 'SBIN0001234',
      branch: 'Nariman Point, Mumbai',
      isPrimary: true,
      interestRate: 3.5,
      nomineeName: 'Anita Sharma (Wife)',
    });

    // Rahul's Fixed Deposit
    const rahulFD = await Account.create({
      userId: userRahul._id,
      accountNumber: '30955182931',
      accountType: 'Fixed Deposit',
      balance: 250000,
      ledgerBalance: 250000,
      ifscCode: 'SBIN0001234',
      branch: 'Nariman Point, Mumbai',
      isPrimary: false,
      interestRate: 7.1,
      nomineeName: 'Anita Sharma (Wife)',
    });

    // 3. Create User 2: Priya Patel
    const userPriya = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: passwordUser,
      phone: '+91 98111 22334',
      role: 'user',
      status: 'active',
      kycStatus: 'verified',
      kycDetails: {
        panNumber: 'BKRPA9876K',
        aadharMasked: 'XXXXXXXX3412',
        address: 'B-12, Green Park Avenue',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
      },
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      tPin: tPinHash,
    });

    const priyaSavings = await Account.create({
      userId: userPriya._id,
      accountNumber: '30988716254',
      accountType: 'Savings',
      balance: 82300,
      ledgerBalance: 82300,
      ifscCode: 'SBIN0001234',
      branch: 'Shivaji Nagar, Pune',
      isPrimary: true,
      interestRate: 3.5,
    });

    // 4. Create User 3: Amit Kumar (For admin KYC & loan approval testing)
    const userAmit = await User.create({
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      password: passwordUser,
      phone: '+91 97654 32109',
      role: 'user',
      status: 'active',
      kycStatus: 'pending', // Pending KYC for admin testing!
      kycDetails: {
        panNumber: 'CPXAK5544L',
        aadharMasked: 'XXXXXXXX9988',
        address: 'Plot 77, Sector 18',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
      },
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      tPin: tPinHash,
    });

    const amitSavings = await Account.create({
      userId: userAmit._id,
      accountNumber: '30944192837',
      accountType: 'Savings',
      balance: 35000,
      ledgerBalance: 35000,
      ifscCode: 'SBIN0004567',
      branch: 'Sector 18, Noida',
      isPrimary: true,
      interestRate: 3.5,
    });

    // Cards for Rahul
    await Card.create({
      userId: userRahul._id,
      accountId: rahulSavings._id,
      cardNumber: '4591 8820 3419 7291',
      cardHolderName: 'RAHUL SHARMA',
      cardType: 'Debit',
      network: 'Visa Platinum',
      variant: 'Platinum',
      expiryMonth: '08',
      expiryYear: '2029',
      cvv: '624',
      status: 'active',
      dailyAtmLimit: 50000,
      dailyOnlineLimit: 100000,
      internationalEnabled: true,
      onlineEnabled: true,
      contactlessEnabled: true,
    });

    await Card.create({
      userId: userRahul._id,
      accountId: rahulSavings._id,
      cardNumber: '6071 9912 4581 3302',
      cardHolderName: 'RAHUL SHARMA',
      cardType: 'Credit',
      network: 'RuPay Global',
      variant: 'Signature',
      expiryMonth: '11',
      expiryYear: '2028',
      cvv: '819',
      status: 'active',
      dailyAtmLimit: 25000,
      dailyOnlineLimit: 150000,
      internationalEnabled: false,
      onlineEnabled: true,
      contactlessEnabled: true,
    });

    // Card for Priya
    await Card.create({
      userId: userPriya._id,
      accountId: priyaSavings._id,
      cardNumber: '5243 1182 9940 4521',
      cardHolderName: 'PRIYA PATEL',
      cardType: 'Debit',
      network: 'Mastercard World',
      variant: 'Platinum',
      expiryMonth: '04',
      expiryYear: '2029',
      cvv: '452',
      status: 'active',
    });

    // Card for Amit
    await Card.create({
      userId: userAmit._id,
      accountId: amitSavings._id,
      cardNumber: '4591 3341 7890 1205',
      cardHolderName: 'AMIT KUMAR',
      cardType: 'Debit',
      network: 'Visa Platinum',
      variant: 'Classic',
      expiryMonth: '10',
      expiryYear: '2029',
      cvv: '198',
      status: 'active',
    });

    // Beneficiaries for Rahul
    await Beneficiary.create({
      userId: userRahul._id,
      name: 'Priya Patel',
      accountNumber: priyaSavings.accountNumber,
      bankName: 'State Bank of India',
      ifscCode: priyaSavings.ifscCode,
      transferType: 'Intra-Bank',
      nickname: 'Priya SBI',
    });

    await Beneficiary.create({
      userId: userRahul._id,
      name: 'Amit Kumar',
      accountNumber: amitSavings.accountNumber,
      bankName: 'State Bank of India',
      ifscCode: amitSavings.ifscCode,
      transferType: 'Intra-Bank',
      nickname: 'Amit Noida',
    });

    await Beneficiary.create({
      userId: userRahul._id,
      name: 'Electricity Distribution Board',
      accountNumber: '998812349911',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      transferType: 'Inter-Bank',
      nickname: 'Torrent Power',
    });

    // Active Loan for Rahul (Personal Loan)
    await Loan.create({
      userId: userRahul._id,
      accountId: rahulSavings._id,
      loanType: 'Personal Loan',
      amount: 300000,
      interestRate: 10.5,
      tenureMonths: 24,
      monthlyEmi: 13915,
      totalRepayment: 333960,
      outstandingAmount: 222640,
      paidAmount: 111320,
      emisPaidCount: 8,
      status: 'disbursed',
      purpose: 'Home renovation and interior work',
      employmentType: 'Salaried',
      monthlyIncome: 95000,
      adminComment: 'Income verified, CIBIL score 785. Approved.',
      disbursedAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
    });

    // PENDING Car Loan for Amit (ready for Admin to approve!)
    await Loan.create({
      userId: userAmit._id,
      accountId: amitSavings._id,
      loanType: 'Car Loan',
      amount: 650000,
      interestRate: 8.75,
      tenureMonths: 60,
      monthlyEmi: 13410,
      totalRepayment: 804600,
      outstandingAmount: 804600,
      paidAmount: 0,
      emisPaidCount: 0,
      status: 'pending', // PENDING for Admin evaluation!
      purpose: 'Purchase of Hyundai Creta EV',
      employmentType: 'Salaried',
      monthlyIncome: 75000,
      adminComment: 'Awaiting KYC clearance and final sanction.',
    });

    // Transactions for Rahul
    const txns = [
      {
        referenceId: 'TXN20260901001',
        senderName: 'Tata Consultancy Services Ltd',
        receiverUserId: userRahul._id,
        receiverAccountId: rahulSavings._id,
        receiverName: 'Rahul Sharma',
        receiverAccountNumber: rahulSavings.accountNumber,
        receiverIfsc: rahulSavings.ifscCode,
        amount: 95000,
        type: 'deposit',
        category: 'Salary',
        direction: 'credit',
        status: 'completed',
        remarks: 'Salary for August 2026',
        balanceAfter: 172415,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        referenceId: 'TXN20260902002',
        senderUserId: userRahul._id,
        senderAccountId: rahulSavings._id,
        senderName: 'Rahul Sharma',
        receiverName: 'YONO Loans Dept',
        amount: 13915,
        type: 'loan_repayment',
        category: 'Loan',
        direction: 'debit',
        status: 'completed',
        remarks: 'Personal Loan Auto-Debit EMI #8',
        balanceAfter: 158500,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        referenceId: 'TXN20260903003',
        senderUserId: userRahul._id,
        senderAccountId: rahulSavings._id,
        senderName: 'Rahul Sharma',
        receiverUserId: userPriya._id,
        receiverAccountId: priyaSavings._id,
        receiverName: 'Priya Patel',
        receiverAccountNumber: priyaSavings.accountNumber,
        receiverIfsc: priyaSavings.ifscCode,
        amount: 5000,
        type: 'transfer_intra',
        category: 'Transfer',
        direction: 'debit',
        status: 'completed',
        remarks: 'Shared dinner & movie tickets',
        balanceAfter: 153500,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        referenceId: 'TXN20260904004',
        senderUserId: userRahul._id,
        senderAccountId: rahulSavings._id,
        senderName: 'Rahul Sharma',
        receiverName: 'Nature Basket Gourmet Supermarket',
        amount: 3200,
        type: 'card_payment',
        category: 'Food & Dining',
        direction: 'debit',
        status: 'completed',
        remarks: 'Grocery & organic produce POS',
        balanceAfter: 150300,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        referenceId: 'TXN20260905005',
        senderUserId: userRahul._id,
        senderAccountId: rahulSavings._id,
        senderName: 'Rahul Sharma',
        receiverName: 'Reliance Jio Infocomm',
        amount: 1800,
        type: 'transfer_upi',
        category: 'Bills & Utilities',
        direction: 'debit',
        status: 'completed',
        remarks: 'Fiber broadband annual renewal',
        balanceAfter: 148500,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const t of txns) {
      await Transaction.create(t);
    }

    // Notifications for Rahul
    await Notification.create({
      userId: userRahul._id,
      title: 'Salary Credited',
      message: '₹95,000 has been credited to A/C ...4619 from TCS Ltd. Available balance updated.',
      type: 'transaction',
    });

    await Notification.create({
      userId: userRahul._id,
      title: 'EMI Deduction Successful',
      message: '₹13,915 debited for Personal Loan EMI installment. Outstanding balance: ₹2,22,640.',
      type: 'loan',
    });

    // Broadcast notification from bank
    await Notification.create({
      userId: null, // Broadcast to all!
      title: 'Special Festive Fixed Deposit Offer',
      message: 'Invest in SBI Amrit Kalash 400 Days Deposit at 7.6% APY for Senior Citizens and 7.1% for Regular Customers.',
      type: 'system',
    });

    // Contact Us inquiries for Admin review
    await ContactInquiry.create({
      name: 'Vikas Mehra',
      email: 'vikas.m@example.com',
      phone: '+91 99880 12345',
      subject: 'Inquiry regarding NRI Home Loan rates',
      message: 'I am an NRI residing in Dubai and wish to purchase an apartment in Mumbai. What are the current tenure and interest rates?',
      status: 'new',
    });

    await ContactInquiry.create({
      name: 'Meenakshi Iyer',
      email: 'meenakshi@example.com',
      phone: '+91 98450 67890',
      subject: 'International Card transaction limit expansion',
      message: 'I am travelling overseas next week and would like to understand how to increase my international POS limits on RuPay Global.',
      status: 'in_progress',
      replyNotes: 'Customer contacted on 06 Sep, explained via YONO Cards settings.',
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:');
    console.log('   Email: admin@sbi.com');
    console.log('   Password: Admin@123');
    console.log('');
    console.log('Customer Account 1 (Rahul Sharma):');
    console.log('   Email: rahul.sharma@example.com');
    console.log('   Password: User@123');
    console.log('   T-PIN: 1234');
    console.log('   A/C: 30918274619 (₹1,48,500)');
    console.log('');
    console.log('Customer Account 2 (Priya Patel):');
    console.log('   Email: priya.patel@example.com');
    console.log('   Password: User@123');
    console.log('   T-PIN: 1234');
    console.log('   A/C: 30988716254 (₹82,300)');
    console.log('');
    console.log('Customer Account 3 (Amit Kumar - Pending KYC & Car Loan):');
    console.log('   Email: amit.kumar@example.com');
    console.log('   Password: User@123');
    console.log('   T-PIN: 1234');
    console.log('   A/C: 30944192837 (₹35,000)');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
