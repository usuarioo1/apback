const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: false },
    rut: { type: String, required: true },
    region: { type: String, required: true },
    direccion: { type: String, required: true },
    referencia: { type: String, required: false },
    cartItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            precio: { type: Number, required: true }
        }
    ],
    
    total: { type: Number, required: true },
    costoEnvio:{type: Number, require:true},
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
