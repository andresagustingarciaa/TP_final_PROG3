const obrasSocialesModel = require('../models/obras_sociales.model');

const getAll = async () => {            // Obtiene todas las obras sociales activas (llama al model)
    return await obrasSocialesModel.getAll();
};

const getById = async (id) => {         // Obtiene una obra social por su ID
    return await obrasSocialesModel.getById(id);
};

const getByName = async (nombre) => {   // Busca por nombre (para evitar duplicados)
    return await obrasSocialesModel.getByName(nombre);
};

const create = async (data) => {        // Crea una nueva obra social
    return await obrasSocialesModel.create(data);
};

const update = async (id, data) => {    // Actuliza una obra social existente
    return await obrasSocialesModel.update(id, data);
};

const remove = async (id) => {          // Elimina una obra social (soft delete)
    return await obrasSocialesModel.remove(id);
};

module.exports = { getAll, getById, getByName, create, update, remove };
