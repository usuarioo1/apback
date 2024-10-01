const express = require('express');

const { 
    saveOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder 
} = require('../controllers/orderController');

const orderRoute = express.Router();

orderRoute.route('/save_order')
    .get(getAllOrders) // Obtener todas las órdenes
    .post(saveOrder);  // Crear una nueva orden

orderRoute.route('/orders/:id')
    .get(getOrderById)  // Obtener una orden específica por ID
    .put(updateOrder)    // Actualizar una orden específica por ID
    .delete(deleteOrder); // Eliminar una orden específica por ID

module.exports = orderRoute;
