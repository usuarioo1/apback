const Order = require('../models/orderSchema')

// Controlador para guardar una nueva orden
const saveOrder = async (req, res) => {
    const { nombre, email, telefono, rut, region, direccion, referencia, cartItems, total } = req.body;

    try {
        // Crear nueva orden
        const newOrder = new Order({
            nombre,
            email,
            telefono,
            rut,
            region,
            direccion,
            referencia,
            cartItems,
            total
        });

        // Guardar en la base de datos
        await newOrder.save();

        res.status(200).json({ message: 'Orden guardada exitosamente', order: newOrder });
    } catch (error) {
        console.error('Error al guardar la orden:', error);
        res.status(500).json({ error: 'Error al guardar la orden' });
    }
};

// Controlador para obtener todas las órdenes
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({message:'ordenes',
            info:orders
        } );
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
};

// Controlador para obtener una orden por ID
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
};

// Controlador para actualizar una orden
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, rut, region, direccion, referencia, cartItems, total } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            nombre,
            email,
            telefono,
            rut,
            region,
            direccion,
            referencia,
            cartItems,
            total
        }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json({ message: 'Orden actualizada exitosamente', order: updatedOrder });
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
};

// Controlador para eliminar una orden
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
};

module.exports = {
    saveOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
