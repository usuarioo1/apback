const mongoose = require('mongoose');

const pulserasSchema = new mongoose.Schema({
    name: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    img: { type: String, required: true }
});

const Pulseras = mongoose.model('pulseras', pulserasSchema);

module.exports = Pulseras;
