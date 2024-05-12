const mongoose = require('mongoose');

/**
 * Función asincrónica para establecer la conexión con la base de datos MongoDB.
 * @returns {Promise<void>} Una promesa que se resuelve una vez que se ha establecido la conexión con la base de datos.
 * @throws {Error} Si hay algún error al intentar conectar con la base de datos.
 */
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('Conexión con la base de datos establecida correctamente.');

    } catch (error) {
        console.error(error);
        throw new Error('Error al intentar establecer la conexión con la base de datos.');
    }
}

module.exports = {
    dbConnection
};
