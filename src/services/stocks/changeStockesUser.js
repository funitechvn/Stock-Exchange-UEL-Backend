const mongoose = require('mongoose');
const { updateUserInfo } = require('services/socketio');
const _ = require('lodash');

module.exports = {
  removeStocks: async (userId, data) => {
    const userInfo = await mongoose.model('users').findById(userId);
    const { stock } = userInfo;
    const { number, price, stockId } = data;
    let checkStockOfUser = _.filter(stock, (o) => {  return `${o.stockId}` == `${stockId}` });
    let currentStockInfo = checkStockOfUser[0];
    let query = {
      _id: userId,
      stock: {
        $elemMatch: {
          _id: currentStockInfo._id
        }
      }
    }
    if (currentStockInfo.number == number) {
      let user = await mongoose.model('users').findOneAndUpdate(query, {
        totalMoney: parseFloat(userInfo.totalMoney) + price * number,
        $pull: {
          stock: {
            stockId: currentStockInfo.stockId
          }
        }
      }, { new: true })
      user['password'] = null;
      updateUserInfo(user._id, user)
    } else {
      let user = await mongoose.model('users').findOneAndUpdate(query, {
        totalMoney: parseFloat(userInfo.totalMoney) + price * number,
        $set: {
          "stock.$.number": currentStockInfo.number - number,
          "stock.$.price": (currentStockInfo.price * currentStockInfo.number + price * number) / (number + currentStockInfo.number) 
        }
      }, { new: true })
      user['password'] = null;
      updateUserInfo(user._id, user)
    }
  },
  addStocks: async (userId, data) => {
    const userInfo = await mongoose.model('users').findById(userId);
    const { stock } = userInfo;
    const { number, price, stockId, stockSymbol } = data;
    // Get stock with match with stock Id
    
    let checkStockOfUser = _.filter(stock, (o) => { console.log(o); return `${o.stockId}` == `${stockId}` })
    
    // If stock of user is empty, insert to user
    if (_.isEmpty(checkStockOfUser)) {
      let user = await mongoose.model('users').findByIdAndUpdate(userId, {
        totalMoney: parseFloat(userInfo.totalMoney) - price * number,
        $push: {
          stock: {
            ...data
          }
        }
      }, { new: true })
      user['password'] = null;
      updateUserInfo(user._id, user)
    } else {
      // If not, avergate them
      let currentStockInfo = checkStockOfUser[0];
      let query = {
        _id: userId,
        stock: {
          $elemMatch: {
            _id: currentStockInfo._id
          }
        }
      }
      let user = await mongoose.model('users').findOneAndUpdate(query, {
        totalMoney: parseFloat(userInfo.totalMoney) - price * number,
        $set: {
          "stock.$.number": currentStockInfo.number + number,
          "stock.$.price": (currentStockInfo.price * currentStockInfo.number + price * number) / (number + currentStockInfo.number) 
        }
      }, { new: true })
      user['password'] = null;
      updateUserInfo(user._id, user)
    }
  }
}