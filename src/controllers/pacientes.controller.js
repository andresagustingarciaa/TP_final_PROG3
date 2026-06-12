const pacientesService = require('../services/pacientes.service');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');

// Devuelve todos los pacientes activos
const browse = async (req, res) => {
    try {
        const pacientes = await pacientesService.getAll();
        res.status(200).json({ ok: true, data: pacientes });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve un paciente por su ID
const read = async (req, res) => {
    try {
        const paciente = await pacientesService.getById(req.params.id);
        if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });
        res.status(200).json({ ok: true, data: paciente });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Crea un nuevo paciente (crea el usuario con rol 2 y luego el paciente)
const add = async (req, res) => {
    try {
        const { documento, apellido, nombres, email, contrasenia, id_obra_social } = req.body;

        // Verificar que el documento no esté en uso
        const [docCheck] = await pool.query('SELECT id_usuario FROM usuarios WHERE documento = ?', [documento]);
        if (docCheck.length > 0) return res.status(409).json({ ok: false, message: 'El documento ya está registrado' });

        // Verificar que el email no esté en uso
        const [emailCheck] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
        if (emailCheck.length > 0) return res.status(409).json({ ok: false, message: 'El email ya está registrado' });

        // Hashear contraseña
        const hash = await bcrypt.hash(contrasenia, 10);

        // Insertar usuario con rol 2 (paciente)
        const [userResult] = await pool.query(
            `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo)
             VALUES (?, ?, ?, ?, ?, '', 2, 1)`,
            [documento, apellido, nombres, email, hash]
        );

        const id_usuario = userResult.insertId;

        // Insertar paciente
        const result = await pacientesService.create({ id_obra_social }, id_usuario);

        res.status(201).json({
            ok: true,
            data: { id_paciente: result.insertId, id_usuario, nombres, apellido, email, id_obra_social }
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Edita los datos de un paciente existente
const edit = async (req, res) => {
    try {
        const { documento, apellido, nombres, email, id_obra_social } = req.body;

        const paciente = await pacientesService.getById(req.params.id);
        if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });

        // Verificar documento único (excluyendo al propio usuario)
        const [docCheck] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE documento = ? AND id_usuario != ?',
            [documento, paciente.id_usuario]
        );
        if (docCheck.length > 0) return res.status(409).json({ ok: false, message: 'El documento ya está registrado' });

        // Verificar email único (excluyendo al propio usuario)
        const [emailCheck] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?',
            [email, paciente.id_usuario]
        );
        if (emailCheck.length > 0) return res.status(409).json({ ok: false, message: 'El email ya está registrado' });

        const result = await pacientesService.update(req.params.id, { documento, apellido, nombres, email, id_obra_social });
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });

        res.status(200).json({ ok: true, message: 'Paciente actualizado' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Elimina (soft delete) un paciente
const remove = async (req, res) => {
    try {
        const result = await pacientesService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });
        res.status(200).json({ ok: true, message: 'Paciente eliminado' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };
