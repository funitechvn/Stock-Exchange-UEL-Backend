var mongoose = require('mongoose');

var activeKey = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    index: true
  },
  createDate: {
    type: Date,
    default: new Date()
  },
  activedDate: {
    type: Date,
  },
  actived: {
    type: Boolean,
    default: false
  },
  roles: {
    type: String
  },
  belongTo: {
    type: mongoose.Schema.ObjectId,
    ref: "users"
  }
});

module.exports = activeKey;