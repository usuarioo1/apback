const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true },
    message: { type: String, required: true },
    phone:{type:Number , require: true},
    date:{type:Date, default:Date.now}
});

const Contacto = mongoose.model('contactos', contactoSchema);

module.exports = Contacto;
