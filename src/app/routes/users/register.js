const router = require("express").Router();
const mongoose = require('mongoose');
const randomstring = require("randomstring");
var bcrypt = require("bcryptjs");

const { errorProcess, success, errorWithMess } = require("services/returnToUser");
const { IS_USER } = require("config/index");
const { Send } = require("services/sendEmail")

router.post('/', async (req, res, next) => {
  try {
    //check if key already actived
    let activeKey = await mongoose.model('activeKey').findOne({ key: req.body.activeKey, actived: false });
    if (!activeKey) {
      return errorWithMess(res, "Key đã được kích hoạt hoặc không tồn tại");
    }
    //check if user already exist
    let oldUser = await mongoose.model('users').findOne({ username: req.body.username });
    if (oldUser) {
      return errorWithMess(res, "Username đã tồn tại");
    }
    let password = randomstring.generate(8);
    let newUser = {
      username: req.body.username,
      password: password,
      roles: IS_USER,
      fullname: req.body.fullname,
      activeKeyId: activeKey._id
    };


    bcrypt.hash(newUser.password, 10, async (err, hash) => {
      //send password via email
      let subject = "Đăng kí thành công"
      let content = "Mật khẩu của bạn là " + password
      await Send(newUser.username, subject, content)

      // hash & save users
      newUser.password = hash;
      let usersInfo = await mongoose.model("users").create(newUser);

      //active key
      activeKey.actived = true;
      activeKey.activedDate = new Date();
      activeKey.belongTo = usersInfo._id;
      await activeKey.save();

    });


    return success(res, "done");
  } catch (error) {
    console.log(error)
    return errorProcess(res, error);
  }
})

module.exports = router;