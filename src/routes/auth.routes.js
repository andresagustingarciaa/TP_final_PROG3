const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@clinica.com"
 *                 contrasenia:
 *                   type: string
 *                   example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT y los datos del usuario.
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', authController.login);

module.exports = router;