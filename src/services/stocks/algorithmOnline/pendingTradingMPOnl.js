const mongoose = require("mongoose");
const _ = require("lodash");
const { updateWaitingTrading } = require("services/socketio");
const { removeStocks, addStocks } = require("services/stocks/changeStockesUser");

const pendingTradingMP = async stocks => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTrading = await mongoose
        .model("history")
        .find({
          isApproved: false,
          type: "MP"
        })
        .sort({ createDate: "desc" });
      await Promise.all(
        pendingTrading.map(async item => {
          const stocksDetail = _.filter(stocks, o => {
            return `${o._id}` == `${item.stocks}`;
          })[0];
          if (item.isBuying) {
            if (item.number >= stocksDetail.matchedVolumeOnline) {
              stocksDetail.matchedVolumeOnline -=
                stocksDetail.matchedVolumeOnline;
              let history = await mongoose
                .model("history")
                .findByIdAndUpdate(item._id, {
                  isApproved: false,
                  matchedPrice: stocksDetail.matchedPrice,
                  number: stocksDetail.matchedVolumeOnline,
                  status: "Đã khớp 1 phần"
                });
              updateWaitingTrading(item.belongTo, history);
              addStocks(item.belongTo, {
                stockId: stocksDetail._id,
                stockSymbol: stocksDetail.stockSymbol,
                number: stocksDetail.matchedVolumeOnline,
                price: stocksDetail.matchedPrice
              });
            } else {
              stocksDetail.matchedVolumeOnline -= item.number;
              let history = await mongoose.model("history").findByIdAndUpdate(
                item._id,
                {
                  isApproved: true,
                  matchedPrice: stocksDetail.matchedPrice,
                  status: "Đã khớp"
                },
                { new: true }
              );
              updateWaitingTrading(item.belongTo, history);
              addStocks(item.belongTo, {
                stockId: stocksDetail._id,
                stockSymbol: stocksDetail.stockSymbol,
                number: item.number,
                price: stocksDetail.matchedPrice
              });
            }
          } else {
            if (item.number <= stocksDetail.matchedVolumeOnline) {
              stocksDetail.matchedVolumeOnline += item.number;
              let history = await mongoose.model("history").findByIdAndUpdate(
                item._id,
                {
                  isApproved: true,
                  matchedPrice: stocksDetail.matchedPrice,
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
        })
      );
      return resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = {
  pendingTradingMP
};
