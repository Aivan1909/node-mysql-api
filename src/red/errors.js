const respuesta = require('./respuestas')

function errors(err, req, res, next) {
  console.log("[error", err)

  const message = err.message || "Error interno"
  const status = err.statusCode || 500

  respuesta.error(req, res, message, status)
}

module.exports = errors