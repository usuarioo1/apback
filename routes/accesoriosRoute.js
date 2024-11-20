const express = require('express');

const { 
    getAccesorios, 
    createAccesorio, 
    getAccesorioById, 
    updateAccesorio, 
    deleteAccesorio, 
    reduceStock 
} = require('../controllers/accesoriosController');

const accesoriosRoute = express.Router();

accesoriosRoute.route('/accesorios')
    .get(getAccesorios)
    .post(createAccesorio);

accesoriosRoute.route('/accesorios/:id')
    .get(getAccesorioById)
    .put(updateAccesorio)
    .delete(deleteAccesorio);

accesoriosRoute.route('/accesorios/reduceStock')
    .post(reduceStock);

module.exports = accesoriosRoute;
