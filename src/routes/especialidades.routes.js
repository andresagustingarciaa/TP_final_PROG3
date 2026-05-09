const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidades.controller');
const { validar, validarNombre, validarId } = require('../middlewares/validation.middleware');

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
