const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -salt'); // Excluir campos sensibles
        res.json({ success: true, message: 'Lista de usuarios', info: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
        console.error(error);
    }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password -salt'); // Excluir campos sensibles
        res.json({ success: true, message: 'Usuario encontrado', info: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Usuario no encontrado' });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const { username, email, password, ...otherFields } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            ...otherFields
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.SECRET, { expiresIn: '15m' });

        res.status(201).json({ 
            success: true, 
            message: 'Usuario creado', 
            info: newUser, 
            token 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
        console.error(error);
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Si la contraseña está presente, encriptarla
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password -salt');
        res.json({ success: true, message: 'Usuario actualizado', info: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
        console.error(error);
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
        console.error(error);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
