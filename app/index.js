import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from "./controllers/authentication.controllers.js";
import { methods as authorization } from "./middlewares/authorization.js"
import cookieParser from "cookie-parser";


//server
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("servidor corriendo en puerto", app.get("port"))


//configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());

//rutas
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));
app.get("/register",authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages", "register.html")));
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "admin", "admin.html")));
app.post("/login",authentication.login);
app.post("/register",authentication.register);
