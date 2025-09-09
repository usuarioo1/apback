const express = require('express');

const { 
    getCollares, 
    createCollar, 
    getCollarById, 
    updateCollar, 
    deleteCollar, 
    reduceStock,
    subirImagenCollar
} = require('../controllers/collaresController');

const collaresRoute = express.Router();

collaresRoute.route('/collares')
    .get(getCollares)
    .post(createCollar);

// Ruta para reducir stock debe ir antes de las rutas con parámetros
collaresRoute.route('/collares/reduceStock')
    .post(reduceStock);

collaresRoute.route('/collares/:id')
    .get(getCollarById)
    .put(updateCollar)
    .delete(deleteCollar);

// Ruta para subir imagen a un collar específico
collaresRoute.route('/collares/:id/imagen')
    .post(subirImagenCollar);

module.exports = collaresRoute;
