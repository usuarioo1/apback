require('dotenv').config();
const mongoose = require('mongoose');
const bdconection = require('../config/database');
const ProductoPuntoDeVenta = require('../models/productoPuntoDeVentaSchema');
const Venta = require('../models/ventaSchema');

const codigo = '713107849';

async function historialProducto() {
    await bdconection();

    try {
        const producto = await ProductoPuntoDeVenta.findOne({ codigo_de_barras: codigo });

        if (!producto) {
            console.log(`Producto con código ${codigo} no encontrado.`);
            return;
        }

        console.log('=== PRODUCTO ===');
        console.log(`ID: ${producto._id}`);
        console.log(`Nombre: ${producto.nombre}`);
        console.log(`Código: ${producto.codigo_de_barras}`);
        console.log(`Stock bodega: ${producto.stock}`);
        console.log(`Stock tienda: ${producto.stock_tienda}`);
        console.log(`En tienda: ${producto.en_tienda}`);
        console.log(`Tipo de joya: ${producto.tipo_de_joya}`);
        console.log('');

        const ventas = await Venta.find({ 'productos.codigo': codigo })
            .sort({ fecha: -1 })
            .populate('productos.producto', 'nombre codigo_de_barras');

        console.log(`=== VENTAS (${ventas.length}) ===`);
        if (ventas.length === 0) {
            console.log('No se encontraron ventas con este código.');
        } else {
            ventas.forEach((venta, index) => {
                const item = venta.productos.find(p => p.codigo === codigo);
                console.log(`\nVenta #${index + 1}`);
                console.log(`  Fecha: ${venta.fecha}`);
                console.log(`  Cantidad vendida: ${item?.cantidad || '-'}`);
                console.log(`  Tipo venta: ${item?.tipoVenta || '-'}`);
                console.log(`  Tipo pago: ${item?.tipoPago || '-'}`);
                console.log(`  N° boleta/factura: ${item?.numeroBoleta || '-'}`);
                console.log(`  Total venta: ${venta.total}`);
            });
        }
    } catch (error) {
        console.error('Error al consultar historial:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nConsulta finalizada');
    }
}

historialProducto();
