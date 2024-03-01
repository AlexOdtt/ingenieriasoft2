import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const usuarios = [{
    usuario: "a",
    email: "a@a",
    password: "$2a$05$i.o96sv309mc6vdhLsnybO5mTt30lOv6v5ec1e1yVSuJCXmKb8GZu"
}]

async function login(req, res) {
    console.log(req.body);
    const usuario = req.body.usuario;
    const password = req.body.password;
    if (!usuario || !password) {
        res.status(400).send({ status: "Error", message: "Los campos están incompletos" })
    }
    const usuarioARevisar = usuarios.find(u => u.usuario === usuario);
    if (!usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "Error en el proceso de Login" })
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Error durante el login" })
    }
    const token = jsonwebtoken.sign(
        {usuario:usuarioARevisar.usuario},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION});

        const cookieOption = {
            expires:  new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: "/"
        }
        res.cookie("jwt",token,cookieOption);
        res.send({status:"ok", message:"Usuario logeado succesfully",redirect:"/admin"})
}

async function register(req, res) {
    console.log(req.body);
    const usuario = req.body.usuario;
    const password = req.body.password;
    const email = req.body.email;
    if (!usuario || !password || !email) {
        res.status(400).send({ status: "Error", message: "Los campos están incompletos" })
    }
    const usuarioARevisar = usuarios.find(u => u.usuario === usuario);
    if (usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "Este usuario ya existe" })
    }

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt)
    const nuevoUsuario = {
        usuario, email, password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.usuario} agregado`, redirect: "/" });
}

export const methods = {
    login,
    register
}