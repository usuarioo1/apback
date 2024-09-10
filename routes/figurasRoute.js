const express = require('express');

const { 
    getFiguras, 
    createFigura, 
    getFiguraById, 
    updateFigura, 
    deleteFigura, 
    reduceStock 
} = require('../controllers/figurasController');

const figurasRoute = express.Router();

figurasRoute.route('/figuras')
    .get(getFiguras)
    .post(createFigura);

figurasRoute.route('/figuras/:id')
    .get(getFiguraById)
    .put(updateFigura)
    .delete(deleteFigura);

figurasRoute.route('/figuras/reduceStock')
    .post(reduceStock);

module.exports = figurasRoute;
