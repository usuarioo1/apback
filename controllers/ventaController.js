const Venta = require('../models/ventaSchema');

const registrarVenta = async (req, res) => {
    try {
        console.log("Recibiendo venta:", req.body); // DEBUG

        const { productos, total } = req.body;
        if (!productos || productos.length === 0) return res.status(400).json({ error: "No hay productos en la venta" });

        const nuevaVenta = new Venta({ productos, total });
        await nuevaVenta.save();

        res.status(201).json({ mensaje: "Venta registrada con éxito", venta: nuevaVenta });
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
};




const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate("productos.producto");
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

const obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id).populate("productos.producto");
        if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la venta" });
    }
};

module.exports = { registrarVenta, obtenerVentas, obtenerVentaPorId };
