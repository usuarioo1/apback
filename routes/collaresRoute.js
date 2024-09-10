const express = require('express');

const { 
    getCollares, 
    createCollar, 
    getCollarById, 
    updateCollar, 
    deleteCollar, 
    reduceStock 
} = require('../controllers/collaresController');

const collaresRoute = express.Router();

collaresRoute.route('/collares')
    .get(getCollares)
    .post(createCollar);

collaresRoute.route('/collares/:id')
    .get(getCollarById)
    .put(updateCollar)
    .delete(deleteCollar);

collaresRoute.route('/collares/reduceStock')
    .post(reduceStock);

module.exports = collaresRoute;
