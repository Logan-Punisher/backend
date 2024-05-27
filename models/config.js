const mongoose = require('mongoose');
const schemaConfig = new mongoose.Schema({
  type: String,
  coin: Number,
})
module.exports = mongoose.model("config", schemaConfig);