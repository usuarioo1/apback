const Pulseras = require('../models/pulserasSchema');

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
    try {
        const newProduct = new Pulseras(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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

    try {
        pulserasPurchased.map(async (pulsera) => {
            await Pulseras.findByIdAndUpdate(pulsera._id, { stock: pulsera.stock - pulsera.quantity });
        });
        res.status(201).json({ success: true, message: 'se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { getPulseras, getPulseraById, createPulsera, updatePulsera, deletePulsera, reduceStock };
