const mongoose = require('mongoose');

const UserPropertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  propId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "property",
  },
});

module.exports = mongoose.model('UserProperty', UserPropertySchema);
