const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/  // email format validation
  },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['participant', 'supporter', 'admin'], 
    default: 'participant' 
  },
  supporterType: { 
    type: String, 
    enum: ['employer', 'donor', 'volunteer'], 
    default: null 
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch(error) {
    next(error);
  }
});

// Method to compare passwords securely
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
