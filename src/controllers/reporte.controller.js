import { getConnection } from '../database/database';
const ExcelJS = require("exceljs");

const emprendimiento = async (req, res) => {
  try {
    // Obtener los datos necesarios para el informe desde req.body

    // Crear un nuevo libro de trabajo de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    // Agregar encabezados de columna
    worksheet.addRow(["Código", "Emprendimiento", "Email", "Teléfono", "Fecha fundación"]);

    // Agregar datos a las filas
    // Supongamos que data es un arreglo de objetos obtenidos de la base de datos
    const connection = await getConnection();
    const data = await connection.query(`SELECT * FROM tmunay_emprendimientos `);
    // Por ejemplo: [{ columna1: "Valor1", columna2: "Valor2", columna3: "Valor3" }]
    data.forEach(item => {
      worksheet.addRow([item.codigo, item.emprendimiento, item.email, item.telefono, item.fundacion]);
    });

    res.set("Content-Disposition", "attachment; filename=reporte.xlsx");
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Generar el archivo Excel en memoria
    workbook.xlsx.write(res)
      .then(() => {
        console.log(res)
        res.end();
      })
      .catch(error => {
        console.error("Error generando el archivo Excel", error);
        res.status(500).send("Error generando el archivo Excel");
      });
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
};

export const methods = {
  emprendimiento
};
