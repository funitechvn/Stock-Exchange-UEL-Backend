var router = require("express").Router();
var mongoose = require("mongoose");
var { success, errorProcess} = require('services/returnToUser')
router.get("/", async (req, res, next) => {
  try {
    let stocks = await mongoose
      .model("stocks")
      .find()
      .select(["_id", "stockSymbol", "matchedPrice"]);
    let historySell = await mongoose.model('history').find({
      belongTo: req.user._id,
      isApproved: false,
      isBuying: false
    }).populate('stocks', "stockSymbol")
    let historyBuy = await mongoose.model('history').find({
      belongTo: req.user._id,
      isApproved: false,
      isBuying: true
    }).populate('stocks', "stockSymbol")
    let totalStock = 0;
    req.user.stock.map(item => {
      totalStock += item.number;
    });
    return success(res, "Done", {
      stocks,
      totalStock,
      history: {
        buy: historyBuy,
        sell: historySell
      },
      user: req.user
    })
  } catch (err) {
    return errorProcess(res, err)
  }
});

module.exports = router;
