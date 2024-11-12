const Cadenas = require('../models/cadenasSchema')

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
    try {
        const newProduct = new Cadenas(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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

module.exports = { getCadenas, getCadenaById, createCadena, updateCadena, deleteCadena, reduceStock };