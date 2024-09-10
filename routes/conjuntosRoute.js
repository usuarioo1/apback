const express = require('express');

const { 
    getConjuntos, 
    createConjunto, 
    getConjuntoById, 
    updateConjunto, 
    deleteConjunto, 
    reduceStock 
} = require('../controllers/conjuntosController');

const conjuntosRoute = express.Router();

conjuntosRoute.route('/conjuntos')
    .get(getConjuntos)
    .post(createConjunto);

conjuntosRoute.route('/conjuntos/:id')
    .get(getConjuntoById)
    .put(updateConjunto)
    .delete(deleteConjunto);

conjuntosRoute.route('/conjuntos/reduceStock')
    .post(reduceStock);

module.exports = conjuntosRoute;
