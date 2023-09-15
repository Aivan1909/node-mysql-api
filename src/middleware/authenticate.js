const { getTokenData } = require('../bin/jwt')

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = getTokenData(token);

    if (decode.status == 200)
      req.user = decode;
    else
      return res.status(decode.status).json({ mensaje: decode.mensaje })
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "e401" })
  }
}

module.exports = authenticate;