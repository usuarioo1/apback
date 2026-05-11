const mongoose = require('mongoose');

const collaresSchema = new mongoose.Schema({
    name: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    precio_por_mayor: { type: Number, required: false },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    img: { type: String, required: true }
});

const Collares = mongoose.model('collares', collaresSchema);

module.exports = Collares;
