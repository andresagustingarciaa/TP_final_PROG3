const pool = require('../db.js');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE activo = 1');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id]);
    return rows[0];
};

const create = async (data) => {
    const [result] = await pool.query('INSERT INTO especialidades (nombre, activo) VALUES (?, 1)', [data.nombre]);
    return result;
};

const getByName = async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE nombre = ? AND activo = 1', [nombre]);
    return rows[0];
};

const update = async (id, data) => {
    const [result] = await pool.query('UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1', [data.nombre, id]);
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query('UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1', [id]);
    return result;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};