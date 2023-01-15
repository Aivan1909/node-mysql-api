import mysql from 'promise-mysql'
const config = require('./../config')


const connection = mysql.createConnection({
  host: config.mysql.host,
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password
})

const getConnection = () => {
  return connection
}

module.exports = {
  getConnection
}