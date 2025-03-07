const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'productosPuntoDeVenta', required: true },
            cantidad: { type: Number, required: true },
            nombre: { type: String, required: true },  // Nuevo campo
            codigo: { type: String, required: true },   // Nuevo campo
            tipoVenta: { type: String, required: true }, // Nuevo campo
            tipoPago: { type: String, required: true }, // Nuevo campo
            numeroBoleta: { type: String, required: true }, // Nuevo campo
        }
    ],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;
