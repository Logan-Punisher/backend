const mongoose = require("mongoose");
const OwnerModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    password: {
      type: String,
    },
    otp: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Owner = mongoose.model("Owner", OwnerModel);
module.exports = Owner;
