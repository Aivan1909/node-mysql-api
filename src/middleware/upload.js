const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
})

const uploadImg = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg'
    ) {
      console.log('Imagen valida');
      callback(null, true);
    } else {
      console.log('Error tipo de archivo, solo jpg y png');
      callback(null, false);
    }
  },
  limits: 2 * 1024 * 1024
})

module.exports = uploadImg;