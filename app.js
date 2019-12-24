var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var config = require("config");
var cors = require('cors')
var { camelizeKeys } = require('services/convert')
require("model/connect");
require("model/schema");
require("services/autoUpdateStock");
require('dotenv').config();
var app = express();
app.use(cors());
app.use((req, res, next) => {
  req.body = camelizeKeys(req.body);
  next();
})
app.set("topSecretKey", config.SECRET);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "src", "app", "public"), {
    maxAge: "30 days",
    dotfiles: "allow",
  })
);
app.set("Cache-Control", "max-age=3000");

app.use(session(config.SESSION));
if (process.env.IS_DEV != "DEV" || process.env.IS_DEV == "undefined") {
  app.disable("/setup");
} else {
  app.use("/setup", require("app/routes/setup"));
}

app.use("/", require("app/routes"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render("error");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
