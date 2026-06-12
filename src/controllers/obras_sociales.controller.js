const obrasSocialesService = require('../services/obras_sociales.service');

const browse = async (req, res) => {
    try {
        const obrasSociales = await obrasSocialesService.getAll();
        res.status(200).json({ ok: true, data: obrasSociales });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const read = async (req, res) => {
    try {
        const obraSocial = await obrasSocialesService.getById(req.params.id);
        if (!obraSocial) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        res.status(200).json({ ok: true, data: obraSocial });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const add = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const existing = await obrasSocialesService.getByName(nombre);
        if (existing) return res.status(409).json({ ok: false, message: 'Ya existe una obra social con ese nombre' });
        const result = await obrasSocialesService.create({ nombre, descripcion, porcentaje_descuento, es_particular });
        res.status(201).json({
            ok: true,
            data: { id_obra_social: result.insertId, nombre, descripcion, porcentaje_descuento, es_particular }
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const edit = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const existing = await obrasSocialesService.getByName(nombre);
        if (existing && existing.id_obra_social !== Number(req.params.id)) {
            return res.status(409).json({ ok: false, message: 'Ya existe una obra social con ese nombre' });
        }
        const result = await obrasSocialesService.update(req.params.id, { nombre, descripcion, porcentaje_descuento, es_particular });
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        res.status(200).json({ ok: true, message: 'Obra social actualizada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await obrasSocialesService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        res.status(200).json({ ok: true, message: 'Obra social eliminada' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };
