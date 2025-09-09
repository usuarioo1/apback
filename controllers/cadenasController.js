const Cadenas = require('../models/cadenasSchema')
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../temp/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    }
    ,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }).array('images', 50);
const uploadSingle = multer({ storage }).single('imagen');

// Función para manejar la carga de una imagen para una cadena específica
const subirImagenCadena = async (req, res) => {
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
            const cadenaId = req.params.id;
            const cadena = await Cadenas.findById(cadenaId);
            if (!cadena) {
                if (req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ error: "Cadena no encontrada" });
            }
            const fileId = cadena.codigo || cadenaId;
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "cadenas",
                public_id: fileId,
                
            });
            cadena.img = result.secure_url;
            await cadena.save();
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).json({ success: true, message: "Imagen subida y cadena actualizada", info: cadena });
        } catch (error) {
            console.error("Error al subir la imagen o actualizar la cadena:", error);
            res.status(500).json({ error: "Error al subir la imagen o actualizar la cadena", detalle: error.message });
        }   
    });
}

const getCadenas = async (req, res) => {
    try {
        const cadenas = await Cadenas.find();
        res.json({
            success: true,
            message: 'acá está la lista de Cadenas',
            info: cadenas
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getCadenaById = async (req, res) => {
    try {
        const { id } = req.params;
        const cadenaById = await Cadenas.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: cadenaById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createCadena = async (req, res) => {
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
                folder: 'cadenas',
                public_id: fileId
            });

            // Crear el producto con todos los datos
            const newProduct = new Cadenas({
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


const updateCadena = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Cadenas.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteCadena = async (req, res) => {
    try {
        const { id } = req.params;
        await Cadenas.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const cadenasPurchased = req.body.cartItems;

    try {
        cadenasPurchased.map(async (cadena) => {
            await Cadenas.findByIdAndUpdate(cadena._id, { stock: cadena.stock - cadena.quantity });
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
    getCadenas, 
    getCadenaById, 
    createCadena, 
    updateCadena, 
    deleteCadena, 
    reduceStock,
    subirImagenCadena 
};