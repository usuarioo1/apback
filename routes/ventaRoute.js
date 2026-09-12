const express = require('express');
const { registrarVenta, obtenerVentas, obtenerVentaPorId, eliminarVenta } = require('../controllers/ventaController');
const { verifyToken, requireAdmin, requireSalesAccess } = require('../middleware/auth');

const ventaRouter = express.Router();

ventaRouter.post('/registrar', verifyToken, requireSalesAccess, registrarVenta);
ventaRouter.get('/ventas', verifyToken, requireAdmin, obtenerVentas);
ventaRouter.get('/ventas/:id', verifyToken, requireAdmin, obtenerVentaPorId);
ventaRouter.delete('/ventas/:id', verifyToken, requireAdmin, eliminarVenta);

module.exports = ventaRouter;
