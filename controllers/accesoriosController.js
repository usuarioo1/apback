const Accesorios = require('../models/accesoriosSchema');

const getAccesorios = async (req, res) => {
    try {
        const accesorios = await Accesorios.find();
        res.json({
            success: true,
            message: 'Acá está la lista de Accesorios',
            info: accesorios
        });
    } catch (error) {
        res.json({ success: false, message: 'Info no encontrada' });
        console.error(error);
    }
}

const getAccesorioById = async (req, res) => {
    try {
        const { id } = req.params;
        const accesorioById = await Accesorios.findById(id);
        res.json({ success: true, message: 'Producto solicitado', info: accesorioById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Producto no encontrado' });
    }
}

const createAccesorio = async (req, res) => {
    try {
        const newProduct = new Accesorios(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'Producto creado', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateAccesorio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Accesorios.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
}

const deleteAccesorio = async (req, res) => {
    try {
        const { id } = req.params;
        await Accesorios.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }
}

const reduceStock = async (req, res) => {
    const accesoriosPurchased = req.body.cartItems;

    try {
        accesoriosPurchased.map(async (accesorio) => {
            await Accesorios.findByIdAndUpdate(accesorio._id, { stock: accesorio.stock - accesorio.quantity });
        });
        res.status(201).json({ success: true, message: 'Se ha reducido el stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: error.message
        });
    }
}

module.exports = { getAccesorios, getAccesorioById, createAccesorio, updateAccesorio, deleteAccesorio, reduceStock };
