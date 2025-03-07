const express = require('express');
const ProductoPuntoDeVentaRouter = express.Router();

const { crearProductoPuntoDeVenta,
    obtenerProductosPuntoDeVenta,
    obtenerProductoPuntoDeVentaPorId,
    actualizarProductoPuntoDeVenta,
    eliminarProductoPuntoDeVenta,
reducirStockProductoPuntoDeVenta } = require('../controllers/ProductosPuntoDeVentaController');

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta').get(obtenerProductosPuntoDeVenta).post(crearProductoPuntoDeVenta);
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id').get(obtenerProductoPuntoDeVentaPorId).put(actualizarProductoPuntoDeVenta).delete(eliminarProductoPuntoDeVenta);
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/reduceStock').put(reducirStockProductoPuntoDeVenta);

module.exports = ProductoPuntoDeVentaRouter;
