const express = require('express');

const { 
    getConjuntos, 
    createConjunto, 
    getConjuntoById, 
    updateConjunto, 
    deleteConjunto, 
    reduceStock,
    subirImagenConjunto 
} = require('../controllers/conjuntosController');

const conjuntosRoute = express.Router();

conjuntosRoute.route('/conjuntos')
    .get(getConjuntos)
    .post(createConjunto);

conjuntosRoute.route('/conjuntos/:id')
    .get(getConjuntoById)
    .put(updateConjunto)
    .delete(deleteConjunto);

// Ruta para subir imagen a un conjunto específico
conjuntosRoute.route('/conjuntos/:id/imagen')
    .post(subirImagenConjunto);
    

conjuntosRoute.route('/conjuntos/reduceStock')
    .post(reduceStock);

module.exports = conjuntosRoute;
