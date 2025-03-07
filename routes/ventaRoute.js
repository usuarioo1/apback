const express = require('express');
const { registrarVenta, obtenerVentas, obtenerVentaPorId } = require('../controllers/ventaController');

const ventaRouter = express.Router();   

ventaRouter.post('/registrar', registrarVenta);
ventaRouter.get('/ventas', obtenerVentas);
ventaRouter.get('/ventas/:id', obtenerVentaPorId);

module.exports = ventaRouter;