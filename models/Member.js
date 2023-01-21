const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MemberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

// Encrypt Password using bcrypt
MemberSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
MemberSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
MemberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Member = mongoose.model('Member', MemberSchema, 'Members');
module.exports = Member;
