const Anillos = require('../models/anillosSchema');

const getAnillos = async (req, res) => {
    try {
        const anillos = await Anillos.find();
        res.json({
            success: true,
            message: 'acá está la lista de Anillos',
            info: anillos
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getAnilloById = async (req, res) => {
    try {
        const { id } = req.params;
        const anilloById = await Anillos.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: anilloById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createAnillo = async (req, res) => {
    try {
        const newProduct = new Anillos(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateAnillo = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Anillos.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteAnillo = async (req, res) => {
    try {
        const { id } = req.params;
        await Anillos.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const anillosPurchased = req.body.cartItems;

    try {
        anillosPurchased.map(async (anillo) => {
            await Anillos.findByIdAndUpdate(anillo._id, { stock: anillo.stock - anillo.quantity });
        });
        res.status(201).json({ success: true, message: 'se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { getAnillos, getAnilloById, createAnillo, updateAnillo, deleteAnillo, reduceStock };
