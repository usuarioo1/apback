const express = require('express');

const { 
    getCadenas, 
    createCadena, 
    getCadenaById, 
    updateCadena, 
    deleteCadena, 
    reduceStock,
    subirImagenCadena
} = require('../controllers/cadenasController');

const cadenasRoute = express.Router();

cadenasRoute.route('/cadenas')
    .get(getCadenas)
    .post(createCadena);

cadenasRoute.route('/cadenas/:id')
    .get(getCadenaById)
    .put(updateCadena)
    .delete(deleteCadena);

// Ruta para subir imagen a una cadena específica
cadenasRoute.route('/cadenas/:id/imagen')
    .post(subirImagenCadena);

cadenasRoute.route('/cadenas/reduceStock')
    .post(reduceStock);

module.exports = cadenasRoute;
