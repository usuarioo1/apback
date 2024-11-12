const express = require('express');

const { 
    getCadenas, 
    createCadena, 
    getCadenaById, 
    updateCadena, 
    deleteCadena, 
    reduceStock 
} = require('../controllers/cadenasController');

const cadenasRoute = express.Router();

cadenasRoute.route('/cadenas')
    .get(getCadenas)
    .post(createCadena);

cadenasRoute.route('/cadenas/:id')
    .get(getCadenaById)
    .put(updateCadena)
    .delete(deleteCadena);

cadenasRoute.route('/cadenas/reduceStock')
    .post(reduceStock);

module.exports = cadenasRoute;
