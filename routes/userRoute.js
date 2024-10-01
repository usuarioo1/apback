const express = require('express');
const { getUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const userRoute = express.Router();

userRoute.route('/users')
    .get(getUsers)
    .post(createUser);

userRoute.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = userRoute;
