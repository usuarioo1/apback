const Order = require('../models/orderSchema');
const Anillos = require('../models/anillosSchema'); // Asegúrate de importar tu modelo de anillos
const Aros = require('../models/arosSchema')
const Colgantes = require('../models/colganteSchema')
const Collares = require('../models/collaresSchema')
const Conjuntos = require('../models/conjuntosSchema')
const Figuras = require('../models/figurasSchema')
const Pulseras = require('../models/pulserasSchema')
const Cadenas = require('../models/cadenasSchema')

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
            total,
            costoEnvio
        });

        // Reducir el stock de los anillos en el carrito
        // Procesar anillos
        for (const item of cartItems) {
            const anillo = await Anillos.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (anillo) {
                // Verificar que haya suficiente stock
                if (anillo.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para la oferta ${anillo.name}` });
                }

                // Reducir el stock
                anillo.stock -= item.quantity;
                await anillo.save(); // Guardar el nuevo stock
            }
        }

        // Procesar aros
        for (const item of cartItems) {
            const aro = await Aros.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (aro) {
                // Verificar que haya suficiente stock
                if (aro.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para el aro ${aro.name}` });
                }

                // Reducir el stock
                aro.stock -= item.quantity;
                await aro.save(); // Guardar el nuevo stock
            }
        }

        // Procesar colgantes
        for (const item of cartItems) {
            const colgante = await Colgantes.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (colgante) {
                // Verificar que haya suficiente stock
                if (colgante.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para el colgante ${colgante.name}` });
                }

                // Reducir el stock
                colgante.stock -= item.quantity;
                await colgante.save(); // Guardar el nuevo stock
            }
        }

        // Procesar collares
        for (const item of cartItems) {
            const collar = await Collares.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (collar) {
                // Verificar que haya suficiente stock
                if (collar.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para el collar ${collar.name}` });
                }

                // Reducir el stock
                collar.stock -= item.quantity;
                await collar.save(); // Guardar el nuevo stock
            }
        }

        // Procesar conjuntos
        for (const item of cartItems) {
            const conjunto = await Conjuntos.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (conjunto) {
                // Verificar que haya suficiente stock
                if (conjunto.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para el conjunto ${conjunto.name}` });
                }

                // Reducir el stock
                conjunto.stock -= item.quantity;
                await conjunto.save(); // Guardar el nuevo stock
            }
        }

        // Procesar figuras
        for (const item of cartItems) {
            const figura = await Figuras.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (figura) {
                // Verificar que haya suficiente stock
                if (figura.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para la figura ${figura.name}` });
                }

                // Reducir el stock
                figura.stock -= item.quantity;
                await figura.save(); // Guardar el nuevo stock
            }
        }

        // Procesar pulseras
        for (const item of cartItems) {
            const pulsera = await Pulseras.findById(item._id); // Suponiendo que cada item tiene _id y quantity

            if (pulsera) {
                // Verificar que haya suficiente stock
                if (pulsera.stock < item.quantity) {
                    return res.status(400).json({ error: `No hay suficiente stock para la pulsera ${pulsera.name}` });
                }

                // Reducir el stock
                pulsera.stock -= item.quantity;
                await pulsera.save(); // Guardar el nuevo stock
            }
        }

        //procesar cadenas

        for(const item of cartItems){
            const cadena = await Cadenas.findById(item._id);

            if(cadena){
                if(cadena.stock < item.quantity){
                    return res.status(400).json({error: `no hay suficiente stock para cadena ${cadena.name}`})
                }

                //reduce stock
                cadena.stock -= item.quantity;
                await cadena.save();
            }
        }


        // Guardar la nueva orden en la base de datos
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
        res.status(200).json({
            message: 'Órdenes',
            info: orders
        });
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
