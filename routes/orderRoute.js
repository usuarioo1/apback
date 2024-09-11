const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

const orderRoutes = express.Router();

orderRoutes.route('/orders')
    .post(createOrder)        // Crear una nueva orden
    .get(getOrders);          // Obtener todas las órdenes

orderRoutes.route('/orders/:id')
    .get(getOrderById)        // Obtener una orden por ID
    .put(updateOrderStatus)   // Actualizar el estado de una orden
    .delete(deleteOrder);     // Eliminar una orden

module.exports = orderRoutes;
