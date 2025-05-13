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
    subirImagenProducto
} = require('../controllers/ProductosPuntoDeVentaController');

// Rutas básicas CRUD
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta')
    .get(obtenerProductosPuntoDeVenta)
    .post(crearProductoPuntoDeVenta);

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id')
    .get(obtenerProductoPuntoDeVentaPorId)
    .put(actualizarProductoPuntoDeVenta)
    .delete(eliminarProductoPuntoDeVenta);

// Ruta para reducir stock
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/reduceStock')
    .put(reducirStockProductoPuntoDeVenta);

// Ruta para carga masiva de imágenes
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/cargaMasiva/imagenes')
    .post(cargarImagenesMasiva);

// Nueva ruta para subir una imagen individual a un producto específico
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/subirImagen')
    .post(subirImagenProducto);

module.exports = ProductoPuntoDeVentaRouter;