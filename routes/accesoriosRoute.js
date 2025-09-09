const express = require('express');

const { 
    getAccesorios, 
    createAccesorio, 
    getAccesorioById, 
    updateAccesorio, 
    deleteAccesorio, 
    reduceStock,
    subirImagenAccesorio 
} = require('../controllers/accesoriosController');

const accesoriosRoute = express.Router();

accesoriosRoute.route('/accesorios')
    .get(getAccesorios)
    .post(createAccesorio);

// La ruta de reduceStock debe ir antes de las rutas con parámetros
accesoriosRoute.route('/accesorios/reduceStock')
    .post(reduceStock);

accesoriosRoute.route('/accesorios/:id')
    .get(getAccesorioById)
    .put(updateAccesorio)
    .delete(deleteAccesorio);

// Ruta para subir imagen a un accesorio específico
accesoriosRoute.route('/accesorios/:id/imagen')
    .post(subirImagenAccesorio);

module.exports = accesoriosRoute;
