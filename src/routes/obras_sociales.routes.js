const express = require('express');
const router = express.Router();
const obrasSocialesController = require('../controllers/obras_sociales.controller');
const { validar, validarId, validarObraSocial } = require('../middlewares/validation.middleware');

router.get('/', obrasSocialesController.browse);
router.get('/:id', validarId, validar, obrasSocialesController.read);
router.post('/', validarObraSocial, validar, obrasSocialesController.add);
router.put('/:id', validarId, validarObraSocial, validar, obrasSocialesController.edit);
router.delete('/:id', validarId, validar, obrasSocialesController.remove);

module.exports = router;
