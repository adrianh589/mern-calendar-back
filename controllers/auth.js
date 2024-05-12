const { response, request } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

/**
 * Controlador para autenticar un usuario.
 * @param {request} req - El objeto de solicitud HTTP.
 * @param {response} res - El objeto de respuesta HTTP.
 * @returns {response} Objeto de respuesta HTTP.
 */
const loginUsuario = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            msg: 'login',
            uid: usuario.uid,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        });
    }
};

/**
 * Controlador para crear un nuevo usuario.
 * @param {request} req - El objeto de solicitud HTTP.
 * @param {response} res - El objeto de respuesta HTTP.
 * @returns {response} Objeto de respuesta HTTP.
 */
const crearUsuario = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        });
    }
};

/**
 * Controlador para revalidar un token JWT.
 * @param {request} req - El objeto de solicitud HTTP.
 * @param {response} res - El objeto de respuesta HTTP.
 * @returns {response} Objeto de respuesta HTTP.
 */
const revalidarToken = async (req = request, res = response) => {
    const { name, uid } = req;

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        msg: 'Renovación del token exitosa',
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};
