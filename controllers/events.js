const { request, response, raw } = require( 'express' );
const Evento = require( '../models/Evento' );

const getEventos = async ( req = request, res = response ) => {

    const eventos = await Evento.find()
        .populate( 'user', 'name email' );

    try {
        return res.status( 200 ).json( {
            ok: true,
            eventos
        } )
    } catch ( error ) {

    }
}

const crearEvento = async ( req = request, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.status( 200 ).json( {
            ok: true,
            evento: eventoGuardado
        } )
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).json( {
            ok: false,
            msg: 'Hable con el administrador'
        } );
    }
}

const actualizarEvento = async ( req = request, res = response ) => {
    try {
        const eventoId = req.params.id;
        const uid = req.uid;

        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            res.status( 404 ).json( {
                ok: false,
                msg: 'Evento no existe por ese id'
            } );
        }

        if ( evento.user.toString() !== uid ) {
            return res.status( 401 ).json( {
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            } );
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        return res.status( 200 ).json( {
            ok: true,
            evento: eventoActualizado
        } )
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).json( {
            ok: false,
            msg: 'Hable con el administrador'
        } );
    }
}

const eliminarEventos = async ( req = request, res = response ) => {
    try {
        const eventoId = req.params.id;
        const uid = req.uid;

        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            res.status( 404 ).json( {
                ok: false,
                msg: 'Evento no existe por ese id'
            } );
        }

        if ( evento.user.toString() !== uid ) {
            return res.status( 401 ).json( {
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            } );
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId, { new: true } );

        return res.status( 200 ).json( {
            ok: true,
            msg: 'Evento eliminado existosamente',
            evento: eventoEliminado
        } )
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).json( {
            ok: false,
            msg: 'Hable con el administrador'
        } );
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEventos
}

