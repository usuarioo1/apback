const Pulseras = require('../models/pulserasSchema');
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

// Función para manejar la carga de una imagen para una pulsera específica
const subirImagenPulsera = async (req, res) => {
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
            const pulseraId = req.params.id;
            const pulsera = await Pulseras.findById(pulseraId);
            
            if (!pulsera) {
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ error: "Pulsera no encontrada" });
            }

            // Generar un nombre de archivo único usando el código de la pulsera
            const fileId = pulsera.codigo || pulseraId;
            
            // Subir imagen a Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'pulseras',
                public_id: fileId
            });

            // Actualizar pulsera con la URL de la imagen
            pulsera.img = cloudinaryResult.secure_url;
            await pulsera.save();

            // Eliminar archivo temporal
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(200).json({
                message: "Imagen subida correctamente",
                imageUrl: cloudinaryResult.secure_url,
                pulsera: {
                    id: pulsera._id,
                    name: pulsera.name
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

const getPulseras = async (req, res) => {
    try {
        const pulseras = await Pulseras.find();
        res.json({
            success: true,
            message: 'acá está la lista de Pulseras',
            info: pulseras
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getPulseraById = async (req, res) => {
    try {
        const { id } = req.params;
        const pulseraById = await Pulseras.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: pulseraById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createPulsera = async (req, res) => {
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
                folder: 'pulseras',
                public_id: fileId
            });

            // Crear el producto con todos los datos
            const newProduct = new Pulseras({
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

const updatePulsera = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Pulseras.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deletePulsera = async (req, res) => {
    try {
        const { id } = req.params;
        await Pulseras.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const pulserasPurchased = req.body.cartItems;

    if (!Array.isArray(pulserasPurchased)) {
        return res.status(400).json({
            success: false,
            message: 'El formato de los datos es incorrecto'
        });
    }

    try {
        // Usar Promise.all para manejar todas las actualizaciones en paralelo
        await Promise.all(pulserasPurchased.map(async (pulsera) => {
            if (!pulsera._id || !pulsera.quantity || typeof pulsera.stock !== 'number') {
                throw new Error('Datos de pulsera incompletos o inválidos');
            }

            const updatedPulsera = await Pulseras.findByIdAndUpdate(
                pulsera._id,
                { stock: pulsera.stock - pulsera.quantity },
                { new: true }
            );

            if (!updatedPulsera) {
                throw new Error(`Pulsera con ID ${pulsera._id} no encontrada`);
            }

            if (updatedPulsera.stock < 0) {
                throw new Error(`Stock insuficiente para la pulsera ${updatedPulsera.name}`);
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
    getPulseras, 
    getPulseraById, 
    createPulsera, 
    updatePulsera, 
    deletePulsera, 
    reduceStock,
    subirImagenPulsera 
};
