const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Endpoint de login, devuelve el token JWT
router.post('/login', authController.login);

module.exports = router;