import { getConnection } from '../database/database';
import { deleteFolder, getMultipleFiles, SaveManyFiles, SaveOneFile, updateOneFile } from '../middleware/upload';
const _TABLA_EMPRENDIMIENTOS = 'tmunay_emprendimientos';

const tipoColumna = {
    LOGO: 'logo',
    FUNDADORES: 'fundadores',
    EQUIPO: 'equipo',
    DOCUMENTO: 'documento',
    PORTADA: 'portada',
};

export const EmprendimientoController = {
    addEmprendimiento: async (req, res) => {
        try {
            const { ...rest } = req.body;
            const conn = await getConnection();
            const save = await conn.query(`INSERT INTO ${_TABLA_EMPRENDIMIENTOS} SET ?`, {
                ...rest,
            });
            res.status(201).json(save);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error Servidor', error: String(error) });
        }
    },
    getImages: async (req, res) => {
        try {
            const connection = await getConnection();
            const { id } = req.params;
            const { tipo } = req.query;
            const result = await connection.query(`SELECT * FROM ${_TABLA_EMPRENDIMIENTOS} WHERE id=?`, id);
            if (!result.length > 0)
                return res.status(400).json({ message: 'No se encontro el emprendimiento con el id: ' + id });
            switch (tipo) {
                case tipoColumna.LOGO:
                    let imagenLogo = getOneFile(result[0].logo);
                    if (!imagenLogo) return res.status(404).json({ message: 'No hay ninguna Imagen' });
                    return res.json({ body: { fileImagen: imagenLogo } });
                case tipoColumna.FUNDADORES:
                    let imagenFundadores = getOneFile(result[0].fotoFundadores);
                    if (!imagenFundadores) return res.status(404).json({ message: 'No hay ninguna Imagen' });
                    return res.json({ body: { fileImagen: imagenLogo } });
                case tipoColumna.EQUIPO:
                    let imagenEquipo = getOneFile(result[0].fotoEquipo);
                    if (!imagenEquipo) return res.status(404).json({ message: 'No hay ninguna Imagen' });
                    return res.json({ body: { fileImagen: imagenEquipo } });
                // case tipoColumna.DOCUMENTO:
                case tipoColumna.PORTADA:
                    let fotosPortada=await getMultipleFiles(result[0].portada) 
                    return res.json(fotosPortada)
                case tipoColumna.DOCUMENTO:
                    let dataDocumento=await getMultipleFiles(result[0].documento) 
                    return res.json(dataDocumento)
                default:
                    return res.status(500).json({ message: 'Nose Encontro el tipo' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro Interno', error: String(error) });
        }
    },
    addImages: async (req, res) => {
        try {
            const connection = await getConnection();
            const { id } = req.params;
            const { tipo } = req.query;
            const result = await connection.query(`SELECT * FROM ${_TABLA_EMPRENDIMIENTOS} WHERE id=?`, id);
            const folder = 'emprendimiento';
            if (!result.length > 0)
                return res.status(400).json({ message: 'No se encontro el emprendimiento con el id: ' + id });
            if (!req.files.length > 0) return res.status(404).json({ message: 'No hay ninguna Imagen' });
            console.log('entro', result);
            switch (tipo) {
                // logo solo tiene q ser uno agarrara el primero que encuentree  y lo guardara
                case tipoColumna.LOGO:
                    if (!result[0].logo) {
                        let pathLogo = SaveOneFile({ mainFolder: folder, idFolder: id, file: req.files[0] });
                        await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET logo=? WHERE id=?`, [
                            pathLogo,
                            id,
                        ]);
                    } else {
                        let responseUpdateLogo = updateOneFile({ pathFile: result[0].logo, file: req.files[0] });
                        if (responseUpdateLogo)
                            await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET logo=? WHERE id=?`, [
                                responseUpdateLogo,
                                id,
                            ]);
                    }
                    break;
                case tipoColumna.FUNDADORES:
                    if (!result[0].fotoFundadores) {
                        let pathFundadores = SaveOneFile({ mainFolder: folder, idFolder: id, file: req.files[0] });
                        await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET fotoFundadores=? WHERE id=?`, [
                            pathFundadores,
                            id,
                        ]);
                    } else {
                        let responseUpdateFundadores = updateOneFile({
                            pathFile: result[0].fotoFundadores,
                            file: req.files[0],
                        });
                        if (responseUpdateFundadores)
                            await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET fotoFundadores=? WHERE id=?`, [
                                responseUpdateFundadores,
                                id,
                            ]);
                    }
                    break;
                case tipoColumna.EQUIPO:
                    if (!result[0].fotoEquipo) {
                        let pathEquipo = SaveOneFile({ mainFolder: folder, idFolder: id, file: req.files[0] });
                        await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET fotoEquipo=? WHERE id=?`, [
                            pathEquipo,
                            id,
                        ]);
                    } else {
                        let responseUpdateEquipo = updateOneFile({
                            pathFile: result[0].logoEquipo,
                            file: req.files[0],
                        });
                        if (responseUpdateEquipo)
                            await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET fotoEquipo=? WHERE id=?`, [
                                responseUpdateEquipo,
                                id,
                            ]);
                    }
                    break;
                case tipoColumna.DOCUMENTO:
                    if (!result[0].documento) {
                        let pathDocumentos = SaveManyFiles({
                            mainFolder: folder + id + '/documentos',
                            file: req.files,
                        });
                        await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET documento=? WHERE id=?`, [
                            pathDocumentos,
                            id,
                        ]);
                    }
                    break;
                case tipoColumna.PORTADA:
                    if (!result[0].portada) {
                        let pathPortada = SaveManyFiles({
                            mainFolder: `${folder}/${id}/portada`,
                            file: req.files,
                        });
                        await connection.query(`UPDATE ${_TABLA_EMPRENDIMIENTOS} SET portada=? WHERE id=?`, [
                            pathPortada,
                            id,
                        ]);
                    }
                    break;
                default:
                    res.status(500).json({ message: 'Nose Encontro el tipo' });
            }
            const data = await connection.query(`SELECT * FROM ${_TABLA_EMPRENDIMIENTOS} WHERE id=?`, id);
            res.json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro Interno', error });
        }
    },

    deleteImages: async (req, res) => {
        try {
            const connection = await getConnection();
            const { id } = req.params;
            const foundEmprendimiento = await connection.query(
                `SELECT * FROM ${_TABLA_EMPRENDIMIENTOS} WHERE id=?`,
                id
            );
            if (foundEmprendimiento.length > 0) {
                deleteFolder(
                    foundEmprendimiento[0].logo ||
                        foundEmprendimiento[0].fotoEquipo ||
                        foundEmprendimiento[0].fotoFundadores ||
                        foundEmprendimiento[0].portada ||
                        foundEmprendimiento[0].documento
                );
            }
            const result = await connection.query(`DELETE FROM ${_TABLA_EMPRENDIMIENTOS} WHERE id=?`, id);
            res.status(200).json({ message: 'Hecho!!!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro Interno', error });
        }
    },

    sendEmail: async (req, res) => {
        const { ...rest } = req.body;
        let bodyEmail = rest.bodyEmail;
        let remitente = rest.remitente;
        
        res.status(200).json({message: 'enviado', data: rest});
    },
};
