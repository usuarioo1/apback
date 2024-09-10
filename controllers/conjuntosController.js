const Conjuntos = require('../models/conjuntosSchema');

const getConjuntos = async (req, res) => {
    try {
        const conjuntos = await Conjuntos.find();
        res.json({
            success: true,
            message: 'acá está la lista de Conjuntos',
            info: conjuntos
        });
    } catch (error) {
        res.json({ success: false, message: 'info no encontrada' });
        console.error(error);
    }
}

const getConjuntoById = async (req, res) => {
    try {
        const { id } = req.params;
        const conjuntoById = await Conjuntos.findById(id);
        res.json({ success: true, message: 'producto solicitado', info: conjuntoById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'producto no encontrado' });
    }
}

const createConjunto = async (req, res) => {
    try {
        const newProduct = new Conjuntos(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateConjunto = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Conjuntos.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteConjunto = async (req, res) => {
    try {
        const { id } = req.params;
        await Conjuntos.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const conjuntosPurchased = req.body.cartItems;

    try {
        conjuntosPurchased.map(async (conjunto) => {
            await Conjuntos.findByIdAndUpdate(conjunto._id, { stock: conjunto.stock - conjunto.quantity });
        });
        res.status(201).json({ success: true, message: 'se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { getConjuntos, getConjuntoById, createConjunto, updateConjunto, deleteConjunto, reduceStock };
