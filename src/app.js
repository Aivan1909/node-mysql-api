import express from 'express'
import morgan from 'morgan'
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const https =  require('https')
const fs =  require('fs')


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
import dptoRoutes from './routes/departamento.routes'
import dashboardRoutes from './routes/dashboard.routes'
import figuraRoutes from './routes/figura.routes'
import sectorRoutes from './routes/sector.routes'
import medioRoutes from './routes/medio.routes'
import suscripcionRoutes from './routes/suscripcion.routes'
import visibilidadRoutes from './routes/visibilidad.routes'
import plataformaRoutes from './routes/plataforma.routes'
import publicidadRoutes from './routes/publicidad.routes'
import rolRoutes from './routes/roles.routes'
import planRoutes from './routes/plan.routes'
import mentorRoutes from './routes/mentor.routes'
import mentoriaRoutes from './routes/mentoria.routes'
import horarioRoutes from './routes/horario.routes'
import areaRoutes from './routes/area.routes'
import especialidadRoutes from './routes/especialidad.routes'
import emprendimientoRoutes from './routes/emprendimiento.routes'
import publicacionRoutes from './routes/publicacion.routes'
import { Http2ServerRequest } from 'http2'













const app = express()

//Settings
const config = require('./config')
app.set('port', config.app.port)
const corsOptions = {
  origin: config.app.clientUrl, optionsSuccessStatus: 200
}
//Cors
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//SsL
//https.createServer({
//  cert: fs.readFileSync('mi_certificado.crt'),
//  key: fs.readFileSync('mi_certificado.key')
//}, app).listen(PUERTO,function(){
//  console.log("Server https corriendo en el  puerto")
//});

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
app.use("/api/asesores", asesorRoutes)
app.use("/api/areas", areaRoutes)
app.use("/api/badges", badgeRoutes)
app.use("/api/colaboradores", colaboradorRoutes)
app.use("/api/criterios", criterioRoutes)
app.use("/api/departamento", dptoRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/especialidades", especialidadRoutes)
app.use("/api/emprendimiento", emprendimientoRoutes)
app.use("/api/fases", faseRoutes)
app.use("/api/figuras", figuraRoutes)
app.use("/api/horarios", horarioRoutes)
app.use("/api/medios", medioRoutes)
app.use("/api/mentores", mentorRoutes)
app.use("/api/mentorias", mentoriaRoutes)
app.use("/api/muestreo", muestreoRoutes)
app.use("/api/ods", odsRoutes)
app.use("/api/planes", planRoutes)
app.use("/api/plataformas", plataformaRoutes)
app.use("/api/publicidades", publicidadRoutes)
app.use("/api/publicacion", publicacionRoutes)
app.use("/api/roles", rolRoutes)
app.use("/api/sector", sectorRoutes)
app.use("/api/suscripciones", suscripcionRoutes)
app.use("/api/testimonios", testimonioRoutes)
app.use("/api/trayectoria", trayectoriaRoutes)
app.use("/api/visibilidad", visibilidadRoutes)
app.use("/api/usuarios", usuarioRoutes)


export default app;