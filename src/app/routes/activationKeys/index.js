const router = require("express").Router();
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const path = require("path")

const { errorProcess, success } = require("services/returnToUser");
const { createListKeys } = require("services/generateExcelFile");


/**
 *  /activationKeys trả về danh sách các key có trong DB
 */
router.get('/', async (req, res, next) => {
  try {
      let activeKeys = await mongoose.model('activeKey').find()
    return success(res, "done", activeKeys);
  } catch (error) {
    return errorProcess(res, error);
  }
})



router.post('/', async (req, res, next) => {
    try {
        let numOfKey = parseInt(req.body.num_of_key);
        for(let count = 0; count < numOfKey; count++){
          await mongoose.model('activeKey').create({
                key: 'fese-' + await randomstring.generate(8)
          })
        }
        let listKeys = await mongoose.model('activeKey').find();
        await createListKeys(listKeys);
        // let localtoFile = path.join(__dirname + '/../../public/ExcelFile/Excel.xlsx')
          // res.sendFile(localtoFile);
        return success(res, "done", listKeys);
    } catch (error) {
        console.log(error);
      return errorProcess(res, error);
    }
  })

router.get('/getListKeys', async (req, res, next) => {
    try {
        let localtoFile = path.join(__dirname + '/../../public/ExcelFile/Excel.xlsx')
        // return res.sendFile( 'Excel.xlsx',  { root: path.join(__dirname + '/../../public/ExcelFile')});
        // return res.download(localtoFile);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Excel.xlsx");
        return res.end(localtoFile, 'binary');
    } catch (error) {
        console.log(error);
      return errorProcess(res, error);
    }
  })

module.exports = router;