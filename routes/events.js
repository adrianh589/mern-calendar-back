/*
    Rutas de Eventos
    host+ /api/events
*/

// Todas tienen que pasar por la validación del JWT
// Obtener eventos
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { actualizarEvento, crearEvento, eliminarEventos, getEventos } = require('../controllers/events');
const { isDate } = require( '../helpers/isDate' );

const router = Router();

// Todas las peticiones tienen que pasar por la validación del JWT
router.use(validarJWT); // Agrega este middleware para todas las rutas de las rutas events
                        // NOTA: todo lo que este debajo de esta linea, aplica este middleware, si está por encima, no se lo pone
router.get('/', getEventos);

// Crear un nuevo evento
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio debe ser obligatoria').custom(isDate),
    check('end', 'La fecha de finalización debe ser obligatoria').custom(isDate),
    validarCampos
],crearEvento);

// Actualizar evento
router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio debe ser obligatoria').custom(isDate),
    check('end', 'La fecha de finalización debe ser obligatoria').custom(isDate),
    validarCampos
],actualizarEvento);

// Borrar evento
router.delete('/:id', eliminarEventos);

module.exports = router;
