const express = require('express');
const router = express.Router();
const obrasSocialesController = require('../controllers/obras_sociales.controller');
const { validar, validarId, validarObraSocial } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   get:
 *     summary: Lista todas las obras sociales activas
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales obtenida exitosamente
 */
router.get('/', obrasSocialesController.browse);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   get:
 *     summary: Trae una obra social por ID
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la obra social
 *     responses:
 *       200:
 *         description: Obra social encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Obra social no encontrada
 */
router.get('/:id', validarId, validar, obrasSocialesController.read);

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   post:
 *     summary: Crea una nueva obra social
 *     tags: [Obras Sociales]
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
 *                 example: "OSDE"
 *                 descripcion:
 *                   type: string
 *                   example: "Obra social premium"
 *                   porcentaje_descuento:
 *                     type: number
 *                     example: 15
 *                     es_particular:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Obra social creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El nombre ya está duplicado
 */
router.post('/', validarObraSocial, validar, obrasSocialesController.add);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   put:
 *     summary: Edita una obra social existente
 *     tags: [Obras Sociales]
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
 *               nombre:
 *                 type: string
 *                 descripcion:
 *                   type: string
 *                   porcentaje_descuento:
 *                     type: number
 *                     es_particular:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Obra social editada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Obra social no encontrada
 */
router.put('/:id', validarId, validarObraSocial, validar, obrasSocialesController.edit);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   delete:
 *     summary: Elimina (soft delete) una obra social
 *     tags: [Obras Sociales]
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
 *         description: Obra social eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Obra social no encontrada
 */
router.delete('/:id', validarId, validar, obrasSocialesController.remove);

module.exports = router;