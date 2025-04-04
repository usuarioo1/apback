const express = require('express');
const ProductoPuntoDeVentaRouter = express.Router();

const { 
  crearProductoPuntoDeVenta,
  obtenerProductosPuntoDeVenta,
  obtenerProductoPuntoDeVentaPorId,
  actualizarProductoPuntoDeVenta,
  eliminarProductoPuntoDeVenta,
  reducirStockProductoPuntoDeVenta,
  cargarImagenesMasiva
} = require('../controllers/ProductosPuntoDeVentaController');

ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta').get(obtenerProductosPuntoDeVenta).post(crearProductoPuntoDeVenta);
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id').get(obtenerProductoPuntoDeVentaPorId).put(actualizarProductoPuntoDeVenta).delete(eliminarProductoPuntoDeVenta);
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/:id/reduceStock').put(reducirStockProductoPuntoDeVenta);

// Nueva ruta para carga masiva de imágenes
ProductoPuntoDeVentaRouter.route('/productosPuntoDeVenta/cargaMasiva/imagenes').post(cargarImagenesMasiva);

module.exports = ProductoPuntoDeVentaRouter;