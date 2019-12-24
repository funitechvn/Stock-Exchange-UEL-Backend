var multer = require('multer');
var randomString = require('randomstring');

module.exports = {

  uploadFile: (type) => {
    var placeStore = `${type}`;
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'src/app/public/' + placeStore)
      },
      filename: (req, file, cb) => {
        let fileName = file.originalname.split('.');
        let newFileName = `${randomString.generate(10)}-${new Date().getTime()}`
        cb(null, `${newFileName}.${fileName[fileName.length - 1]}`);
      }
  });
    return multer({storage: storage});
  },
}