const { timeStamp } = require("console");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    propId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;
