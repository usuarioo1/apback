const Order = require('../models/orderSchema');
const Anillos = require('../models/anillosSchema');
const Aros = require('../models/arosSchema');
const Colgantes = require('../models/colganteSchema');
const Collares = require('../models/collaresSchema');
const Conjuntos = require('../models/conjuntosSchema');
const Figuras = require('../models/figurasSchema');
const Pulseras = require('../models/pulserasSchema');
const Cadenas = require('../models/cadenasSchema');

// =========================
// GUARDAR ORDEN (sin descontar stock)
// =========================
const saveOrder = async (req, res) => {
    const { 
        nombre, email, telefono, rut, region, comuna, direccion, referencia, 
        cartItems, conFactura, total, costoEnvio, mercadoPagoId 
    } = req.body;

    try {
        // Crear nueva orden con estado "pendiente" y guardar mercadoPagoId
        const newOrder = new Order({
            nombre,
            email,
            telefono,
            rut,
            region,
            comuna,
            direccion,
            referencia,
            cartItems,
            conFactura,
            total,
            costoEnvio,
            mercadoPagoId,
            status: "pendiente"
        });

        await newOrder.save();

        res.status(200).json({ message: 'Orden creada exitosamente (pendiente de pago)', order: newOrder });
    } catch (error) {
        console.error('Error al guardar la orden:', error);
        res.status(500).json({ error: 'Error al guardar la orden' });
    }
};

// =========================
// CONFIRMAR ORDEN Y DESCONTAR STOCK (manual)
// =========================
const confirmOrderAndReduceStock = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        if (order.status === "pagada") return res.status(400).json({ message: 'La orden ya fue confirmada y pagada' });

        await descontarStock(order);
        order.status = "pagada";
        await order.save();

        res.status(200).json({ message: 'Orden confirmada y stock descontado', order });
    } catch (error) {
        console.error('Error al confirmar la orden:', error);
        res.status(500).json({ error: 'Error al confirmar la orden' });
    }
};

// =========================
// ACTUALIZAR ORDEN DESDE WEBHOOK MP
// =========================
const updateOrderStatusFromMP = async (req, res) => {
    const { orderId, mercadoPagoId, paymentStatus } = req.body;

    try {
        // Primero intentamos buscar por orderId (external_reference)
        let order = await Order.findById(orderId);
        
        // Si no encontramos por orderId, buscamos por mercadoPagoId como fallback
        if (!order) {
            order = await Order.findOne({ mercadoPagoId });
        }
        
        if (!order) {
            return res.status(404).json({ 
                message: 'Orden no encontrada',
                details: `OrderId: ${orderId}, MercadoPagoId: ${mercadoPagoId}`
            });
        }

        // Actualizamos el mercadoPagoId si no lo teníamos
        if (!order.mercadoPagoId && mercadoPagoId) {
            order.mercadoPagoId = mercadoPagoId;
        }

        if (paymentStatus === 'approved' && order.status !== 'pagada') {
            try {
                await descontarStock(order);
                order.status = 'pagada';
            } catch (stockError) {
                console.error('Error al descontar stock:', stockError);
                return res.status(400).json({ 
                    error: 'Error al descontar stock', 
                    message: stockError.message 
                });
            }
        } else if (paymentStatus === 'rejected') {
            order.status = 'rechazada';
        } else if (order.status !== 'pagada') { // No cambiar estado si ya está pagada
            order.status = 'pendiente';
        }

        await order.save();
        res.status(200).json({ 
            message: `Orden actualizada a ${order.status}`, 
            order 
        });
    } catch (error) {
        console.error('Error al actualizar estado desde MP:', error);
        res.status(500).json({ error: 'Error al actualizar estado desde MP' });
    }
};

// =========================
// Función auxiliar para descontar stock
// =========================
const descontarStock = async (order) => {
    for (const item of order.cartItems) {
        const modelos = [
            { model: Anillos, nombre: 'anillo' },
            { model: Aros, nombre: 'aro' },
            { model: Colgantes, nombre: 'colgante' },
            { model: Collares, nombre: 'collar' },
            { model: Conjuntos, nombre: 'conjunto' },
            { model: Figuras, nombre: 'figura' },
            { model: Pulseras, nombre: 'pulsera' },
            { model: Cadenas, nombre: 'cadena' }
        ];

        for (const { model, nombre } of modelos) {
            const producto = await model.findById(item._id);
            if (producto) {
                if (producto.stock < item.quantity) {
                    throw new Error(`No hay suficiente stock para ${nombre} ${producto.name}`);
                }
                producto.stock -= item.quantity;
                await producto.save();
            }
        }
    }
};

// =========================
// OBTENER TODAS LAS ÓRDENES
// =========================
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ message: 'Órdenes', info: orders });
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
};

// =========================
// OBTENER ORDEN POR ID
// =========================
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
};

// =========================
// ACTUALIZAR ORDEN
// =========================
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, rut, region, direccion, referencia, cartItems, total } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            nombre, email, telefono, rut, region, direccion, referencia, cartItems, total
        }, { new: true });

        if (!updatedOrder) return res.status(404).json({ message: 'Orden no encontrada' });
        res.status(200).json({ message: 'Orden actualizada exitosamente', order: updatedOrder });
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
};

// =========================
// ELIMINAR ORDEN
// =========================
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: 'Orden no encontrada' });
        res.status(200).json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
};

module.exports = {
    saveOrder,
    confirmOrderAndReduceStock,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatusFromMP
};