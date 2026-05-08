const express = require('express');
const router = express.Router();

// Importar el controlador (le toca a uno de ustedes crear el controlador)
const especialidadesController = require('../controllers/especialidades.controller');

router.get('/', especialidadesController.browse);
router.get('/:id', especialidadesController.read);
router.post('/', especialidadesController.add);
router.put('/:id', especialidadesController.edit);
router.delete('/:id', especialidadesController.remove);

module.exports = router;