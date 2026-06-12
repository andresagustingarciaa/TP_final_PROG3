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

const validarObraSocial = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ max: 120 }).withMessage('El nombre no puede superar los 120 caracteres')
        .trim(),
    body('descripcion')
        .notEmpty().withMessage('La descripción es requerida')
        .isString().withMessage('La descripción debe ser texto')
        .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres')
        .trim(),
    body('porcentaje_descuento')
        .notEmpty().withMessage('El porcentaje de descuento es requerido')
        .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe ser un número entre 0 y 100'),
    body('es_particular')
        .notEmpty().withMessage('es_particular es requerido')
        .isBoolean().withMessage('es_particular debe ser true o false')
];

const validarMedico = [
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
    body('id_especialidad')
        .notEmpty().withMessage('La especialidad es requerida')
        .isInt({ min: 1 }).withMessage('La especialidad debe ser un número entero positivo'),
    body('matricula')
        .notEmpty().withMessage('La matrícula es requerida')
        .isInt({ min: 1 }).withMessage('La matrícula debe ser un número entero positivo'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto'),
    body('valor_consulta')
        .notEmpty().withMessage('El valor de consulta es requerido')
        .isFloat({ min: 0 }).withMessage('El valor de consulta debe ser un número positivo')
];

const validarMedicoEdit = [
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
        .optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('id_especialidad')
        .notEmpty().withMessage('La especialidad es requerida')
        .isInt({ min: 1 }).withMessage('La especialidad debe ser un número entero positivo'),
    body('matricula')
        .notEmpty().withMessage('La matrícula es requerida')
        .isInt({ min: 1 }).withMessage('La matrícula debe ser un número entero positivo'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto'),
    body('valor_consulta')
        .notEmpty().withMessage('El valor de consulta es requerido')
        .isFloat({ min: 0 }).withMessage('El valor de consulta debe ser un número positivo')
];

const validarIdEspecialidad = body('id_especialidad')
    .notEmpty().withMessage('La especialidad es requerida')
    .isInt({ min: 1 }).withMessage('La especialidad debe ser un número entero positivo');

const validarIdObraSocial = body('id_obra_social')
    .notEmpty().withMessage('La obra social es requerida')
    .isInt({ min: 1 }).withMessage('La obra social debe ser un número entero positivo');

const validarIdObraSocialParam = param('idObraSocial')
    .isInt({ min: 1 }).withMessage('El ID de obra social debe ser un número entero positivo');

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

const validarTurno = [
    body('id_medico')
        .notEmpty().withMessage('El médico es requerido')
        .isInt({ min: 1 }).withMessage('El médico debe ser un número entero positivo'),
    body('id_paciente')
        .notEmpty().withMessage('El paciente es requerido')
        .isInt({ min: 1 }).withMessage('El paciente debe ser un número entero positivo'),
    body('fecha_hora')
        .notEmpty().withMessage('La fecha y hora son requeridas')
        .isISO8601().withMessage('La fecha y hora deben tener formato válido (YYYY-MM-DD HH:MM:SS)')
];

module.exports = {
    validar,
    validarNombre,
    validarId,
    validarObraSocial,
    validarMedico,
    validarMedicoEdit,
    validarIdEspecialidad,
    validarIdObraSocial,
    validarIdObraSocialParam,
    validarPaciente,
    validarPacienteEdit,
    validarTurno
};