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

// GET /api/v1/medicos — lista todos los medicos activos
// Respuesta exitosa: 200
router.get('/', medicosController.browse);

// GET /api/v1/medicos/:id — trae un medico por ID
// Respuesta exitosa: 200 | No encontrado: 404 | ID invalido: 400
router.get('/:id', validarId, validar, medicosController.read);

// POST /api/v1/medicos — crea un nuevo medico (usuario + medico)
// JSON esperado:
// {
//   "documento": "31000999",
//   "apellido": "García",
//   "nombres": "Ana",
//   "email": "ana@correo.com",
//   "contrasenia": "123456",
//   "id_especialidad": 1,
//   "matricula": 5000,
//   "descripcion": "Pediatra",
//   "valor_consulta": 8000
// }
// Respuesta exitosa: 201 | Datos invalidos: 400 | Duplicado: 409
router.post('/', validarMedico, validar, medicosController.add);

// PUT /api/v1/medicos/:id — edita un medico existente
// JSON esperado:
// {
//   "documento": "31000999",
//   "apellido": "García",
//   "nombres": "Ana",
//   "email": "ana@correo.com",
//   "contrasenia": "123456",        // opcional (no hace falta si no la cambia)
//   "id_especialidad": 1,
//   "matricula": 5000,
//   "descripcion": "Pediatra",
//   "valor_consulta": 8000
// }
// Respuesta exitosa: 200 | No encontrado: 404 | Datos invalidos: 400
router.put('/:id', validarId, validarMedicoEdit, validar, medicosController.edit);

// DELETE /api/v1/medicos/:id — elimina (soft delete) un medico
// Respuesta exitosa: 200 | No encontrado: 404 | ID invalido: 400
router.delete('/:id', validarId, validar, medicosController.remove);

// PUT /api/v1/medicos/:id/especialidad — asocia una especialidad al medico
// JSON esperado:
// {
//   "id_especialidad": 2
// }
// Respuesta exitosa: 200 | No encontrado: 404 | Datos invalidos: 400
router.put('/:id/especialidad', validarId, validarIdEspecialidad, validar, medicosController.asociarEspecialidad);

// GET /api/v1/medicos/:id/obras-sociales — lista las obras sociales del medico
// Respuesta exitosa: 200 | No encontrado: 404
router.get('/:id/obras-sociales', validarId, validar, medicosController.listarObrasSociales);

// POST /api/v1/medicos/:id/obras-sociales — asocia una obra social al medico
// JSON esperado:
// {
//   "id_obra_social": 2
// }
// Respuesta exitosa: 201 | No encontrado: 404 | Ya asociada: 409
router.post('/:id/obras-sociales', validarId, validarIdObraSocial, validar, medicosController.asociarObraSocial);

// DELETE /api/v1/medicos/:id/obras-sociales/:idObraSocial — desasocia una obra social (soft delete)
// Respuesta exitosa: 200 | No encontrada: 404
router.delete('/:id/obras-sociales/:idObraSocial', validarId, validarIdObraSocialParam, validar, medicosController.desasociarObraSocial);

module.exports = router;
