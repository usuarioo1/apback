const Colgantes = require('../models/colganteSchema');

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
    try {
        const newProduct = new Colgantes(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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

module.exports = { getColgantes, getColganteById, createColgante, updateColgante, deleteColgante, reduceStock };
