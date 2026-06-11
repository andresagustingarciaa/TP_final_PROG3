const especialidadesService = require('../services/especialidades.service');

// Devuelve todas las especialidades activas
const browse = async (req, res) => {
    try {
        const especialidades = await especialidadesService.getAll();
        res.status(200).json({ ok: true, data: especialidades });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve una especialidad por su id, solo si está activa
const read = async (req, res) => {
    try {
        const especialidad = await especialidadesService.getById(req.params.id);
        if (!especialidad) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, data: especialidad });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Agrega una nueva especialidad, por defecto se activa al crearla
const add = async (req, res) => {
    try {
        const { nombre } = req.body;
        const existing = await especialidadesService.getByName(nombre);
        if (existing) return res.status(409).json({ ok: false, message: 'Ya existe una especialidad con ese nombre' });
        const result = await especialidadesService.create({ nombre });
        res.status(201).json({ ok: true, data: { id_especialidad: result.insertId, nombre } });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Actualiza el nombre de una especialidad, solo si está activa
const edit = async (req, res) => {
    try {
        const { nombre } = req.body;
        const existing = await especialidadesService.getByName(nombre);
        if (existing && existing.id_especialidad !== Number(req.params.id)) {
            return res.status(409).json({ ok: false, message: 'Ya existe una especialidad con ese nombre' });
        }
        const result = await especialidadesService.update(req.params.id, { nombre });
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad actualizada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Elimina (soft delete) una especialidad, solo si está activa
const remove = async (req, res) => {
    try {
        const result = await especialidadesService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad eliminada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };