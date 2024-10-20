const Contacto = require('../models/contactoSchema');

const getContactos = async (req, res) => {
    try {
        const contactos = await Contacto.find();
        res.json({
            success: true,
            message: 'Lista de contactos',
            info: contactos
        });
    } catch (error) {
        res.json({ success: false, message: 'Información no encontrada' });
        console.error(error);
    }
}

const getContactoById = async (req, res) => {
    try {
        const { id } = req.params;
        const contactoById = await Contacto.findById(id);
        res.json({ success: true, message: 'Contacto solicitado', info: contactoById });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Contacto no encontrado' });
    }
}

const createContacto = async (req, res) => {
    try {
        const newContacto = new Contacto(req.body);
        await newContacto.save();
        res.status(201).json({ success: true, message: 'Contacto creado', info: newContacto });
    } catch (error) {
        console.error('Error al crear el contacto:', error); // Agrega este log para obtener más información
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContacto = await Contacto.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Contacto actualizado', info: updatedContacto });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el contacto' });
    }
}

const deleteContacto = async (req, res) => {
    try {
        const { id } = req.params;
        await Contacto.findByIdAndDelete(id);
        res.json({ success: true, message: 'Contacto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el contacto' });
    }
}

module.exports = { getContactos, getContactoById, createContacto, updateContacto, deleteContacto };


