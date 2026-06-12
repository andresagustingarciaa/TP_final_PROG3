const turnosModel = require('../models/turnos.model');

const getAll = async () => {                            // Obtener todos los turnos activos
    return await turnosModel.getAll();
};

const getById = async (id) => {                         // Obtener un turno por su ID
    return await turnosModel.getById(id);
};

const getByMedico = async (id_medico) => {              // Listar turnos de un médico específico
    return await turnosModel.getByMedico(id_medico);
};

const getByPaciente = async (id_paciente) => {          // Listar turnos de un paciente específico
    return await turnosModel.getByPaciente(id_paciente);
};

const create = async (data) => {                        // Registrar un nuevo turno con valor_total calculado
    return await turnosModel.create(data);
};

const marcarAtendido = async (id) => {                  // Marcar un turno como atendido
    return await turnosModel.marcarAtendido(id);
};

const remove = async (id) => {                          // Cancelar un turno (soft delete)
    return await turnosModel.remove(id);
};

module.exports = { getAll, getById, getByMedico, getByPaciente, create, marcarAtendido, remove };
