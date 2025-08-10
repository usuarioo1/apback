const express = require('express');
const { 
    saveOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder,
    confirmOrderAndReduceStock,
    updateOrderStatusFromMP
} = require('../controllers/orderController');

const orderRoute = express.Router();

// Crear y listar órdenes
orderRoute.route('/save_order')
    .get(getAllOrders) 
    .post(saveOrder);

// Obtener, actualizar y eliminar orden por ID
orderRoute.route('/orders/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

// Confirmar manualmente y descontar stock
orderRoute.post('/orders/:id/confirm', confirmOrderAndReduceStock);

// Endpoint para actualizar orden desde webhook de MP
orderRoute.post('/update_order_status', updateOrderStatusFromMP);

module.exports = orderRoute;
