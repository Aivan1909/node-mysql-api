import fs from 'fs';
import moment from 'moment/moment';
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads`);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, file.filename + '.' + Date.now() + ext);
  },
});
const uploadImg = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == '') {
      console.log('Imagen valida');
      callback(null, true);
    } else {
      console.log('Error tipo de archivo, solo jpg y png');
      callback(null, false);
    }
  },
  limits: 2 * 1024 * 1024,
});

function createFolder(path) {
  fs.mkdirSync(`uploads/${path}`, {
    recursive: true,
  });
}
/*
@Params:
  {
    mainFolder:string, //for example alianza,colaborator ,ect
    idFolder:string, // codigo of person or entity that belongs the datas
    file:{fileObject}
  }
*/
async function SaveOneFile({ mainFolder, idFolder, file, targetSize }) {
  try {
    const pathFolder = `${mainFolder}/${idFolder}`;
    const filename = `${Math.round(Math.random() * 99999)}_${moment().unix()}.webp`;
    const filePath = `uploads/${pathFolder}/${filename}`

    // Obtener metadatos de la imagen original
    const metadata = await sharp(file.buffer).metadata();
    const { width, height } = metadata;

    // Calcular la proporción de la imagen original
    const aspectRatio = width / height;

    // Determinar el tamaño objetivo manteniendo la proporción
    let targetWidth, targetHeight;
    if (width >= height) {
      targetWidth = targetSize;
      targetHeight = Math.round(targetSize / aspectRatio);
    } else {
      targetWidth = Math.round(targetSize * aspectRatio);
      targetHeight = targetSize;
    }

    createFolder(pathFolder);

    // Convert the file to .webp format
    await sharp(file.buffer)
      .resize(targetWidth, targetHeight)
      .webp()
      .toFile(filePath)
      .then(() => {
        console.log('File converted to webp:', filePath);
      })
      .catch((error) => {
        throw new Error('Error converting file to webp:', error);
      });

    /* fs.writeFile(`uploads/${pathFolder}/${filename}`, file.buffer, 'binary', (error) => {
      if (error) throw new Error('Error al crear al archivo', error);
    }); */
    return filePath;
  } catch (error) {
    throw new Error(String(error));
  }
}
/*
@Params:
    nameFile:string
*/
function getOneFile(pathFile) {
  try {
    return `data:image/jpeg;base64, ${fs.readFileSync(pathFile, { encoding: 'base64' })}`;
  } catch (error) {
    return pathFile;
  }
}
/*
@Params:
    nameFile:string
*/
async function updateOneFile({ pathFile, file, targetSize }) {
  try {
    deleteOneFile(pathFile);

    const oldExt = await path.extname(pathFile);
    const newExt = ".webp";
    const filePath = pathFile.replace(oldExt, newExt)

    // Obtener metadatos de la imagen original
    const metadata = await sharp(file.buffer).metadata();
    const { width, height } = metadata;

    // Calcular la proporción de la imagen original
    const aspectRatio = width / height;

    // Determinar el tamaño objetivo manteniendo la proporción
    let targetWidth, targetHeight;
    if (width >= height) {
      targetWidth = targetSize;
      targetHeight = Math.round(targetSize / aspectRatio);
    } else {
      targetWidth = Math.round(targetSize * aspectRatio);
      targetHeight = targetSize;
    }

    // Convert the file to .webp format
    await sharp(file.buffer)
      .resize(targetWidth, targetHeight)
      .webp()
      .toFile(filePath)
      .then(async () => {
        console.log('File converted to webp:', filePath);

        return oldExt !== newExt && filePath;
      })
      .catch((error) => {
        throw new Error('Error converting file to webp:', error);
      });

    /* fs.writeFile(pathFile, file.buffer, 'binary', (error) => {
      if (error) throw new Error('Error al actualizar el archivo', error);
    }); */
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

function deleteOneFile(pathFile) {
  try {
    fs.unlinkSync(pathFile);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

function isImage(req, res, next) {
  try {
    if (req.file) {
      const type = String(req.file.mimetype);
      if (type.includes('jpg') || type.includes('png') || type.includes('jpeg') || type.includes('webp')) return next();
      return res.status(406).json({ message: 'Solo se Acepta Imagenes de  tipo jpeg, png, jpg' });
    }
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}

function deleleFolder(pathfile) {
  try {
    if (pathfile != "") {
      const pathFolder = String(pathfile).substring(0, String(pathfile).lastIndexOf('/'));
      fs.rmSync(pathFolder, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(error);
  }
}
export { uploadImg, SaveOneFile, getOneFile, updateOneFile, deleteOneFile, isImage, deleleFolder };