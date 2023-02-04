import fs from 'fs';
import config from '../config';
import moment from 'moment/moment';
const path = require('path');
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
function SaveOneFile({ mainFolder, idFolder, file }) {
    try {
        const pathFolder = `${mainFolder}/${idFolder}`;
        const filename = `${Math.round(Math.random() * 99999)}-${moment().unix()}${path.extname(file.originalname)}`;
        createFolder(pathFolder);
        fs.writeFile(`uploads/${pathFolder}/${filename}`, file.buffer, 'binary', (error) => {
            if (error) throw new Error('Error al crear al archivo', error);
        });
        return `uploads/${pathFolder}/${filename}`;
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
        console.log(error);
        return 'Imagen  no Encontrada';
    }
}
/*
@Params:
    nameFile:string
*/
function updateOneFile({ pathFile, file }) {
    try {
        fs.writeFile(pathFile, file.buffer, 'binary', (error) => {
            if (error) throw new Error('Error al actualizar el archivo', error);
        });
        const oldExt = path.extname(pathFile);
        const newExt = path.extname(file.originalname);
        return oldExt !== newExt && pathFile.replace(oldExt, newExt);
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
            if (type.includes('jpg') || type.includes('png') || type.includes('jpeg')) return next();
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
        const pathFolder = String(pathfile).substring(0, String(pathfile).lastIndexOf('/'));
        fs.unlinkSync(pathFolder);
    } catch (error) {
        throw new Error(error);
    }
}
export { uploadImg, SaveOneFile, getOneFile, updateOneFile, deleteOneFile, isImage,deleleFolder };
