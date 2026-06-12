const medicosService = require('../services/medicos.service');

const browse = async (req, res) => {
    try {
        const medicos = await medicosService.getAll();
        res.status(200).json({ ok: true, data: medicos });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const read = async (req, res) => {
    try {
        const medico = await medicosService.getById(req.params.id);
        if (!medico) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        res.status(200).json({ ok: true, data: medico });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const add = async (req, res) => {
    try {
        const { documento, email, matricula } = req.body;

        const emailExistente = await medicosService.getByEmail(email);
        if (emailExistente) return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese email' });

        const documentoExistente = await medicosService.getByDocumento(documento);
        if (documentoExistente) return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese documento' });

        const matriculaExistente = await medicosService.getByMatricula(matricula);
        if (matriculaExistente) return res.status(409).json({ ok: false, message: 'Ya existe un médico con esa matrícula' });

        const result = await medicosService.create(req.body);
        res.status(201).json({ ok: true, data: result });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const edit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { documento, email, matricula } = req.body;

        const medicoActual = await medicosService.getById(id);
        if (!medicoActual) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });

        const emailExistente = await medicosService.getByEmail(email);
        if (emailExistente && emailExistente.id_usuario !== medicoActual.id_usuario) {
            return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese email' });
        }

        const documentoExistente = await medicosService.getByDocumento(documento);
        if (documentoExistente && documentoExistente.id_usuario !== medicoActual.id_usuario) {
            return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese documento' });
        }

        const matriculaExistente = await medicosService.getByMatricula(matricula);
        if (matriculaExistente && matriculaExistente.id_medico !== id) {
            return res.status(409).json({ ok: false, message: 'Ya existe un médico con esa matrícula' });
        }

        const result = await medicosService.update(id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        res.status(200).json({ ok: true, message: 'Médico actualizado' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await medicosService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        res.status(200).json({ ok: true, message: 'Médico eliminado' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const asociarEspecialidad = async (req, res) => {
    try {
        const result = await medicosService.asociarEspecialidad(req.params.id, req.body.id_especialidad);
        if (result.medicoNoEncontrado) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        if (result.especialidadNoEncontrada) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad asociada al médico' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const listarObrasSociales = async (req, res) => {
    try {
        const medico = await medicosService.getById(req.params.id);
        if (!medico) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        const obrasSociales = await medicosService.getObrasSociales(req.params.id);
        res.status(200).json({ ok: true, data: obrasSociales });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const asociarObraSocial = async (req, res) => {
    try {
        const result = await medicosService.asociarObraSocial(req.params.id, req.body.id_obra_social);
        if (result.medicoNoEncontrado) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        if (result.obraSocialNoEncontrada) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        if (result.duplicado) return res.status(409).json({ ok: false, message: 'El médico ya tiene asociada esa obra social' });
        res.status(201).json({ ok: true, message: 'Obra social asociada al médico', data: { id_medico_obra_social: result.insertId || result.id_medico_obra_social } });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

const desasociarObraSocial = async (req, res) => {
    try {
        const result = await medicosService.desasociarObraSocial(req.params.id, req.params.idObraSocial);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Asociación no encontrada' });
        res.status(200).json({ ok: true, message: 'Obra social desasociada del médico' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = {
    browse,
    read,
    add,
    edit,
    remove,
    asociarEspecialidad,
    listarObrasSociales,
    asociarObraSocial,
    desasociarObraSocial
};
