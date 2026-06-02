const express = require('express');
const ProductoPuntoDeVentaRouter = express.Router();
const {
    crearProductoPuntoDeVenta,
    obtenerProductosPuntoDeVenta,
    obtenerProductoPuntoDeVentaPorId,
    actualizarProductoPuntoDeVenta,
    eliminarProductoPuntoDeVenta,
    reducirStockProductoPuntoDeVenta,
    cargarImagenesMasiva,
    subirImagenProducto,
    descontarStockMasivo
} = require('../controllers/ProductosPuntoDeVentaController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

ProductoPuntoDeVentaRouter.use(verifyToken);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/descontarStockMasivo')
    .put(requireAdmin, descontarStockMasivo);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/cargaMasiva/imagenes')
    .post(requireAdmin, cargarImagenesMasiva);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta')
    .get(obtenerProductosPuntoDeVenta)
    .post(requireAdmin, crearProductoPuntoDeVenta);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id')
    .get(obtenerProductoPuntoDeVentaPorId)
    .put(requireAdmin, actualizarProductoPuntoDeVenta)
    .delete(requireAdmin, eliminarProductoPuntoDeVenta);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/reduceStock')
    .put(requireAdmin, reducirStockProductoPuntoDeVenta);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/subirImagen')
    .post(requireAdmin, subirImagenProducto);

module.exports = ProductoPuntoDeVentaRouter;
