const mongoose = require('mongoose');
const { image } = require('../config/cloudinary');

const orderSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: false },
    rut: { type: String, required: true },
    region: { type: String, required: true },
    comuna: { type: String, required: true },
    direccion: { type: String, required: true },
    referencia: { type: String, required: false },
    cartItems: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID del producto para stock
            name: { type: String, required: true },
            codigo: { type: String, required: false },
            img: { type: String, required: false },
            quantity: { type: Number, required: true },
            precio: { type: Number, required: true }
        }
    ],
    conFactura: [
        {
            razonSocial: { type: String, required: false },
            rutEmpresa: { type: String, required: false },
            direccionEmpresa: { type: String, required: false },
            comunaEmpresa: { type: String, required: false },
            giroEmpresa: { type: String, required: false },
            regionEmpresa: { type: String, required: false },

        },


    ],

    total: { type: Number, required: true },
    costoEnvio: { type: Number, required: true },

    mercadoPagoId: { type: String }, // Para relacionar con Mercado Pago
    status: { type: String, enum: ['pendiente', 'pagada', 'rechazada'], default: 'pendiente' },
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
