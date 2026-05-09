const { body, param, validationResult } = require('express-validator');

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

module.exports = {
    validar,
    validarNombre,
    validarId
};