require('dotenv').config();
const mongoose = require('mongoose');
const bdconection = require('../config/database');
const ProductoPuntoDeVenta = require('../models/productoPuntoDeVentaSchema');
const Venta = require('../models/ventaSchema');

async function migrarEnTienda() {
    await bdconection();

    try {
        // 1. Productos que actualmente tienen stock en tienda
        const resultadoStock = await ProductoPuntoDeVenta.updateMany(
            { stock_tienda: { $gt: 0 } },
            { $set: { en_tienda: true } }
        );
        console.log(`Productos con stock_tienda > 0 marcados: ${resultadoStock.modifiedCount}`);

        // 2. Productos que aparecen en ventas (estuvieron en tienda aunque ahora tengan stock 0)
        const ventas = await Venta.find({}, { productos: 1 });
        const idsEnVentas = new Set();

        for (const venta of ventas) {
            for (const item of venta.productos || []) {
                const id = item.producto?.toString?.() || item.producto;
                if (id) idsEnVentas.add(id);
            }
        }

        if (idsEnVentas.size > 0) {
            const resultadoVentas = await ProductoPuntoDeVenta.updateMany(
                { _id: { $in: Array.from(idsEnVentas) } },
                { $set: { en_tienda: true } }
            );
            console.log(`Productos vendidos marcados como en_tienda: ${resultadoVentas.modifiedCount}`);
        } else {
            console.log('No se encontraron ventas previas');
        }

        // 3. Resumen final
        const totalEnTienda = await ProductoPuntoDeVenta.countDocuments({ en_tienda: true });
        console.log(`Total de productos marcados como en_tienda: ${totalEnTienda}`);
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Migración finalizada');
    }
}

migrarEnTienda();
