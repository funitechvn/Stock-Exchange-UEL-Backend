var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
var config = require("config/index");
var router = require("express").Router();
const { errorProcess } = require("services/returnToUser");

router.post("/", async (req, res, next) => {
  try {
    let query = {
      username: req.body.username,
    };
    let userInfo = await mongoose.model("users").findOne(query)

    if (userInfo) {

      let isMatch = await bcryptjs.compareSync(req.body.password, userInfo.password)
      if (isMatch) {
        // if user is found and password is right
        // crate a token with only our given payload
        let payload = {
          _id: userInfo._id,
        };
        // Create token
        let token = jwt.sign(payload, config.SECRET, {
          expiresIn: "24h",
        });
        userInfo.password = null;
        return res.json({
          success: true,
          message: "Enjoy this system!",
          data: {
            token: token,
            user: userInfo,
          },
        });
      }
      // Check password has been hashed fail
      else {
        return res.status(403).json({
          success: false,
          message: "Authentication failed. Wrong password.",
        });
      }
    }
    // If user not found, return notification
    else {
      return res.status(403).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

  } catch (err) {
    return errorProcess(res, err)
  }
});

module.exports = router;
