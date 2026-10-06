const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      minlength: [10, 'Phone number must be at least 10 digits'],
    },
    occupation: {
      type: String,
      trim: true,
      default: 'Salaried Professional',
      minlength: [3, 'Occupation must be at least 3 characters'],
      maxlength: [50, 'Occupation must be at most 50 characters']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    kycStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected'],
      default: 'pending',
    },
    kycDetails: {
      panNumber: { type: String, default: '' },
      aadharMasked: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, default: '400001' },
      dateOfBirth: { type: String, default: '1995-05-15' },
    },
    tPin: {
      type: String, // 4-digit hashed transaction PIN
      default: null,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    securitySettings: {
      twoFactorEnabled: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare T-PIN
userSchema.methods.matchTPin = async function (enteredPin) {
  if (!this.tPin) return false;
  return await bcrypt.compare(enteredPin, this.tPin);
};

module.exports = mongoose.model('User', userSchema);
