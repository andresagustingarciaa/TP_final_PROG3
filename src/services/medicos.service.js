const bcrypt = require('bcryptjs');
const medicosModel = require('../models/medicos.model');
const especialidadesModel = require('../models/especialidades.model');
const obrasSocialesModel = require('../models/obras_sociales.model');

const getAll = async () => {
    return await medicosModel.getAll();
};

const getById = async (id) => {
    return await medicosModel.getById(id);
};

const getByMatricula = async (matricula) => {
    return await medicosModel.getByMatricula(matricula);
};

const getByEmail = async (email) => {
    return await medicosModel.getByEmail(email);
};

const getByDocumento = async (documento) => {
    return await medicosModel.getByDocumento(documento);
};

const create = async (data) => {
    const contraseniaHash = await bcrypt.hash(data.contrasenia, 10);
    const usuarioData = {
        documento: data.documento,
        apellido: data.apellido,
        nombres: data.nombres,
        email: data.email,
        contrasenia: contraseniaHash
    };
    const medicoData = {
        id_especialidad: data.id_especialidad,
        matricula: data.matricula,
        descripcion: data.descripcion || null,
        valor_consulta: data.valor_consulta
    };
    return await medicosModel.create(usuarioData, medicoData);
};

const update = async (id, data) => {
    const usuarioData = {
        documento: data.documento,
        apellido: data.apellido,
        nombres: data.nombres,
        email: data.email,
        contrasenia: data.contrasenia ? await bcrypt.hash(data.contrasenia, 10) : null
    };
    const medicoData = {
        id_especialidad: data.id_especialidad,
        matricula: data.matricula,
        descripcion: data.descripcion || null,
        valor_consulta: data.valor_consulta
    };
    return await medicosModel.update(id, usuarioData, medicoData);
};

const remove = async (id) => {
    return await medicosModel.remove(id);
};

const asociarEspecialidad = async (id_medico, id_especialidad) => {
    const medico = await medicosModel.getById(id_medico);
    if (!medico) return { medicoNoEncontrado: true };

    const especialidad = await especialidadesModel.getById(id_especialidad);
    if (!especialidad) return { especialidadNoEncontrada: true };

    return await medicosModel.updateEspecialidad(id_medico, id_especialidad);
};

const getObrasSociales = async (id_medico) => {
    return await medicosModel.getObrasSociales(id_medico);
};

const asociarObraSocial = async (id_medico, id_obra_social) => {
    const medico = await medicosModel.getById(id_medico);
    if (!medico) return { medicoNoEncontrado: true };

    const obraSocial = await obrasSocialesModel.getById(id_obra_social);
    if (!obraSocial) return { obraSocialNoEncontrada: true };

    return await medicosModel.asociarObraSocial(id_medico, id_obra_social);
};

const desasociarObraSocial = async (id_medico, id_obra_social) => {
    return await medicosModel.desasociarObraSocial(id_medico, id_obra_social);
};

module.exports = {
    getAll,
    getById,
    getByMatricula,
    getByEmail,
    getByDocumento,
    create,
    update,
    remove,
    asociarEspecialidad,
    getObrasSociales,
    asociarObraSocial,
    desasociarObraSocial
};
