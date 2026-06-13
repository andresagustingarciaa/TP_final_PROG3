const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientes.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { validar, validarId } = require('../middlewares/validation.middleware');
const { body } = require('express-validator');

// [Acá van tus constantes validarPaciente y validarPacienteEdit que ya tenías]
const validarPaciente = [
    body('documento').notEmpty().isString().isLength({ max: 20 }).trim(),
    body('apellido').notEmpty().isString().isLength({ max: 100 }).trim(),
    body('nombres').notEmpty().isString().isLength({ max: 100 }).trim(),
    body('email').notEmpty().isEmail().isLength({ max: 255 }).trim(),
    body('contrasenia').notEmpty().isLength({ min: 6 }),
    body('id_obra_social').notEmpty().isInt({ min: 1 })
];

const validarPacienteEdit = [
    body('documento').notEmpty().isString().isLength({ max: 20 }).trim(),
    body('apellido').notEmpty().isString().isLength({ max: 100 }).trim(),
    body('nombres').notEmpty().isString().isLength({ max: 100 }).trim(),
    body('email').notEmpty().isEmail().isLength({ max: 255 }).trim(),
    body('id_obra_social').notEmpty().isInt({ min: 1 })
];

/**
 * @swagger
 * /api/v1/pacientes:
 *   get:
 *     summary: Lista todos los pacientes activos
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 */
router.get('/', verificarToken, pacientesController.browse);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   get:
 *     summary: Trae un paciente por ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', verificarToken, validarId, validar, pacientesController.read);

/**
 * @swagger
 * /api/v1/pacientes:
 *   post:
 *     summary: Crea un nuevo paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento: {type: string}
 *               apellido: {type: string}
 *               nombres: {type: string}
 *               email: {type: string}
 *               contrasenia: {type: string}
 *               id_obra_social: {type: integer}
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *       409:
 *         description: El paciente ya existe
 */
router.post('/', verificarToken, verificarRol(3), validarPaciente, validar, pacientesController.add);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   put:
 *     summary: Edita un paciente existente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento: {type: string}
 *               apellido: {type: string}
 *               nombres: {type: string}
 *               email: {type: string}
 *               id_obra_social: {type: integer}
 *     responses:
 *       200:
 *         description: Paciente editado exitosamente
 */
router.put('/:id', verificarToken, verificarRol(3), validarId, validarPacienteEdit, validar, pacientesController.edit);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   delete:
 *     summary: Elimina (soft delete) un paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente eliminado
 */
router.delete('/:id', verificarToken, verificarRol(3), validarId, validar, pacientesController.remove);

module.exports = router;