const { response, request } = require('express');
const { validationResult } = require('express-validator');

/**
 * Middleware para validar campos en una solicitud HTTP.
 * Este middleware utiliza express-validator para validar los campos de la solicitud
 * y enviar una respuesta de error si hay algún error de validación.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware en la cadena.
 */
const validarCampos = (req = request, res = response, next) => {

    // Manejo de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
};

module.exports = {
    validarCampos
};
