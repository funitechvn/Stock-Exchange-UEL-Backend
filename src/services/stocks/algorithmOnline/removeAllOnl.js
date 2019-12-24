const mongoose = require("mongoose");
const _ = require("lodash");

const removeAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pendingTrading = await mongoose.model("history").find({
        isApproved: false
      });
      if (!_.isEmpty(pendingTrading)) {
        pendingTrading.map(async item => {
          await mongoose.model("history").findByIdAndDelete(item._id);
        });
      }
      return resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
};
module.exports = {
  removeAll
};
