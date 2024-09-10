const Aros = require('../models/arosSchema');

const getAros = async (req, res) => {
    try {
        const aros = await Aros.find();
        res.json({
            success: true,
            message: 'acá está la lista de Aros',
            info: aros
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getAroById = async (req, res) => {
    try {
        const { id } = req.params;
        const aroById = await Aros.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: aroById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createAro = async (req, res) => {
    try {
        const newProduct = new Aros(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateAro = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Aros.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteAro = async (req, res) => {
    try {
        const { id } = req.params;
        await Aros.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

module.exports = { getAros, getAroById, createAro, updateAro, deleteAro };
