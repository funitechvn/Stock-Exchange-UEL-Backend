const mongoose = require("mongoose");
const _ = require("lodash");
const { updateWaitingTrading } = require("services/socketio");
const { removeStocks, addStocks } = require("services/stocks/changeStockesUser");
var { camelizeKeys } = require("services/convert");

const pendingTradingLO = async stocks => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTrading = await mongoose
        .model("history")
        .find({
          isApproved: false,
          type: "LO"
        })
        .sort({ createDate: "desc" });
      await Promise.all(
        pendingTrading.map(async item => {
          const stocksDetail = _.filter(stocks, o => {
            return `${o._id}` == `${item.stocks}`;
          })[0];
          if (item.isBuying) {
            let isBetter = item.purchasePrice > stocksDetail.matchedPrice;
            let purchasePriceForThis = isBetter
              ? item.purchasePrice
              : stocksDetail.matchedPrice;
            if (item.purchasePrice >= stocksDetail.matchedPrice) {
              if (item.number >= stocksDetail.matchedVolumeOnline) {
                stocksDetail.matchedVolumeOnline -=
                  stocksDetail.matchedVolumeOnline;
                let history = await mongoose.model("history").create({
                  ...camelizeKeys(item),
                  number: item.number - stocksDetail.matchedVolumeOnline
                });
                updateWaitingTrading(item.belongTo, history);
                history = await mongoose.model("history").findByIdAndUpdate(
                  item._id,
                  {
                    isApproved: true,
                    matchedPrice: purchasePriceForThis,
                    number: stocksDetail.matchedVolumeOnline
                  },
                  { new: true }
                );
                updateWaitingTrading(item.belongTo, history);
                addStocks(item.belongTo, {
                  stockId: stocksDetail._id,
                  stockSymbol: stocksDetail.stockSymbol,
                  number: stocksDetail.matchedVolumeOnline,
                  price: purchasePriceForThis
                });
              } else {
                stocksDetail.matchedVolumeOnline -= item.number;
                let history = await mongoose
                  .model("history")
                  .findByIdAndUpdate(item._id, {
                    isApproved: true,
                    matchedPrice: stocksDetail.matchedPrice
                  });
                updateWaitingTrading(item.belongTo, history);
                addStocks(item.belongTo, {
                  stockId: stocksDetail._id,
                  stockSymbol: stocksDetail.stockSymbol,
                  number: item.number,
                  price: purchasePriceForThis
                });
              }
            }
          } else {
            let isBetter = item.purchasePrice < stocksDetail.matchedPrice;
            let purchasePriceForThis = isBetter
              ? item.purchasePrice
              : stocksDetail.matchedPrice;
            if (item.purchasePrice >= stocksDetail.matchedPrice) {
              if (item.number <= stocksDetail.matchedVolumeOnline) {
                stocksDetail.matchedVolumeOnline += item.number;
                let history = await mongoose.model("history").findByIdAndUpdate(
                  item._id,
                  {
                    isApproved: true,
                    matchedPrice: purchasePriceForThis,
                    status: "Đã khớp"
                  },
                  { new: true }
                );
                updateWaitingTrading(item.belongTo, history);
                removeStocks(item.belongTo, {
                  stockId: stocksDetail._id,
                  number: item.number,
                  price: stocksDetail.matchedPrice
                });
              }
            }
          }
        })
      );
      return resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = {
  pendingTradingLO
};
