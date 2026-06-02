const express = require('express');
const { getUsers, createUser, getUserById, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const userRoute = express.Router();

userRoute.post('/users/login', loginUser);

userRoute.route('/users')
    .get(verifyToken, requireAdmin, getUsers)
    .post(verifyToken, requireAdmin, createUser);

userRoute.route('/users/:id')
    .get(verifyToken, requireAdmin, getUserById)
    .put(verifyToken, requireAdmin, updateUser)
    .delete(verifyToken, requireAdmin, deleteUser);

module.exports = userRoute;
