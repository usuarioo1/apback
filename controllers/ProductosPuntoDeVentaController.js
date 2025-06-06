const ProductoPuntoDeVenta = require("../models/productoPuntoDeVentaSchema");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configurar multer para almacenamiento temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../temp/uploads');
        // Asegurarse de que el directorio existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }).array('images', 50);
const uploadSingle = multer({ storage }).single('imagen');

// Función para manejar la carga de una imagen individual para un producto específico
const subirImagenProducto = async (req, res) => {
    uploadSingle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Error al cargar el archivo",
                detalle: err.message
            });
        } else if (err) {
            return res.status(500).json({
                error: "Error en el servidor",
                detalle: err.message
            });
        }

        // Si no hay archivo
        if (!req.file) {
            return res.status(400).json({
                error: "No se ha cargado ningún archivo"
            });
        }

        try {
            const productoId = req.params.id;
            
            // Buscar el producto por ID
            const producto = await ProductoPuntoDeVenta.findById(productoId);
            
            if (!producto) {
                // Eliminar archivo temporal
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            // Generar un nombre de archivo único usando el código de barras del producto (si existe) o el ID
            const fileId = producto.codigo_de_barras || productoId;
            
            // Subir imagen a Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'productos_punto_venta',
                public_id: fileId
            });

            // Actualizar producto con la URL de la imagen
            producto.imagen = cloudinaryResult.secure_url;
            await producto.save();

            // Eliminar archivo temporal
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(200).json({
                message: "Imagen subida correctamente",
                imageUrl: cloudinaryResult.secure_url,
                producto: {
                    id: producto._id,
                    nombre: producto.nombre
                }
            });
        } catch (error) {
            console.error(`Error al procesar la imagen:`, error);
            
            // Intentar eliminar el archivo temporal si existe
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({
                error: "Error al procesar la imagen",
                detalle: error.message
            });
        }
    });
};

// Función para manejar la carga masiva de imágenes
const cargarImagenesMasiva = async (req, res) => {
    // Usar multer para procesar los archivos
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Error al cargar archivos",
                detalle: err.message
            });
        } else if (err) {
            return res.status(500).json({
                error: "Error en el servidor",
                detalle: err.message
            });
        }

        // Si no hay archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No se han cargado archivos"
            });
        }

        const results = [];

        // Procesar cada archivo
        for (const file of req.files) {
            try {
                // Extraer código de barras del nombre del archivo
                const codigoBarras = file.originalname.split('.')[0];

                // Buscar el producto por código de barras
                const producto = await ProductoPuntoDeVenta.findOne({
                    codigo_de_barras: codigoBarras
                });

                if (!producto) {
                    results.push({
                        filename: file.originalname,
                        success: false,
                        error: `Producto con código de barras ${codigoBarras} no encontrado`
                    });
                    continue;
                }

                // Subir imagen a Cloudinary
                const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'productos_punto_venta',
                    public_id: codigoBarras
                });

                // Actualizar producto con la URL de la imagen
                producto.imagen = cloudinaryResult.secure_url;
                await producto.save();

                // Eliminar archivo temporal
                fs.unlinkSync(file.path);

                results.push({
                    filename: file.originalname,
                    success: true,
                    productName: producto.nombre,
                    imageUrl: cloudinaryResult.secure_url
                });
            } catch (error) {
                console.error(`Error al procesar archivo ${file.originalname}:`, error);
                results.push({
                    filename: file.originalname,
                    success: false,
                    error: error.message
                });

                // Intentar eliminar el archivo temporal si existe
                if (file.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        res.status(200).json({
            message: "Proceso de carga completado",
            results
        });
    });
};

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
        const { nombre, costo, tarifa_publica, mayorista, preferentes, interno, metal, prod_nac_imp, taller_externa, importado, tipo_de_joya, codigo_de_barras, stock, imagen, caja } = req.body;

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

const descontarStockMasivo = async (req, res) => {
    try {
        const { productos } = req.body; // Array de { id, cantidad }
        
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ 
                error: "Se requiere un array de productos con id y cantidad" 
            });
        }

        const resultados = [];
        const errores = [];

        // Procesar cada producto
        for (const item of productos) {
            try {
                const { id, cantidad } = item;
                
                if (!id || !cantidad || cantidad <= 0) {
                    errores.push({
                        id: id || 'ID no proporcionado',
                        error: 'ID o cantidad inválidos'
                    });
                    continue;
                }

                const producto = await ProductoPuntoDeVenta.findById(id);
                
                if (!producto) {
                    errores.push({
                        id,
                        error: 'Producto no encontrado'
                    });
                    continue;
                }

                if (producto.stock < cantidad) {
                    errores.push({
                        id,
                        nombre: producto.nombre,
                        error: `Stock insuficiente. Stock actual: ${producto.stock}, cantidad solicitada: ${cantidad}`
                    });
                    continue;
                }

                // Actualizar stock
                producto.stock -= cantidad;
                await producto.save();

                resultados.push({
                    id,
                    nombre: producto.nombre,
                    cantidadDescontada: cantidad,
                    stockAnterior: producto.stock + cantidad,
                    stockActual: producto.stock
                });

            } catch (error) {
                errores.push({
                    id: item.id || 'ID no disponible',
                    error: error.message
                });
            }
        }

        res.status(200).json({
            mensaje: "Proceso de descuento de stock completado",
            exitosos: resultados,
            errores: errores,
            totalProcesados: productos.length,
            totalExitosos: resultados.length,
            totalErrores: errores.length
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error al descontar stock masivo", 
            detalle: error.message 
        });
    }
};

module.exports = {
    crearProductoPuntoDeVenta,
    obtenerProductosPuntoDeVenta,
    obtenerProductoPuntoDeVentaPorId,
    actualizarProductoPuntoDeVenta,
    eliminarProductoPuntoDeVenta,
    reducirStockProductoPuntoDeVenta,
    cargarImagenesMasiva,
    subirImagenProducto,
    descontarStockMasivo
};