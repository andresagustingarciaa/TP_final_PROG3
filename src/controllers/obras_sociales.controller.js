const obrasSocialesService = require('../services/obras_sociales.service');

// Devuelve todas las obras sociales activas (las que no estan borradas)
const browse = async (req, res) => {
    try {
        const obrasSociales = await obrasSocialesService.getAll();
        res.status(200).json({ ok: true, data: obrasSociales });
    } catch (error) {
        console.log('[obras sociales] error en browse:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve una obra social por su id, solo si esta activa
const read = async (req, res) => {
    try {
        const obraSocial = await obrasSocialesService.getById(req.params.id);
        if (!obraSocial) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        res.status(200).json({ ok: true, data: obraSocial });
    } catch (error) {
        console.log('[obras sociales] error en read:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Agrega una nueva obra social, por defecto se activa al crearla (no hace falta mandar activo)
// JSON esperado:
// {
//   "nombre": "OSDE",
//   "descripcion": "obra social",
//   "porcentaje_descuento": 15,
//   "es_particular": false
// }
const add = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const existing = await obrasSocialesService.getByName(nombre);
        if (existing) return res.status(409).json({ ok: false, message: 'Ya existe una obra social con ese nombre' });
        const result = await obrasSocialesService.create({ nombre, descripcion, porcentaje_descuento, es_particular });
        console.log('[obras sociales] creada con id:', result.insertId);
        res.status(201).json({
            ok: true,
            data: { id_obra_social: result.insertId, nombre, descripcion, porcentaje_descuento, es_particular }
        });
    } catch (error) {
        console.log('[obras sociales] error en add:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Actuliza una obra social existente, solo si esta activa
// JSON esperado:
// {
//   "nombre": "OSDE",
//   "descripcion": "obra social",
//   "porcentaje_descuento": 15,
//   "es_particular": false
// }
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
        console.log('[obras sociales] error en edit:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Elimina (soft delete) una obra social, solo si está activa
const remove = async (req, res) => {
    try {
        const result = await obrasSocialesService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        res.status(200).json({ ok: true, message: 'Obra social eliminada' });
    } catch (error) {
        console.log('[obras sociales] error en remove:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, add, edit, remove };
