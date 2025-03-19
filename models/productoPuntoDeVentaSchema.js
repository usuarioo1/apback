const mongoose = require('mongoose');

const productoPuntoDeVentaSchema = new mongoose.Schema({
    nombre: { type: String, required: false },
    costo: { type: Number, required: false },
    tarifa_publica: { type: Number, required: false },
    mayorista: { type: Number, required: false },
    preferentes: { type: Number, required: false },
    interno: { type: String, required: false },
    metal: { type: String, required: false },
    prod_nac_imp: { type: String, required: false },
    taller_externa: { type: String, required: false },
    importado: { type: String, required: false },
    tipo_de_joya: { type: String, required: false },
    codigo_de_barras: { type: String, required: false, unique: true },
    stock: { type: Number, required: false },
    imagen: { type: String, required: false },
    caja: { type: String, required: false },
    date: { type: Date, default: Date.now }
});

const ProductoPuntoDeVenta = mongoose.model('productosPuntoDeVenta', productoPuntoDeVentaSchema);

module.exports = ProductoPuntoDeVenta;
