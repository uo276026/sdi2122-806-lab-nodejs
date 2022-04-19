const jwt = require("jsonwebtoken");
const express = require('express');
const userTokenRouter = express.Router();
userTokenRouter.use(function (req, res, next) {
    console.log("userAuthorRouter");
    //Obtenemos el parámetro token, admitimos que se envíe como parámetro: POST, GET o HEADER
    let token = req.headers['token'] || req.body.token || req.query.token;
    //Si hay token
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', {}, function (err, infoToken) {
            //Si no conseguimos desencriptarlo o han pasado más de 240 segundos
            if (err || (Date.now() / 1000 - infoToken.time) > 240) {
                res.status(403); // Forbidden
                // devolvemos un mensaje de error:
                res.json({
                    authorized: false,
                    error: 'Token inválido o caducado'
                });
            // Si lo desencriptamos
            } else {
                //guardar el identificador del usuario en la respuesta: res.user.
                res.user = infoToken.user;
                // dejamos correr la petición next()
                next();
            }
        });
    //Si no hay token
    } else {
        res.status(403); // Forbidden
        //enviamos un mensaje de error
        res.json({
            authorized: false,
            error: 'No hay Token'
        });
    }
});
module.exports = userTokenRouter;