import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { config } from "dotenv";
import { getConnection } from '../database/database';
//import { SaveOneFile, deleteOneFile, getOneFile, updateOneFile } from '../middleware/upload';
config();

const emails = ["fer17nanno.bennyhi@gmail.com"];
const _TABLA = 'usuario';

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google",
    },
    function (accessToken, refreshToken, profile, done) {
      const response = emails.includes(profile.emails[0].value);

      console.log('Perfil :' ,profile)
      console.log('Nombre :' ,profile._json.given_name)
      console.log('Apellido :',profile._json.family_name)
      console.log('Correo: ', profile.emails[0].value)
       let nom = profile._json.given_name;
       let ape = profile._json.family_name
       let correo = profile.emails[0].value
      //console.log('Perfil :' ,profile)
      const usuario = {}
      // IF EXITS IN DATABASE
      usuario.nombre = nom
      usuario.apellido = ape
      usuario.correo = correo
      console.log('usuario :' , usuario)
      if (response) {
        done(null, profile);
        console.log("Aqui response -> ")
      } else {
        // SAVE IN DATABASE
        emails.push(profile.emails[0].value);
        done(null, profile);
        
        const connection = getConnection();
        const result = connection.query(`INSERT INTO ${_TABLA} SET ?`, usuario);

        console.log("Aqui-->> else")
      }
    }
  )
);