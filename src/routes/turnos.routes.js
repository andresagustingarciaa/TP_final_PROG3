const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { validar, validarId } = require('../middlewares/validation.middleware');
const { body, param } = require('express-validator');

const validarTurno = [
    body('id_medico').notEmpty().isInt({ min: 1 }),
    body('id_paciente').notEmpty().isInt({ min: 1 }),
    body('fecha_hora').notEmpty().isISO8601()
];

const validarIdMedico = param('id_medico').isInt({ min: 1 });
const validarIdPaciente = param('id_paciente').isInt({ min: 1 });

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Lista todos los turnos activos
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Lista obtenida" }
 */
router.get('/', verificarToken, turnosController.browse);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   get:
 *     summary: Trae un turno por ID
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: "Turno encontrado" }
 *       404: { description: "No encontrado" }
 */
router.get('/:id', verificarToken, validarId, validar, turnosController.read);

/**
 * @swagger
 * /api/v1/turnos/medico/{id_medico}:
 *   get:
 *     summary: Lista turnos de un médico
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id_medico, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: "Lista obtenida" }
 */
router.get('/medico/:id_medico', verificarToken, validarIdMedico, validar, turnosController.byMedico);

/**
 * @swagger
 * /api/v1/turnos/paciente/{id_paciente}:
 *   get:
 *     summary: Lista turnos de un paciente
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id_paciente, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: "Lista obtenida" }
 */
router.get('/paciente/:id_paciente', verificarToken, validarIdPaciente, validar, turnosController.byPaciente);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Registra un nuevo turno (con transacciones)
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_medico: { type: integer }
 *               id_paciente: { type: integer }
 *               fecha_hora: { type: string, format: date-time }
 *     responses:
 *       201: { description: "Turno creado exitosamente" }
 */
router.post('/', verificarToken, validarTurno, validar, turnosController.add);

/**
 * @swagger
 * /api/v1/turnos/{id}/atender:
 *   patch:
 *     summary: Marca un turno como atendido
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: "Turno atendido" }
 */
router.patch('/:id/atender', verificarToken, verificarRol(1, 3), validarId, validar, turnosController.atender);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   delete:
 *     summary: Cancela (soft delete) un turno
 *     tags: [Turnos]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: "Turno cancelado" }
 */
router.delete('/:id', verificarToken, verificarRol(3), validarId, validar, turnosController.remove);

module.exports = router;