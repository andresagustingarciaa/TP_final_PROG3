const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidades.controller');
const { validar, validarNombre, validarId } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * /api/v1/especialidades:
 *   get:
 *     summary: Lista todas las especialidades activas
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades obtenida exitosamente
 */
router.get('/', especialidadesController.browse);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   get:
 *     summary: Trae una especialidad por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la especialidad
 *     responses:
 *       200:
 *         description: Especialidad encontrada exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Especialidad no encontrada
 */
router.get('/:id', validarId, validar, especialidadesController.read);

/**
 * @swagger
 * /api/v1/especialidades:
 *   post:
 *     summary: Crea una nueva especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Cardiología"
 *     responses:
 *       201:
 *         description: Especialidad creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validarNombre, validar, especialidadesController.add);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   put:
 *     summary: Edita el nombre de una especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la especialidad a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pediatría"
 *     responses:
 *       200:
 *         description: Especialidad editada exitosamente
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Especialidad no encontrada
 */
router.put('/:id', validarId, validarNombre, validar, especialidadesController.edit);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   delete:
 *     summary: Elimina (soft delete) una especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la especialidad a eliminar
 *     responses:
 *       200:
 *         description: Especialidad eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Especialidad no encontrada
 */
router.delete('/:id', validarId, validar, especialidadesController.remove);

module.exports = router;