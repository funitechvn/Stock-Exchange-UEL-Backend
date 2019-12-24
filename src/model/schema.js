var mongoose = require('mongoose');
var schema = require('./schema/index');

module.exports = {
  users: mongoose.model('users', schema.users),
  stock: mongoose.model('stocks', schema.stock),
  history: mongoose.model('history', schema.history),
  activeKey: mongoose.model('activeKey', schema.activeKey)
}