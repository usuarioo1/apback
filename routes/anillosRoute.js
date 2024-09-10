const express = require('express');

const { 
    getAnillos, 
    createAnillo, 
    getAnilloById, 
    updateAnillo, 
    deleteAnillo, 
    reduceStock 
} = require('../controllers/anillosController');

const anillosRoute = express.Router();

anillosRoute.route('/anillos')
    .get(getAnillos)
    .post(createAnillo);

anillosRoute.route('/anillos/:id')
    .get(getAnilloById)
    .put(updateAnillo)
    .delete(deleteAnillo);

anillosRoute.route('/anillos/reduceStock')
    .post(reduceStock);

module.exports = anillosRoute;
