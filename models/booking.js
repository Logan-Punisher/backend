const mongoose = require("mongoose");
const numberType = {
  type: Number,
  required: true,
};
const stringType = {
  type: String,
  required: true,
};
const booking = new mongoose.Schema({
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  guestName: stringType,
  phoneNumber: numberType,
  numberOfGuests: numberType,
  startDate: stringType,
  endDate: stringType,
  amount: numberType,
  paidAmount: numberType,
  status: {
    type: String,
    required: true,
    enum: ["wait", "confirm"],
  },
});

const bookingSchema = mongoose.model("booking", booking);
module.exports = bookingSchema;
