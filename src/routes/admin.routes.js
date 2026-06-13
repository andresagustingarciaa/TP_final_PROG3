const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validar } = require('../middlewares/validation.middleware');

// Validaciones para crear un administrador
const validarAdmin = [
    body('documento').notEmpty().withMessage('El documento es requerido').isString().isLength({ max: 20 }).trim(),
    body('apellido').notEmpty().withMessage('El apellido es requerido').isString().isLength({ max: 100 }).trim(),
    body('nombres').notEmpty().withMessage('Los nombres son requeridos').isString().isLength({ max: 100 }).trim(),
    body('email').notEmpty().withMessage('El email es requerido').isEmail().withMessage('El email no es válido').isLength({ max: 255 }).trim(),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
];

/**
 * @swagger
 * /api/v1/admin/registro:
 *   post:
 *     summary: Crea un nuevo administrador
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador creado exitosamente
 *       403:
 *         description: Sin permiso (Requiere Rol 3)
 *       409:
 *         description: El administrador ya existe
 */
router.post('/registro', verificarToken, verificarRol(3), validarAdmin, validar, adminController.registrarAdmin);

/**
 * @swagger
 * /api/v1/admin/estadisticas:
 *   get:
 *     summary: Obtiene estadisticas de atenciones (generadas mediante stored procedures)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadisticas obtenidas exitosamente
 *       403:
 *         description: Sin permiso (Requiere Rol 3)
 */
router.get('/estadisticas', verificarToken, verificarRol(3), adminController.obtenerEstadisticas);

module.exports = router;