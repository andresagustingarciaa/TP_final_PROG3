const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicos.controller');
const {
    validar,
    validarId,
    validarMedico,
    validarMedicoEdit,
    validarIdEspecialidad,
    validarIdObraSocial,
    validarIdObraSocialParam
} = require('../middlewares/validation.middleware');

/**
 * @swagger
 * /api/v1/medicos:
 *   get:
 *     summary: Lista todos los médicos activos
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Lista de médicos obtenida exitosamente
 */
router.get('/', medicosController.browse);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   get:
 *     summary: Trae un médico por ID
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID del médico
 *     responses:
 *       200:
 *         description: Médico encontrado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Médico no encontrado
 */
router.get('/:id', validarId, validar, medicosController.read);

/**
 * @swagger
 * /api/v1/medicos:
 *   post:
 *     summary: Crea un nuevo médico (usuario + médico)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "31000999"
 *                 apellido:
 *                   type: string
 *                   example: "García"
 *                   nombres:
 *                     type: string
 *                     example: "Ana"
 *                     email:
 *                       type: string
 *                       example: "ana@correo.com"
 *                       contrasenia:
 *                         type: string
 *                         example: "123456"
 *                         id_especialidad:
 *                           type: integer
 *                           example: 1
 *                           matricula:
 *                             type: integer
 *                             example: 5000
 *                             descripcion:
 *                               type: string
 *                               example: "Pediatra"
 *                               valor_consulta:
 *                                 type: number
 *                                 example: 8000
 *     responses:
 *       201:
 *         description: Médico creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El médico ya existe
 */
router.post('/', validarMedico, validar, medicosController.add);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   put:
 *     summary: Edita un médico existente
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID del médico a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 apellido:
 *                   type: string
 *                   nombres:
 *                     type: string
 *                     email:
 *                       type: string
 *                       contrasenia:
 *                         type: string
 *                         description: Opcional
 *                         id_especialidad:
 *                           type: integer
 *                           matricula:
 *                             type: integer
 *                             descripcion:
 *                               type: string
 *                               valor_consulta:
 *                                 type: number
 *     responses:
 *       200:
 *         description: Médico editado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico no encontrado
 */
router.put('/:id', validarId, validarMedicoEdit, validar, medicosController.edit);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   delete:
 *     summary: Elimina (soft delete) un médico
 *     tags: [Médicos]
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
 *         description: Médico eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Médico no encontrado
 */
router.delete('/:id', validarId, validar, medicosController.remove);

/**
 * @swagger
 * /api/v1/medicos/{id}/especialidad:
 *   put:
 *     summary: Asocia una especialidad al médico
 *     tags: [Médicos]
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
 *               id_especialidad:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Especialidad asociada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico o especialidad no encontrados
 */
router.put('/:id/especialidad', validarId, validarIdEspecialidad, validar, medicosController.asociarEspecialidad);

/**
 * @swagger
 * /api/v1/medicos/{id}/obras-sociales:
 *   get:
 *     summary: Lista las obras sociales asociadas a un médico
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras sociales obtenida exitosamente
 *       404:
 *         description: Médico no encontrado
 */
router.get('/:id/obras-sociales', validarId, validar, medicosController.listarObrasSociales);

/**
 * @swagger
 * /api/v1/medicos/{id}/obras-sociales:
 *   post:
 *     summary: Asocia una obra social a un médico
 *     tags: [Médicos]
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
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Obra social asociada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico u obra social no encontrados
 *       409:
 *         description: El médico ya tiene asociada esa obra social
 */
router.post('/:id/obras-sociales', validarId, validarIdObraSocial, validar, medicosController.asociarObraSocial);

/**
 * @swagger
 * /api/v1/medicos/{id}/obras-sociales/{idObraSocial}:
 *   delete:
 *     summary: Desasocia una obra social de un médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idObraSocial
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra social desasociada exitosamente
 *       404:
 *         description: Asociación no encontrada
 */
router.delete('/:id/obras-sociales/:idObraSocial', validarId, validarIdObraSocialParam, validar, medicosController.desasociarObraSocial);

module.exports = router;