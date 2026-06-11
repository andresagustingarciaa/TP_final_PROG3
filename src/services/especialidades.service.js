const especialidadesModel = require('../models/especialidades.model');

const getAll = async () => {            // Para btener todas las especialidades activas
    return await especialidadesModel.getAll();
};

const getById = async (id) => {         // Para obtener una especialidad por su ID
    return await especialidadesModel.getById(id);
};

const getByName = async (nombre) => {       // Buscar una especialidad por nombre (y para evitar duplicados)
    return await especialidadesModel.getByName(nombre);
};

const create = async (data) => {            // Crear una nueva especialidad
    return await especialidadesModel.create(data);
};

const update = async (id, data) => {        // Actualizar una especialidad existente
    return await especialidadesModel.update(id, data);
};

const remove = async (id) => {              // Eliminar una especialidad (soft delete)
    return await especialidadesModel.remove(id);
};

module.exports = { getAll, getById, getByName, create, update, remove };