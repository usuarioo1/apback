const Venta = require('../models/ventaSchema');
const ProductoPuntoDeVenta = require('../models/productoPuntoDeVentaSchema');
const { logResumenDescuentoStock } = require('../utils/logStock');

const stockComoNumero = (valor) => {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : 0;
};

const cantidadPositiva = (valor) => {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero <= 0) {
        return null;
    }
    return numero;
};

const registrarVenta = async (req, res) => {
    try {
        console.log("Recibiendo venta:", req.body); // DEBUG

        const { productos, total } = req.body;
        if (!productos || productos.length === 0) return res.status(400).json({ error: "No hay productos en la venta" });

        const cantidadesPorProducto = new Map();

        for (const item of productos) {
            const productoId = String(item?.producto || '').trim();
            const cantidad = cantidadPositiva(item?.cantidad);

            if (!productoId || !cantidad) {
                return res.status(400).json({ error: "Cada producto debe incluir un id y una cantidad válida" });
            }

            cantidadesPorProducto.set(
                productoId,
                (cantidadesPorProducto.get(productoId) || 0) + cantidad
            );
        }

        const nuevaVenta = new Venta({ productos, total });
        await nuevaVenta.validate();

        const productosActualizados = [];

        for (const [productoId, cantidad] of cantidadesPorProducto.entries()) {
            const producto = await ProductoPuntoDeVenta.findById(productoId);

            if (!producto) {
                return res.status(404).json({ error: `Producto no encontrado: ${productoId}` });
            }

            const stockTiendaActual = stockComoNumero(producto.stock_tienda);

            if (stockTiendaActual < cantidad) {
                return res.status(400).json({
                    error: `Stock de tienda insuficiente para ${producto.nombre}. Stock actual: ${stockTiendaActual}, cantidad solicitada: ${cantidad}`
                });
            }

            productosActualizados.push({ producto, cantidad, stockTiendaActual });
        }

        for (const item of productosActualizados) {
            item.producto.stock_tienda = item.stockTiendaActual - item.cantidad;
            await item.producto.save();
        }

        logResumenDescuentoStock('Venta en tienda (stock_tienda)', productosActualizados.map((item) => ({
            codigo: item.producto.codigo_de_barras,
            stockAnterior: item.stockTiendaActual,
            descontado: item.cantidad,
            restante: item.producto.stock_tienda
        })));

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
