const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, message: 'Lista de usuarios', info: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
        console.error(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        res.json({ success: true, message: 'Usuario encontrado', info: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Usuario no encontrado' });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password, ...otherFields } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'username, email y password son requeridos' });
        }
        const existe = await User.findOne({ $or: [{ email }, { username }] });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Email o username ya registrado' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            ...otherFields
        });
        await newUser.save();
        const token = newUser.generadorDeToken();
        const { password: _, ...userSafe } = newUser.toObject();
        res.status(201).json({
            success: true,
            message: 'Usuario creado',
            info: userSafe,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
        console.error(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'email y password son requeridos' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        const token = user.generadorDeToken();
        const { password: _, ...userSafe } = user.toObject();
        res.json({
            success: true,
            message: 'Login exitoso',
            info: userSafe,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
        console.error(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');
        res.json({ success: true, message: 'Usuario actualizado', info: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
        console.error(error);
    }
};

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

module.exports = { getUsers, getUserById, createUser, loginUser, updateUser, deleteUser };
