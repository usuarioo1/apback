const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
    region: {
        type: String,
        required: true
    },
    address: { type: String },
    referencia: { type: String },
    rut: { type: String },
    phone: { type: String },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.generadorDeToken = function () {
    const payload = {
        id: this._id,
        username: this.username,
        role: this.role
    };
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '8h' });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
