require('dotenv').config()

module.exports = {
  app: { port: process.env.PORT || '4000', clientUrl: process.env.CLIENT_URL || 'http://localhost' },
  jwt: { secret: process.env.JWT_SECRET || 'mySecret', expires: process.env.JWT_EXPRIRES || '1h' },
  mysql: {
    host: process.env.MYSQL_HOST || "",
    database: process.env.MYSQL_DATABASE || "",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || ""
  }
}