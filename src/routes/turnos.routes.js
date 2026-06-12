const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { validar, validarId } = require('../middlewares/validation.middleware');
const { body, param } = require('express-validator');

// Validaciones específicas de turno
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

const validarIdMedico = param('id_medico')
    .isInt({ min: 1 }).withMessage('El ID de médico debe ser un número entero positivo');

const validarIdPaciente = param('id_paciente')
    .isInt({ min: 1 }).withMessage('El ID de paciente debe ser un número entero positivo');

// GET /api/v1/turnos — lista todos los turnos activos
// Respuesta exitosa: 200
router.get('/', verificarToken, turnosController.browse);

// GET /api/v1/turnos/:id — trae un turno por ID
// Respuesta exitosa: 200 | No encontrado: 404 | ID inválido: 400
router.get('/:id', verificarToken, validarId, validar, turnosController.read);

// GET /api/v1/turnos/medico/:id_medico — lista turnos de un médico
// Respuesta exitosa: 200 | ID inválido: 400
router.get('/medico/:id_medico', verificarToken, validarIdMedico, validar, turnosController.byMedico);

// GET /api/v1/turnos/paciente/:id_paciente — lista turnos de un paciente
// Respuesta exitosa: 200 | ID inválido: 400
router.get('/paciente/:id_paciente', verificarToken, validarIdPaciente, validar, turnosController.byPaciente);

// POST /api/v1/turnos — registra un nuevo turno (calcula valor_total automáticamente)
// Respuesta exitosa: 201 | Datos inválidos: 400
router.post('/', verificarToken, validarTurno, validar, turnosController.add);

// PATCH /api/v1/turnos/:id/atender — marca un turno como atendido
// Respuesta exitosa: 200 | No encontrado: 404 | ID inválido: 400
router.patch('/:id/atender', verificarToken, verificarRol(1, 3), validarId, validar, turnosController.atender);

// DELETE /api/v1/turnos/:id — cancela (soft delete) un turno
// Respuesta exitosa: 200 | No encontrado: 404 | ID inválido: 400
router.delete('/:id', verificarToken, verificarRol(3), validarId, validar, turnosController.remove);

module.exports = router;
