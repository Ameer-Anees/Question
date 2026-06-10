const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  mobile: String,
  language: String,
  verified: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);