const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/v1/reportes/turnos:
 *   get:
 *     summary: Descarga el informe de turnos en PDF
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente para descarga
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Sin permiso (Requiere Rol 3)
 */
router.get('/turnos', verificarToken, verificarRol(3), pdfController.generarInformeTurnos);

module.exports = router;