const { response, request } = require('express');
const jwt = require('jsonwebtoken');

/**
 * Middleware que valida un JWT (JSON Web Token) en las peticiones.
 * @param {request} req - El objeto de solicitud HTTP.
 * @param {response} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {response} Objeto de respuesta HTTP.
 */
const validarJWT = (req = request, res = response, next) => {
    // Se obtiene el token del encabezado 'x-token'
    const token = req.header('x-token');

    // Si no hay token en la petición, se envía una respuesta de error
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No se proporcionó ningún token en la petición'
        });
    }

    try {
        // Se verifica y decodifica el token utilizando la variable de entorno
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        // Se adjuntan los datos decodificados al objeto de solicitud para su uso posterior
        req.uid = uid;
        req.name = name;

    } catch (error) {
        // Si hay algún error en la verificación del token, se envía una respuesta de error
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }

    // Si el token es válido, se pasa el control al siguiente middleware
    next();
}

module.exports = {
    validarJWT
}
