const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validar } = require('../middlewares/validation.middleware');

// Validaciones para crear un administrador
const validarAdmin = [
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto')
        .isLength({ max: 20 }).withMessage('Máximo 20 caracteres')
        .trim(),
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString()
        .isLength({ max: 100 })
        .trim(),
    body('nombres')
        .notEmpty().withMessage('Los nombres son requeridos')
        .isString()
        .isLength({ max: 100 })
        .trim(),
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido')
        .isLength({ max: 255 })
        .trim(),
    body('contrasenia')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
];

// POST /api/v1/admin/registro — crea un nuevo administrador
// Solo accesible por un administrador autenticado (ROL = 3)
// Respuesta exitosa: 201 | Ya existe: 409 | Sin permiso: 403
router.post('/registro', verificarToken, verificarRol(3), validarAdmin, validar, adminController.registrarAdmin);

module.exports = router;
