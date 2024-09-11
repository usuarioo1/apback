const Order = require('../models/orderSchema');

// Crear una nueva orden
const createOrder = async (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body;

        // Validar que el usuario y los items existen
        if (!userId || !items || !totalPrice) {
            return res.status(400).json({ success: false, message: 'Faltan datos en la solicitud' });
        }

        const newOrder = new Order({
            userId,
            items,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: 'Orden creada', info: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear la orden' });
        console.error(error);
    }
};

// Obtener todas las órdenes
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('items.productId');
        res.json({ success: true, message: 'Lista de órdenes', info: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener órdenes' });
        console.error(error);
    }
};

// Obtener una orden por ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('userId').populate('items.productId');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.json({ success: true, message: 'Orden encontrada', info: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la orden' });
        console.error(error);
    }
};

// Actualizar el estado de una orden
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
        res.json({ success: true, message: 'Orden actualizada', info: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la orden' });
        console.error(error);
    }
};

// Eliminar una orden
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);
        res.json({ success: true, message: 'Orden eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la orden' });
        console.error(error);
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder };
