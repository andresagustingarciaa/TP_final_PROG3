const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientes.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { validar, validarId } = require('../middlewares/validation.middleware');
const { body } = require('express-validator');

// Validaciones específicas de paciente
const validarPaciente = [
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto')
        .isLength({ max: 20 }).withMessage('El documento no puede superar los 20 caracteres')
        .trim(),
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ max: 100 }).withMessage('El apellido no puede superar los 100 caracteres')
        .trim(),
    body('nombres')
        .notEmpty().withMessage('Los nombres son requeridos')
        .isString().withMessage('Los nombres deben ser texto')
        .isLength({ max: 100 }).withMessage('Los nombres no pueden superar los 100 caracteres')
        .trim(),
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido')
        .isLength({ max: 255 }).withMessage('El email no puede superar los 255 caracteres')
        .trim(),
    body('contrasenia')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('id_obra_social')
        .notEmpty().withMessage('La obra social es requerida')
        .isInt({ min: 1 }).withMessage('La obra social debe ser un número entero positivo')
];

const validarPacienteEdit = [
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto')
        .isLength({ max: 20 }).withMessage('El documento no puede superar los 20 caracteres')
        .trim(),
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ max: 100 }).withMessage('El apellido no puede superar los 100 caracteres')
        .trim(),
    body('nombres')
        .notEmpty().withMessage('Los nombres son requeridos')
        .isString().withMessage('Los nombres deben ser texto')
        .isLength({ max: 100 }).withMessage('Los nombres no pueden superar los 100 caracteres')
        .trim(),
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido')
        .isLength({ max: 255 }).withMessage('El email no puede superar los 255 caracteres')
        .trim(),
    body('id_obra_social')
        .notEmpty().withMessage('La obra social es requerida')
        .isInt({ min: 1 }).withMessage('La obra social debe ser un número entero positivo')
];

// GET /api/v1/pacientes — lista todos los pacientes activos
// Respuesta exitosa: 200
router.get('/', verificarToken, pacientesController.browse);

// GET /api/v1/pacientes/:id — trae un paciente por ID
// Respuesta exitosa: 200 | No encontrado: 404 | ID inválido: 400
router.get('/:id', verificarToken, validarId, validar, pacientesController.read);

// POST /api/v1/pacientes — crea un nuevo paciente
// Respuesta exitosa: 201 | Datos inválidos: 400 | Ya existe: 409
router.post('/', verificarToken, verificarRol(3), validarPaciente, validar, pacientesController.add);

// PUT /api/v1/pacientes/:id — edita un paciente existente
// Respuesta exitosa: 200 | No encontrado: 404 | Datos inválidos: 400
router.put('/:id', verificarToken, verificarRol(3), validarId, validarPacienteEdit, validar, pacientesController.edit);

// DELETE /api/v1/pacientes/:id — elimina (soft delete) un paciente
// Respuesta exitosa: 200 | No encontrado: 404 | ID inválido: 400
router.delete('/:id', verificarToken, verificarRol(3), validarId, validar, pacientesController.remove);

module.exports = router;
