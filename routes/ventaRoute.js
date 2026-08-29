const express = require('express');
const { registrarVenta, obtenerVentas, obtenerVentaPorId } = require('../controllers/ventaController');
const { verifyToken, requireAdmin, requireSalesAccess } = require('../middleware/auth');

const ventaRouter = express.Router();

ventaRouter.post('/registrar', verifyToken, requireSalesAccess, registrarVenta);
ventaRouter.get('/ventas', verifyToken, requireAdmin, obtenerVentas);
ventaRouter.get('/ventas/:id', verifyToken, requireAdmin, obtenerVentaPorId);

module.exports = ventaRouter;
