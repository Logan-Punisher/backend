const mongoose = require("mongoose");
const newTransaction = new mongoose.Schema(
  {
    // coins: {
    //   type: Number,
    //   required: true,
    // },
    transactionType: {
      type: String,
      required: true,
    },
    type: {
      enum: ["debit", "credit"],
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const transactionSchema = mongoose.model("transaction", newTransaction);
module.exports = transactionSchema;
//userID+propID+coin+type
