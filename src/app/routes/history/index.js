var router = require("express").Router();
var mongoose = require('mongoose');
const { errorProcess, success } = require("services/returnToUser");

router.get('/', async (req, res, next) => {
  try {
    let history = await mongoose.model('history').find({
      belongTo: req.user._id
    }).populate('stocks', "stockSymbol")
    return success(res, "Done", history)
  } catch (err) {
    return errorProcess(res, err)
  }

})

module.exports = router;