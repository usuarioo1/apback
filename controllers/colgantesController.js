const Colgantes = require('../models/colganteSchema');
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

// Función para manejar la carga de una imagen para un colgante específico
const subirImagenColgante = async (req, res) => {
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
            const colganteId = req.params.id;
            const colgante = await Colgantes.findById(colganteId);
            
            if (!colgante) {
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ error: "Colgante no encontrado" });
            }

            // Generar un nombre de archivo único usando el código del colgante
            const fileId = colgante.codigo || colganteId;
            
            // Subir imagen a Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'colgantes',
                public_id: fileId
            });

            // Actualizar colgante con la URL de la imagen
            colgante.img = cloudinaryResult.secure_url;
            await colgante.save();

            // Eliminar archivo temporal
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(200).json({
                message: "Imagen subida correctamente",
                imageUrl: cloudinaryResult.secure_url,
                colgante: {
                    id: colgante._id,
                    name: colgante.name
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

const getColgantes = async (req, res) => {
    try {
        const colgantes = await Colgantes.find();
        res.json({
            success: true,
            message: 'acá está la lista de Colgantes',
            info: colgantes
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getColganteById = async (req, res) => {
    try {
        const { id } = req.params;
        const colganteById = await Colgantes.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: colganteById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createColgante = async (req, res) => {
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
                folder: 'colgantes',
                public_id: fileId
            });

            // Crear el producto con todos los datos
            const newProduct = new Colgantes({
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

const updateColgante = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Colgantes.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteColgante = async (req, res) => {
    try {
        const { id } = req.params;
        await Colgantes.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const colgantesPurchased = req.body.cartItems;

    try {
        colgantesPurchased.map(async (colgante) => {
            await Colgantes.findByIdAndUpdate(colgante._id, { stock: colgante.stock - colgante.quantity });
        });
        res.status(201).json({ success: true, message: 'se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { 
    getColgantes, 
    getColganteById, 
    createColgante, 
    updateColgante, 
    deleteColgante, 
    reduceStock,
    subirImagenColgante 
};
