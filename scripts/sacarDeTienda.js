require('dotenv').config();
const mongoose = require('mongoose');
const bdconection = require('../config/database');
const ProductoPuntoDeVenta = require('../models/productoPuntoDeVentaSchema');

const codigos = [
    '944827209'
];

async function sacarDeTienda() {
    await bdconection();

    try {
        const resultado = await ProductoPuntoDeVenta.updateMany(
            { codigo_de_barras: { $in: codigos } },
            { $set: { en_tienda: false } }
        );

        console.log(`Productos encontrados: ${resultado.matchedCount}`);
        console.log(`Productos modificados: ${resultado.modifiedCount}`);

        if (resultado.matchedCount < codigos.length) {
            const encontrados = await ProductoPuntoDeVenta.find(
                { codigo_de_barras: { $in: codigos } },
                { codigo_de_barras: 1, nombre: 1 }
            );
            const encontradosSet = new Set(encontrados.map(p => p.codigo_de_barras));
            const noEncontrados = codigos.filter(c => !encontradosSet.has(c));
            console.log('Códigos no encontrados:', noEncontrados);
        }
    } catch (error) {
        console.error('Error al actualizar productos:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Proceso finalizado');
    }
}

sacarDeTienda();
