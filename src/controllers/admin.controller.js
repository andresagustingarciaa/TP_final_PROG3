const bcrypt = require('bcryptjs');
const pool = require('../db.js');
const estadisticasService = require('../services/estadisticas.service');

// Registra un nuevo usuario con rol de administrador (ROL = 3)
// Solo otro administrador puede usar este endpoint
// No hay tabla "administradores" separada: basta con rol = 3 en usuarios
const registrarAdmin = async (req, res) => {
    const { documento, apellido, nombres, email, contrasenia } = req.body;

    try {
        // Verificar que el documento no esté en uso
        const [docCheck] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE documento = ?',
            [documento]
        );
        if (docCheck.length > 0) {
            return res.status(409).json({ ok: false, message: 'El documento ya está registrado' });
        }

        // Verificar que el email no este en uso
        const [emailCheck] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE email = ?',
            [email]
        );
        if (emailCheck.length > 0) {
            return res.status(409).json({ ok: false, message: 'El email ya está registrado' });
        }

        // Hashear contraseña con bcrypt
        const hash = await bcrypt.hash(contrasenia, 10);

        // Insertar en usuarios con rol 3 (administradorr)
        const [result] = await pool.query(
            `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo)
             VALUES (?, ?, ?, ?, ?, '', 3, 1)`,
            [documento, apellido, nombres, email, hash]
        );

        res.status(201).json({
            ok: true,
            message: 'Administrador registrado correctamente',
            data: {
                id_usuario: result.insertId,
                nombres,
                apellido,
                email,
                rol: 3
            }
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve estadísticas de atenciones generadas mediante stored procedures
const obtenerEstadisticas = async (req, res) => {
    try {
        const data = await estadisticasService.getEstadisticas();
        res.status(200).json({ ok: true, data });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { registrarAdmin, obtenerEstadisticas };
