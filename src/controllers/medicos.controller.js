const medicosService = require('../services/medicos.service');

// Devuelve todos los medicos activos con sus datos de usuario y especialidad
const browse = async (req, res) => {
    try {
        const medicos = await medicosService.getAll();
        res.status(200).json({ ok: true, data: medicos });
    } catch (error) {
        console.log('[medicos] error en browse:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve un medico por su id, solo si esta activo
const read = async (req, res) => {
    try {
        const medico = await medicosService.getById(req.params.id);
        if (!medico) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        res.status(200).json({ ok: true, data: medico });
    } catch (error) {
        console.log('[medicos] error en read:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Crea un nuevo medico (usuario + registro en tabla medicos)
// JSON esperado:
// {
//   "documento": "31000999",
//   "apellido": "García",
//   "nombres": "Ana",
//   "email": "ana@correo.com",
//   "contrasenia": "123456",
//   "id_especialidad": 1,
//   "matricula": 5000,
//   "descripcion": "Pediatra",
//   "valor_consulta": 8000
// }
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
        console.log('[medicos] creado ok:', result);
        res.status(201).json({ ok: true, data: result });
    } catch (error) {
        console.log('[medicos] error en add:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Actualiza los datos de un medico y su usuario asociado
// JSON esperado:
// {
//   "documento": "31000999",
//   "apellido": "García",
//   "nombres": "Ana",
//   "email": "ana@correo.com",
//   "contrasenia": "123456",        // opcional, solo si quiere cambiar la contraceña
//   "id_especialidad": 1,
//   "matricula": 5000,
//   "descripcion": "Pediatra",
//   "valor_consulta": 8000
// }
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
        console.log('[medicos] error en edit:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Elimina (soft delete) un medico desactvando su usuario
const remove = async (req, res) => {
    try {
        const result = await medicosService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        res.status(200).json({ ok: true, message: 'Médico eliminado' });
    } catch (error) {
        console.log('[medicos] error en remove:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Asocia una especialidad a un medico (cambia la que tenia)
// JSON esperado:
// {
//   "id_especialidad": 2
// }
const asociarEspecialidad = async (req, res) => {
    try {
        const result = await medicosService.asociarEspecialidad(req.params.id, req.body.id_especialidad);
        if (result.medicoNoEncontrado) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        if (result.especialidadNoEncontrada) return res.status(404).json({ ok: false, message: 'Especialidad no encontrada' });
        res.status(200).json({ ok: true, message: 'Especialidad asociada al médico' });
    } catch (error) {
        console.log('[medicos] error en asociarEspecialidad:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Lista las obras sociales asosiadas a un medico
const listarObrasSociales = async (req, res) => {
    try {
        const medico = await medicosService.getById(req.params.id);
        if (!medico) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        const obrasSociales = await medicosService.getObrasSociales(req.params.id);
        res.status(200).json({ ok: true, data: obrasSociales });
    } catch (error) {
        console.log('[medicos] error en listarObrasSociales:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Asocia una obra social a un medico
// JSON esperado:
// {
//   "id_obra_social": 2
// }
const asociarObraSocial = async (req, res) => {
    try {
        const result = await medicosService.asociarObraSocial(req.params.id, req.body.id_obra_social);
        if (result.medicoNoEncontrado) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });
        if (result.obraSocialNoEncontrada) return res.status(404).json({ ok: false, message: 'Obra social no encontrada' });
        if (result.duplicado) return res.status(409).json({ ok: false, message: 'El médico ya tiene asociada esa obra social' });
        console.log('[medicos] obra social asociada, id:', result.insertId || result.id_medico_obra_social);
        res.status(201).json({ ok: true, message: 'Obra social asociada al médico', data: { id_medico_obra_social: result.insertId || result.id_medico_obra_social } });
    } catch (error) {
        console.log('[medicos] error en asociarObraSocial:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Desasocia una obra social de un medico (soft delete en medicos_obras_sociales)
const desasociarObraSocial = async (req, res) => {
    try {
        const result = await medicosService.desasociarObraSocial(req.params.id, req.params.idObraSocial);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Asociación no encontrada' });
        res.status(200).json({ ok: true, message: 'Obra social desasociada del médico' });
    } catch (error) {
        console.log('[medicos] error en desasociarObraSocial:', error.message);
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
