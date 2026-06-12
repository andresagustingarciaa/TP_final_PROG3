const obrasSocialesModel = require('../models/obras_sociales.model');

const getAll = async () => {
    return await obrasSocialesModel.getAll();
};

const getById = async (id) => {
    return await obrasSocialesModel.getById(id);
};

const getByName = async (nombre) => {
    return await obrasSocialesModel.getByName(nombre);
};

const create = async (data) => {
    return await obrasSocialesModel.create(data);
};

const update = async (id, data) => {
    return await obrasSocialesModel.update(id, data);
};

const remove = async (id) => {
    return await obrasSocialesModel.remove(id);
};

module.exports = { getAll, getById, getByName, create, update, remove };
