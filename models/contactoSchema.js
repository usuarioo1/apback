const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true },
    message: { type: String, required: true },
    phone:{type:Number}
});

const Contacto = mongoose.model('contacto', contactoSchema);

module.exports = Contacto;
