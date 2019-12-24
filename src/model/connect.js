var mongoose = require("mongoose");
var { DATA_COLLECTION } = require("config");
mongoose.connect(`mongodb://localhost:27017/${DATA_COLLECTION}`, {
  useNewUrlParser: true,
  useCreateIndex: true
});
