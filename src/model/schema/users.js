var mongoose = require("mongoose");

var users = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    index: true
  },
  password: {
    required: true,
    type: String,
  },
  roles: [
    {
      type: String,
    },
  ],
  fullname: {
    required: true,
    type: String,
  },
  totalMoney: {
    type: String,
    required: true,
    default: "5000000000",
  },
  stock: [
    {
      stockId: {
        type: mongoose.Schema.ObjectId,
        ref: "stocks",
        index: true
      },
      stockSymbol: {
        type: String,
      },
      number: {
        type: Number,
      },
      price: {
        type: String,
      },
    },
  ],
  activeKeyId: {
    type: mongoose.Schema.ObjectId,
    ref: "activeKey"
  }
});

module.exports = users;
