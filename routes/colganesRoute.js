const express = require('express');

const { 
    getColgantes, 
    createColgante, 
    getColganteById, 
    updateColgante, 
    deleteColgante, 
    reduceStock,
    subirImagenColgante
} = require('../controllers/colgantesController');

const colgantesRoute = express.Router();

colgantesRoute.route('/colgantes')
    .get(getColgantes)
    .post(createColgante);

colgantesRoute.route('/colgantes/:id')
    .get(getColganteById)
    .put(updateColgante)
    .delete(deleteColgante);

// Ruta para subir imagen a un colgante específico
colgantesRoute.route('/colgantes/:id/imagen')
    .post(subirImagenColgante);

colgantesRoute.route('/colgantes/reduceStock')
    .post(reduceStock);

module.exports = colgantesRoute;
