const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

// GET /api/v1/reportes/turnos — descarga el informe de turnos en PDF
// Solo accesible por administradores (ROL = 3)
// Respuesta: archivo PDF para descarga | Sin permiso: 403 
router.get('/turnos', verificarToken, verificarRol(3), pdfController.generarInformeTurnos);

module.exports = router;
