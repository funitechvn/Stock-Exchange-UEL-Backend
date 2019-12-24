const {
  pendingTradingATO,
  pendingTradingLO,
  pendingTradingMP,
  pendingTradingATC,
  removeAll,
} = require("./algorithmOnline");
module.exports = {
  checkMatchTradingOnline: async (stocks, session) => {
    try {
      switch (session) {
        case 1:
          await pendingTradingATO(stocks);
          await pendingTradingLO(stocks);
          break;
        case 2:
          await pendingTradingMP(stocks);
          await pendingTradingLO(stocks);
          break;
        case 3:
          await pendingTradingATC(stocks);
          await pendingTradingLO(stocks);
          break;
        case 4:
          await removeAll();
        default:
          console.log("Break time");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
