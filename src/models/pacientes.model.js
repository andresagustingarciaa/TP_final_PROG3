const pool = require('../db.js');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM v_pacientes');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        `SELECT p.id_paciente, p.id_usuario, u.documento, u.apellido, u.nombres, u.email,
                u.foto_path, os.id_obra_social, os.nombre AS nombre_obra_social,
                os.descripcion AS descripcion_obra_social, os.porcentaje_descuento
         FROM pacientes p
         JOIN usuarios u ON p.id_usuario = u.id_usuario
         JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
         WHERE p.id_paciente = ? AND u.activo = 1`,
        [id]
    );
    return rows[0];
};

const getByUsuarioId = async (id_usuario) => {
    const [rows] = await pool.query(
        'SELECT * FROM pacientes WHERE id_usuario = ?',
        [id_usuario]
    );
    return rows[0];
};

const create = async (data, id_usuario) => {
    const [result] = await pool.query(
        'INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)',
        [id_usuario, data.id_obra_social]
    );
    return result;
};

const update = async (id, data) => {
    const [result] = await pool.query(
        `UPDATE pacientes p
         JOIN usuarios u ON p.id_usuario = u.id_usuario
         SET u.documento = ?, u.apellido = ?, u.nombres = ?, u.email = ?, p.id_obra_social = ?
         WHERE p.id_paciente = ? AND u.activo = 1`,
        [data.documento, data.apellido, data.nombres, data.email, data.id_obra_social, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query(
        `UPDATE usuarios u
         JOIN pacientes p ON p.id_usuario = u.id_usuario
         SET u.activo = 0
         WHERE p.id_paciente = ? AND u.activo = 1`,
        [id]
    );
    return result;
};

module.exports = { getAll, getById, getByUsuarioId, create, update, remove };
