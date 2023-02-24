const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please choose a username"],
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: [validator.isEmail, "Please provide valid email"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minlength: [8, "Please choose a valid password"],
  },
  age: {
    type: Number,
    min: [15, "Please provide valid age"]
  },
  phone: {
    type: String,
    unique: true,
    validate: [validator.isMobilePhone, "Please provide valid mobile number."]
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  college: {
    type: String,
    minlength: [10, "Please provide a college name"],
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    default: "user"
  },
  interests: [
    { type: String }
  ],
  reputation: {
    type: Number,
  },
  asked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
    }
  ],
  answered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

  return resetToken;
}

const User = mongoose.model("users", userSchema);
module.exports = User;
