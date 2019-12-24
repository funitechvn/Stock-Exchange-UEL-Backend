var cron = require("node-cron");
var { updateDataStock } = require("./socketio");
const { UPGRADE_NUMBER } = require("config/index");
const { checkMatchTradingOnline } = require("services/stocks/matchingOnline");
const { getSession } = require("services/getSession");
const { removeAll } = require("services/stocks/algorithmOnline");
const { fetchDataFromSSI } = require("services/stocks/fetchDataFromSSI");

cron.schedule("*/2 * * * * *", async () => {
  const session = getSession();
  if (session > 0 && session < 4) {
    var stocks = await fetchDataFromSSI();
    updateDataStock(stocks);
    stocks = stocks.map(item => {
      return {
        _id: item._id,
        stockSymbol: item.stockSymbol,
        matchedPrice: item.matchedPrice,
        matchedVolume: item.matchedVolume,
        matchedVolumeOnline: item.matchedVolume * UPGRADE_NUMBER
      };
    });
    checkMatchTradingOnline(stocks, session);
  }
  if (session == 4) {
    console.log("Break time", session);
    await removeAll();
  }
});
