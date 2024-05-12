const express = require('express');
const { dbConnection } = require( './database/config' );
const cors = require('cors');
require('dotenv').config();

// console.log(process.env);

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection(); // Establece la conexión con la base de datos

// CORS
app.use(cors()); // Permite solicitudes de recursos desde orígenes diferentes al del servidor

// Directorio publico (Esto es para que coja el index.html, no se pone porque obviamente todo index se toma por defecto)
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json()); // Analiza el cuerpo de las solicitudes entrantes con formato JSON

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
});
