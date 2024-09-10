const mongoose = require('mongoose');

const conjuntosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    img: { type: String, required: true }
});

const Conjuntos = mongoose.model('conjuntos', conjuntosSchema);

module.exports = Conjuntos;
