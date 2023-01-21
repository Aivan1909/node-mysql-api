import express from 'express'
import morgan from 'morgan'
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')


// Routes
const error = require('./red/errors')
import alianzaRoutes from './routes/alianza.routes'
import usuarioRoutes from './routes/usuario.routes'
import trayectoriaRoutes from './routes/trayectoria.routes'
import colaboradorRoutes from './routes/colaborador.routes'
import testimonioRoutes from './routes/testimonio.routes'
import muestreoRoutes from './routes/muestreo.routes'
import odsRoutes from './routes/ods.routes'
import asesorRoutes from './routes/asesor.routes'
import criterioRoutes from './routes/criterio.routes'
import faseRoutes from './routes/fases.routes'
import badgeRoutes from './routes/badge.routes'







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
//-------------------------------------------------------------------------------------------
app.use(error)
app.use("/api/alianzas", alianzaRoutes)
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/trayectoria",trayectoriaRoutes)
app.use("/api/colaboradores",colaboradorRoutes)
app.use("/api/testimonios",testimonioRoutes)
app.use("/api/ods",odsRoutes)
app.use("/api/asesores",asesorRoutes)
app.use("/api/criterio",criterioRoutes)
app.use("/api/fase",faseRoutes)
app.use("/api/badge",badgeRoutes)

//muestreo 
app.use("/api/muestreo",muestreoRoutes)

//-------------------------------------------------------------------------------------------


export default app;