const express = require('express');

const { 
    getPulseras, 
    createPulsera, 
    getPulseraById, 
    updatePulsera, 
    deletePulsera, 
    reduceStock 
} = require('../controllers/pulserasController');

const pulserasRoute = express.Router();

pulserasRoute.route('/pulseras')
    .get(getPulseras)
    .post(createPulsera);

pulserasRoute.route('/pulseras/:id')
    .get(getPulseraById)
    .put(updatePulsera)
    .delete(deletePulsera);

pulserasRoute.route('/pulseras/reduceStock')
    .post(reduceStock);

module.exports = pulserasRoute;
