const mongoose = require("mongoose");

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
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minlength: [8, "Please choose a valid passowrd"],
  },
  age: {
    type: Number,
    min: [15, "Please provide valid age"]
  },
  phone: {
    type: Number,
    unique: true,
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
});

const User = mongoose.model("users", userSchema);
module.exports = User;
