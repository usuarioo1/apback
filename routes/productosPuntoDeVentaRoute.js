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

// ✅ RUTAS ESPECÍFICAS PRIMERO (antes que las rutas con parámetros)

// Ruta para descuento masivo de stock
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/descontarStockMasivo')
    .put(descontarStockMasivo);

// Ruta para carga masiva de imágenes
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/cargaMasiva/imagenes')
    .post(cargarImagenesMasiva);

// ✅ RUTAS BÁSICAS CRUD
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta')
    .get(obtenerProductosPuntoDeVenta)
    .post(crearProductoPuntoDeVenta);

// ✅ RUTAS CON PARÁMETROS AL FINAL (después de las rutas específicas)
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id')
    .get(obtenerProductoPuntoDeVentaPorId)
    .put(actualizarProductoPuntoDeVenta)
    .delete(eliminarProductoPuntoDeVenta);

// Ruta para reducir stock individual
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/reduceStock')
    .put(reducirStockProductoPuntoDeVenta);

// Ruta para subir una imagen individual a un producto específico
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/subirImagen')
    .post(subirImagenProducto);

module.exports = ProductoPuntoDeVentaRouter;