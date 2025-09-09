const Accesorios = require('../models/accesoriosSchema');
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

// Función para manejar la carga de una imagen para un accesorio específico
const subirImagenAccesorio = async (req, res) => {
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

        if (!req.file) {
            return res.status(400).json({
                error: "No se ha cargado ningún archivo"
            });
        }

        try {
            const accesorioId = req.params.id;
            const accesorio = await Accesorios.findById(accesorioId);
            
            if (!accesorio) {
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ error: "Accesorio no encontrado" });
            }

            // Generar un nombre de archivo único usando el código del accesorio
            const fileId = accesorio.codigo || accesorioId;
            
            // Subir imagen a Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'accesorios',
                public_id: fileId
            });

            // Actualizar accesorio con la URL de la imagen
            accesorio.img = cloudinaryResult.secure_url;
            await accesorio.save();

            // Eliminar archivo temporal
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(200).json({
                message: "Imagen subida correctamente",
                imageUrl: cloudinaryResult.secure_url,
                accesorio: {
                    id: accesorio._id,
                    name: accesorio.name
                }
            });
        } catch (error) {
            console.error(`Error al procesar la imagen:`, error);
            
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

const getAccesorios = async (req, res) => {
    try {
        const accesorios = await Accesorios.find();
        res.json({
            success: true,
            message: 'Acá está la lista de Accesorios',
            info: accesorios
        });
    } catch (error) {
        res.json({ success: false, message: 'Info no encontrada' });
        console.error(error);
    }
}

const getAccesorioById = async (req, res) => {
    try {
        const { id } = req.params;
        const accesorioById = await Accesorios.findById(id);
        res.json({ success: true, message: 'Producto solicitado', info: accesorioById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Producto no encontrado' });
    }
}

const createAccesorio = async (req, res) => {
    uploadSingle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: "Error al cargar el archivo",
                error: err.message
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: "Error en el servidor",
                error: err.message
            });
        }

        try {
            // Validar que se haya enviado una imagen
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "La imagen es requerida"
                });
            }

            // Validar campos requeridos
            const { name, descripcion, precio, codigo, stock } = req.body;
            if (!name || !descripcion || !precio || !codigo || !stock) {
                // Eliminar archivo temporal si existe
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Todos los campos son requeridos"
                });
            }

            // Subir imagen a Cloudinary
            const fileId = req.body.codigo || Date.now().toString();
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'accesorios',
                public_id: fileId
            });

            // Crear el producto con todos los datos
            const newProduct = new Accesorios({
                name,
                descripcion,
                precio: Number(precio),
                codigo,
                stock: Number(stock),
                img: cloudinaryResult.secure_url
            });

            await newProduct.save();

            // Eliminar archivo temporal
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                info: {
                    ...newProduct._doc,
                    imageUrl: cloudinaryResult.secure_url
                }
            });

        } catch (error) {
            console.error('Error al crear producto:', error);
            // Limpiar archivo temporal si existe
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                success: false,
                message: "Error al crear el producto",
                error: error.message
            });
        }
    });
}

const updateAccesorio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Accesorios.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteAccesorio = async (req, res) => {
    try {
        const { id } = req.params;
        await Accesorios.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const accesoriosPurchased = req.body.cartItems;

    if (!Array.isArray(accesoriosPurchased)) {
        return res.status(400).json({
            success: false,
            message: 'El formato de los datos es incorrecto'
        });
    }

    try {
        // Usar Promise.all para manejar todas las actualizaciones en paralelo
        await Promise.all(accesoriosPurchased.map(async (accesorio) => {
            if (!accesorio._id || !accesorio.quantity || typeof accesorio.stock !== 'number') {
                throw new Error('Datos de accesorio incompletos o inválidos');
            }

            const updatedAccesorio = await Accesorios.findByIdAndUpdate(
                accesorio._id,
                { stock: accesorio.stock - accesorio.quantity },
                { new: true }
            );

            if (!updatedAccesorio) {
                throw new Error(`Accesorio con ID ${accesorio._id} no encontrado`);
            }

            if (updatedAccesorio.stock < 0) {
                throw new Error(`Stock insuficiente para el accesorio ${updatedAccesorio.name}`);
            }
        }));

        res.status(200).json({
            success: true,
            message: 'Se ha reducido el stock correctamente'
        });
    } catch (error) {
        console.error('Error al reducir stock:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al reducir el stock'
        });
    }
}

module.exports = { 
    getAccesorios, 
    getAccesorioById, 
    createAccesorio, 
    updateAccesorio, 
    deleteAccesorio, 
    reduceStock,
    subirImagenAccesorio 
};
