const pacientesModel = require('../models/pacientes.model');

const getAll = async () => {                            // Obtener todos los pacientes activos
    return await pacientesModel.getAll();
};

const getById = async (id) => {                         // Obtener un paciente por su ID
    return await pacientesModel.getById(id);
};

const getByUsuarioId = async (id_usuario) => {          // Buscar si un usuario ya es paciente (para evitar duplicados)
    return await pacientesModel.getByUsuarioId(id_usuario);
};

const create = async (data, id_usuario) => {            // Crear un nuevo paciente
    return await pacientesModel.create(data, id_usuario);
};

const update = async (id, data) => {                    // Actualizar datos de un paciente
    return await pacientesModel.update(id, data);
};

const remove = async (id) => {                          // Eliminar un paciente (soft delete sobre usuario)
    return await pacientesModel.remove(id);
};

module.exports = { getAll, getById, getByUsuarioId, create, update, remove };
