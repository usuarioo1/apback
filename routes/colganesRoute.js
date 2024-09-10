const express = require('express');

const { 
    getColgantes, 
    createColgante, 
    getColganteById, 
    updateColgante, 
    deleteColgante, 
    reduceStock 
} = require('../controllers/colgantesController');

const colgantesRoute = express.Router();

colgantesRoute.route('/colgantes')
    .get(getColgantes)
    .post(createColgante);

colgantesRoute.route('/colgantes/:id')
    .get(getColganteById)
    .put(updateColgante)
    .delete(deleteColgante);

colgantesRoute.route('/colgantes/reduceStock')
    .post(reduceStock);

module.exports = colgantesRoute;
