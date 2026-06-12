const express = require('express');
const router = express.Router();
const obrasSocialesController = require('../controllers/obras_sociales.controller');
const { validar, validarId, validarObraSocial } = require('../middlewares/validation.middleware');

// GET /api/v1/obras-sociales — lista todas las obras sociales activas
// Respuesta exitosa: 200 (devuelve un array)
router.get('/', obrasSocialesController.browse);

// GET /api/v1/obras-sociales/:id — trae una obra social por ID
// Respuesta exitosa: 200 | No encontrada: 404 | ID invalido: 400
router.get('/:id', validarId, validar, obrasSocialesController.read);

// POST /api/v1/obras-sociales — crea una nueva obra social
// JSON esperado:
// {
//   "nombre": "OSDE",
//   "descripcion": "obra social",
//   "porcentaje_descuento": 15,
//   "es_particular": false
// }
// Respuesta exitosa: 201 | Datos invalidos: 400 | Nombre duplicado: 409
router.post('/', validarObraSocial, validar, obrasSocialesController.add);

// PUT /api/v1/obras-sociales/:id — edita una obra social
// JSON esperado:
// {
//   "nombre": "OSDE",
//   "descripcion": "obra social",
//   "porcentaje_descuento": 15,
//   "es_particular": false
// }
// Respuesta exitosa: 200 | No encontrada: 404 | Datos invalidos: 400
router.put('/:id', validarId, validarObraSocial, validar, obrasSocialesController.edit);

// DELETE /api/v1/obras-sociales/:id — elimina (soft delete) una obra social
// Respuesta exitosa: 200 | No encontrada: 404 | ID inválido: 400
router.delete('/:id', validarId, validar, obrasSocialesController.remove);

module.exports = router;
