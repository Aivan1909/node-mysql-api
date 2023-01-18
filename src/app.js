import express from 'express'
import morgan from 'morgan'
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')


// Routes
const error = require('./red/errors')
import alianzaRoutes from './routes/alianza.routes'
import usuarioRoutes from './routes/usuario.routes'

const app = express()

//Settings
const config = require('./config')
app.set('port', config.app.port)
const corsOptions = {
  origin: config.app.clientUrl, optionsSuccessStatus: 200
}
app.use(cors())

//Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'))
/* app.use(express.urlencoded({ extended: true }))
app.use(express.json()) */
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use(error)
app.use("/api/alianzas", alianzaRoutes)
app.use("/api/usuarios", usuarioRoutes)


export default app;