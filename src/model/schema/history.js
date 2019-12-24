var mongoose = require("mongoose");

var history = new mongoose.Schema({
  belongTo: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  },
  isBuying: {
    type: Boolean,
    default: false,
    index: true
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
  stocks: {
    type: mongoose.Schema.ObjectId,
    ref: "stocks",
    index: true
  },
  number: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
  },
  matchedPrice: {
    type: Number,
  },
  tempPrice: {
    type: Number
  },
  status: {
    type: String,
  },
});

module.exports = history;
