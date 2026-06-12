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

// CRUD de médicos
router.get('/', medicosController.browse);
router.get('/:id', validarId, validar, medicosController.read);
router.post('/', validarMedico, validar, medicosController.add);
router.put('/:id', validarId, validarMedicoEdit, validar, medicosController.edit);
router.delete('/:id', validarId, validar, medicosController.remove);

// Asociar médico con especialidad
router.put('/:id/especialidad', validarId, validarIdEspecialidad, validar, medicosController.asociarEspecialidad);

// Asociar médico con obras sociales
router.get('/:id/obras-sociales', validarId, validar, medicosController.listarObrasSociales);
router.post('/:id/obras-sociales', validarId, validarIdObraSocial, validar, medicosController.asociarObraSocial);
router.delete('/:id/obras-sociales/:idObraSocial', validarId, validarIdObraSocialParam, validar, medicosController.desasociarObraSocial);

module.exports = router;
