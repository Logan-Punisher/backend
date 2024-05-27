const mongoose = require("mongoose");
const UserModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: Number,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    wallet_balance: {
      type: Number,
    },
    otp: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserModel);
module.exports = User;
