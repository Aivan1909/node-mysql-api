require('dotenv').config()

module.exports = {
  app: { 
    port: process.env.PORT || '4000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost',
    serverUrl: process.env.SERVER_URL || 'http://localhost:8000'
  },
  jwt: { secret: process.env.JWT_SECRET || 'mySecret', expires: process.env.JWT_EXPRIRES || '1h' },
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    database: process.env.MYSQL_DATABASE || "",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || ""
  }
}