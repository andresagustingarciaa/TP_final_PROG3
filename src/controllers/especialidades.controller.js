const pool = require('../db');

const browse = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM especialidades WHERE activo = 1');
        res.json({ ok: true, data: rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const read = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.json({ ok: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const add = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await pool.query('INSERT INTO especialidades (nombre, activo) VALUES (?, 1)', [nombre]);
        res.status(201).json({ ok: true, data: { id_especialidad: result.insertId, nombre } });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const edit = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await pool.query('UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1', [nombre, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.json({ ok: true, message: 'Especialidad actualizada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const [result] = await pool.query('UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.json({ ok: true, message: 'Especialidad eliminada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };