var mongoose = require("mongoose");

var stocks = new mongoose.Schema({
  stockSymbol: {
    type: String,
    index: true
  },
  session: {
    type: String,
    index: true
  },
  stockNo: {
    type: String,
    index: true
  },
  updateTime: {
    type: Date,
    default: new Date()
  },
  best1Bid: {
    type: Number
  },
  best1BidVol: {
    type: Number
  },
  best1Offer: {
    type: Number
  },
  best1OfferVol: {
    type: Number
  },
  best2Offer: {
    type: Number
  },
  best2OfferVol: {
    type: Number
  },
  best3Bid: {
    type: Number
  },
  best3BidVol: {
    type: Number
  },
  best3Offer: {
    type: Number
  },
  best3OfferVol: {
    type: Number
  },
  matchedPrice: {
    type: Number
  },
  matchedVolume: {
    type: Number
  },
  priceChange: {
    type: Number
  },
  floor: {
    type: Number
  },
  refPrice: {
    type: Number,
  },
  ceiling: {
    type: Number
  },
  remainForeignQtty: {
    type: String
  }
});

module.exports = stocks;
