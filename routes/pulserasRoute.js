const express = require('express');

const { 
    getPulseras, 
    createPulsera, 
    getPulseraById, 
    updatePulsera, 
    deletePulsera, 
    reduceStock,
    subirImagenPulsera
} = require('../controllers/pulserasController');

const pulserasRoute = express.Router();

pulserasRoute.route('/pulseras')
    .get(getPulseras)
    .post(createPulsera);

// La ruta de reduceStock debe ir antes de las rutas con parámetros
pulserasRoute.route('/pulseras/reduceStock')
    .post(reduceStock);

pulserasRoute.route('/pulseras/:id')
    .get(getPulseraById)
    .put(updatePulsera)
    .delete(deletePulsera);

// Ruta para subir imagen a una pulsera específica
pulserasRoute.route('/pulseras/:id/imagen')
    .post(subirImagenPulsera);

module.exports = pulserasRoute;
