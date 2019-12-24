const mongoose = require("mongoose");
const { errorProcess, success, errorWithMess } = require("services/returnToUser");
const { camelizeKeys } = require("services/convert");
const { getSession } = require("services/getSession");
const _ = require('lodash');

module.exports = router => {
  router.post("/", async (req, res, next) => {
    try {
      req.body = camelizeKeys(req.body);
      const { _id, totalMoney } = req.user;
      const stockUser = req.user.stock;

      var {
        number,
        stock,
        isBuying,
        type,
        purchasePrice,
        tempPrice,
      } = req.body;
      const session = getSession();
      switch (session) {
        case 1:
          if (type == "LO" || type == "ATO") {
          } else {
            return errorWithMess(res, "Loại lệnh không đúng")
          }
          break;
        case 2:
          if (type == "LO" || type == "MP") {
          } else {
            return errorWithMess(res, "Loại lệnh không đúng")
          }
          break;
        case 3:
          if (type == "LO" || type == "ATC") {
          } else {
            return errorWithMess(res, "Loại lệnh không đúng")
          }
          break;
        default:
          return errorWithMess(res, "Loại lệnh không đúng")
      }
      let stockInfo = await mongoose.model("stocks").findById(stock);
      let stockPending = await mongoose.model('history').find({
        isApproved: false,
        belongTo: _id
      });
      let totalMoneyPending = 0;
      await Promise.all(
        stockPending.map(item => {
          if (item.isBuying) {
            totalMoneyPending += (item.purchasePrice * parseInt(item.number))
          }
        })
      )
      if (type != "LO") {
        purchasePrice = stockInfo.matchedPrice;
      }

      if (purchasePrice > stockInfo.ceiling || purchasePrice < stockInfo.floor) {
        return errorWithMess(res, "Giá cổ phiếu bạn đưa ra phải cao hơn sàn, thấp hơn trần");
      }

      // Check user money
      // If tyoe is buying, check money else checl stock user have
      if (isBuying == "true" ? true : false) {
        if (((purchasePrice * parseInt(number)) > (totalMoney - totalMoneyPending)) || tempPrice > (totalMoney - totalMoneyPending)) {
          return errorWithMess(res, "Bạn không đủ tiền để mua cổ phiếu");
        }
      } else {
        let checkStockOfUser = _.filter(stockUser, (o) => { return o.stockId == stock })
        let numberOfStockUserHave = _.isEmpty(checkStockOfUser) ? 0 : checkStockOfUser[0];
        if (numberOfStockUserHave < parseInt(number)) {
          return errorWithMess(res, "Bạn không đủ cổ phiếu để có thể bán");
        }
      }

      let insert = {
        belongTo: _id,
        type,
        isBuying: isBuying == "true" ? true : false,
        stocks: stockInfo._id,
        number,
        purchasePrice,
        tempPrice,
        status: "Chưa khớp",
      };
      var history = await mongoose.model("history").create({ ...insert });
      history = await mongoose.model('history').findById(history._id).populate('stocks', "stockSymbol")
      return success(res, "Done", history);
    } catch (err) {
      return errorProcess(res, err);
      next(err);
    }
  });
};
