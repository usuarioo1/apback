const express = require('express')

const {getAros, createAro, getAroById, updateAro, deleteAro} = require('../controllers/arosController')

const arosRoute = express.Router();

arosRoute.route('/aros').get(getAros).post(createAro)
arosRoute.route('/aros/:id').get(getAroById).put(updateAro).delete(deleteAro)


module.exports = arosRoute;
