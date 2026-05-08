const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const especialidadesController = require('../controllers/especialidades.controller');

// Middleware que corta la request si hay errores de validación
const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errores.array() });
    }
    next();
};

// Reglas reutilizables
const validarNombre = body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 120 }).withMessage('El nombre no puede superar los 120 caracteres')
    .trim();

const validarId = param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo');

// GET /api/v1/especialidades — lista todas las especialidades activas
// Respuesta exitosa: 200
router.get('/', especialidadesController.browse);

// GET /api/v1/especialidades/:id — trae una especialidad por ID
// Respuesta exitosa: 200 | No encontrada: 404 | ID inválido: 400
router.get('/:id', validarId, validar, especialidadesController.read);

// POST /api/v1/especialidades — crea una nueva especialidad
// Respuesta exitosa: 201 | Datos inválidos: 400
router.post('/', validarNombre, validar, especialidadesController.add);

// PUT /api/v1/especialidades/:id — edita el nombre de una especialidad
// Respuesta exitosa: 200 | No encontrada: 404 | Datos inválidos: 400
router.put('/:id', validarId, validarNombre, validar, especialidadesController.edit);

// DELETE /api/v1/especialidades/:id — elimina (soft delete) una especialidad
// Respuesta exitosa: 200 | No encontrada: 404 | ID inválido: 400
router.delete('/:id', validarId, validar, especialidadesController.remove);

module.exports = router;
