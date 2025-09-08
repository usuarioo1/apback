const express = require('express')

const {
    getAros, 
    createAro, 
    getAroById, 
    updateAro, 
    deleteAro,
    subirImagenAro
} = require('../controllers/arosController')

const arosRoute = express.Router();

// La ruta principal ahora maneja la creación con imagen incluida
arosRoute.route('/aros')
    .get(getAros)
    .post(createAro) // createAro ya maneja el multipart/form-data

arosRoute.route('/aros/:id')
    .get(getAroById)
    .put(updateAro)
    .delete(deleteAro)

// Esta ruta es opcional, para actualizar solo la imagen después
arosRoute.route('/aros/:id/imagen')
    .post(subirImagenAro)


module.exports = arosRoute;
