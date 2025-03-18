const ProductoPuntoDeVenta = require("../models/productoPuntoDeVentaSchema");

// Crear un nuevo producto
const crearProductoPuntoDeVenta = async (req, res) => {
    try {
        const { nombre, costo, tarifa_publica, mayorista, preferentes, interno, metal, prod_nac_imp, taller_externa, importado, tipo_de_joya, codigo_de_barras, stock, imagen, caja } = req.body;

        const nuevoProducto = new ProductoPuntoDeVenta({
            nombre,
            costo,
            tarifa_publica,
            mayorista,
            preferentes,
            interno,
            metal,
            prod_nac_imp,
            taller_externa,
            importado,
            tipo_de_joya,
            codigo_de_barras: codigo_de_barras, // Asegúrate de que el nombre coincida con el esquema
            stock,
            imagen,
            caja
        });

        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto", detalle: error.message });
    }
};

// Obtener todos los productos
const obtenerProductosPuntoDeVenta = async (req, res) => {
    try {
        const productos = await ProductoPuntoDeVenta.find();
        res.status(200).json({ message: "Lista de productos", productos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos", detalle: error.message });
    }
};

// Obtener un producto por ID
const obtenerProductoPuntoDeVentaPorId = async (req, res) => {
    try {
        const producto = await ProductoPuntoDeVenta.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto", detalle: error.message });
    }
};

// Actualizar un producto
const actualizarProductoPuntoDeVenta = async (req, res) => {
    try {
        const { nombre, costo, tarifa_publica, mayorista, preferentes, interno, metal, prod_nac_imp, taller_externa, importado, tipo_de_joya, codigo_de_barras, imagen,caja } = req.body;

        const productoActualizado = await ProductoPuntoDeVenta.findByIdAndUpdate(
            req.params.id,
            { nombre, costo, tarifa_publica, mayorista, preferentes, interno, metal, prod_nac_imp, taller_externa, importado, tipo_de_joya, codigo_de_barras: codigo_de_barras, stock, imagen, caja },
            { new: true }
        );

        if (!productoActualizado) return res.status(404).json({ error: "Producto no encontrado" });

        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto", detalle: error.message });
    }
};

// Eliminar un producto
const eliminarProductoPuntoDeVenta = async (req, res) => {
    try {
        const productoEliminado = await ProductoPuntoDeVenta.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).json({ error: "Producto no encontrado" });

        res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto", detalle: error.message });
    }
};

// Reducir stock de un producto
const reducirStockProductoPuntoDeVenta = async (req, res) => {
    try {
        const { cantidad } = req.body;
        const producto = await ProductoPuntoDeVenta.findById(req.params.id);

        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        if (producto.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        producto.stock -= cantidad;
        await producto.save();

        res.status(200).json({ mensaje: "Stock actualizado correctamente", producto });
    } catch (error) {
        res.status(500).json({ error: "Error al reducir el stock", detalle: error.message });
    }
};

module.exports = {
    crearProductoPuntoDeVenta,
    obtenerProductosPuntoDeVenta,
    obtenerProductoPuntoDeVentaPorId,
    actualizarProductoPuntoDeVenta,
    eliminarProductoPuntoDeVenta,
    reducirStockProductoPuntoDeVenta
};