const router = require("express").Router();
const mongoose = require('mongoose');
const randomstring = require("randomstring");

const { errorProcess, success } = require("services/returnToUser");
const { createListKeys } = require("services/generateExcelFile");

/**
 * Truyền một input name="numOfKey" vào đường dẫn /activationKeys
 * Func sẽ trả về file excel danh sách các key nếu thành công
 */
router.post('/', async (req, res, next) => {
  try {
      let numOfKey = req.body.numOfKey;
      for(let count = 0; count < numOfKey; count++){
          await mongoose.model('activeKey').create({
          key: 'fese-' + randomstring.generate(8)
        })
      }
      let listKeys = await mongoose.model('activeKey').find();
      await createListKeys(listKeys);
      return res.download('src/app/public/ExcelFile/Excel.xlsx');
  } catch (error) {
    return errorProcess(res, error);
  }
})

module.exports = router;