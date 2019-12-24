var router = require("express").Router();
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
var config = require("config/index");


router.use("/register", require("./users/register"));
router.use("/users/login", require("./users/login"));

// Every connection with different to pathname = /admin to server has to proccess this function expect authenticate
router.use((req, res, next) => {
  // Check header or url parameters or post content token
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // decode token
  if (token) {
    // Verify secrect and checks exp
    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        return res.status(406).json({
          success: false,
          message: `Failed to authenticate token. ${err.message}`,
        });
      } else {
        // If everthing is good, save to request for use in other routes
        mongoose.model("users").findById(decoded._id, (err, userInfo) => {
          if (err) return res.status(500).send({ err });
          if (userInfo) {
            req.user = userInfo;
            next();
          } else {
            return res.status(401).send({
              success: false,
              message: "Token unavailable",
              data: null,
            });
          }
        });
      }
    });
  } else {
    // If there is no token
    // Return an error
    return res.status(401).send({
      success: false,
      message: "No token provide.",
    });
  }
});

router.use("/dashboard", require("./dashboard"));
router.use("/stocks", require("./stocks"));
router.use("/history", require("./history"));
router.use("/activationKeys", require("./activationKeys"));


module.exports = router;
