const express = require('express');

const { 
    getContactos, 
    createContacto, 
    getContactoById, 
    updateContacto, 
    deleteContacto 
} = require('../controllers/contactoController');

const contactoRoute = express.Router();

contactoRoute.route('/contactos')
    .get(getContactos)
    .post(createContacto);

contactoRoute.route('/contactos/:id')
    .get(getContactoById)
    .put(updateContacto)
    .delete(deleteContacto);

module.exports = contactoRoute;
