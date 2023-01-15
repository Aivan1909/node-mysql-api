const jwt = require('jsonwebtoken')
const config = require('../config')

const secret = config.jwt.secret
const expires = config.jwt.expires

const getToken = (payload) => {
  return jwt.sign(
    {
      data: payload
    },
    secret,
    { expiresIn: expires }
  )
}

const getTokenData = (token) => {
  let data = null;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (
        err.name === 'TokenExpiredError'
      ) {
        data = { mensaje: "El token expiró.", status: 401 }
      } else {
        data = { mensaje: "Erros al obtener token", status: 500 }
      }
    } else {
      data = { datos: decoded, status: 200 };
    }
  });

  return data;
}

module.exports = {
  getToken,
  getTokenData
}