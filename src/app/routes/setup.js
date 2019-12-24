var router = require('express').Router();
var mongoose = require('mongoose');
var { IS_ADMIN } = require("config/index");
var bcrypt = require("bcryptjs");
var { fetchDataFromSSI } = require('services/stocks/fetchDataFromSSI')
router.get("/", async (req, res, next) => {
    let insert = {
      username: "ducnm98",
      password: "123",
      roles: IS_ADMIN,
      fullname: "Quản trị viên"
    };
    const saltRounds = 10;
    bcrypt.hash(insert.password, saltRounds, async (err, hash) => {
      insert.password = hash;
      let usersInfo = await mongoose.model("users").create(insert);
    });
    await fetchDataFromSSI();
    return res.send("Done");
  });
  

module.exports = router