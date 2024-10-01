const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name:{
        type:String,
        require:true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    salt: String, // Para guardar el salt generado al encriptar
    name: { 
        type: String 
    },
    region:{
        type:String,
        require:true
    },
    address: { 
        type: String 
    },
    referencia:{
        type:String
    },
    rut:{
        type:String
    },
    phone: { 
        type: String 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
});

// Método para encriptar la contraseña
userSchema.methods.encriptarPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex'); // Genera un salt único
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex'); // Encripta la contraseña
};

// Método para validar la contraseña
userSchema.methods.validarPassword = function (password) {
    const encriptado = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === encriptado;
};

// Método para generar un token JWT
userSchema.methods.generadorDeToken = function () {
    const payload = {
        id: this._id,
        username: this.username,
        role: this.role
    };
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' }); // Genera el token con un tiempo de expiración
};

const User = mongoose.model('User', userSchema);

module.exports = User;
