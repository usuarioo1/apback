const Figuras = require('../models/figurasSchema');

const getFiguras = async (req, res) => {
    try {
        const figuras = await Figuras.find();
        res.json({
            success: true,
            message: 'acá está la lista de Figuras',
            info: figuras
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getFiguraById = async (req, res) => {
    try {
        const { id } = req.params;
        const figuraById = await Figuras.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: figuraById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createFigura = async (req, res) => {
    try {
        const newProduct = new Figuras(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateFigura = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Figuras.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteFigura = async (req, res) => {
    try {
        const { id } = req.params;
        await Figuras.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const figurasPurchased = req.body.cartItems;

    try {
        figurasPurchased.map(async (figura) => {
            await Figuras.findByIdAndUpdate(figura._id, { stock: figura.stock - figura.quantity });
        });
        res.status(201).json({ success: true, message: 'se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { getFiguras, getFiguraById, createFigura, updateFigura, deleteFigura, reduceStock };
