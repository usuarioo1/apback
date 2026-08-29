const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const POS_ONLY_USERS = new Set(['vilmaalfaro@apback.local']);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Acceso denegado: se requiere rol admin' });
    }
    next();
};

const requireSalesAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }

    if (req.user.role === 'admin') {
        next();
        return;
    }

    try {
        const currentUser = await User.findById(req.user.id).select('email');

        if (currentUser && POS_ONLY_USERS.has(String(currentUser.email || '').trim().toLowerCase())) {
            next();
            return;
        }

        return res.status(403).json({ success: false, message: 'Acceso denegado: sin permisos para registrar ventas' });
    } catch (error) {
        console.error('Error validando permisos de venta:', error);
        return res.status(500).json({ success: false, message: 'No se pudieron validar los permisos del usuario' });
    }
};

module.exports = { verifyToken, requireAdmin, requireSalesAccess };
