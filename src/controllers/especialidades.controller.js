//Arreglo de referencia para especialidades 
const especialidadesModel = require('../models/especialidades.model');

const browse = async (req, res) => {
    try {
        const especialidades = await especialidadesModel.getAll();
        res.status(200).json({ ok: true, data: especialidades });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
//Lectura de una especialidad por su id, solo si esta activa
const read = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.json({ ok: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
//Agrega una nueva especialidad, por defecto se activa al crearla
const read = async (req, res) => {
    try {
        const especialidad = await especialidadesModel.getById(req.params.id);
        if (!especialidad) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, data: especialidad });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
//Agrega una nueva especialidad, por defecto se activa al crearla
const add = async (req, res) => {
    try {
        const { nombre } = req.body;
        const result = await especialidadesModel.create({ nombre });
        res.status(201).json({ ok: true, data: { id_especialidad: result.insertId, nombre } });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
//Actualiza el nombre de una especialidad, solo si esta activa
const edit = async (req, res) => {
    try {
        const { nombre } = req.body;
        const result = await especialidadesModel.update(req.params.id, { nombre });
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad actualizada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
//Elimina una especialidad, solo si esta activa
const remove = async (req, res) => {
    try {
        const result = await especialidadesModel.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad eliminada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };