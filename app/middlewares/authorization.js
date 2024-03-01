import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {usuarios} from "../controllers/authentication.controllers.js"

dotenv.config();

function soloAdmin(req,res,next){
   const logueado = revisarCookie(req);
   if (logueado) return next();
   return res.redirect("/")
}

function soloPublico(req,res,next){
    const logueado = revisarCookie(req);
   if (!logueado) return next();
   return res.redirect("/admin")
}

function revisarCookie(req){
    if(!req.headers.cookie){
        console.log("No se encontraron cookies");
        return false
    }
    
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log("UsuarioARevisar")
    const usuarioARevisar = usuarios.find(u => u.usuario === decodificada.usuario);
    if (!usuarioARevisar) {
        return false;
    }
    return true;
}
export const methods = {
    soloAdmin,
    soloPublico,
}