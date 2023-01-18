const path = require('path')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { id } = req.params
    const { directorio } = req.body
    const dir = `src/public/uploads/${directorio}/${id}`
    fs.mkdirSync(dir, { recursive: true })
    //req.body.directorio = dir
    console.log("DIR: ", dir)
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})

const uploadImg = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
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