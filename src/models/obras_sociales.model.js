const pool = require('../db.js');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE activo = 1');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1', [id]);
    return rows[0];
};

const getByName = async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE nombre = ? AND activo = 1', [nombre]);
    return rows[0];
};

const create = async (data) => {
    const [result] = await pool.query(
        'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular, activo) VALUES (?, ?, ?, ?, 1)',
        [data.nombre, data.descripcion, data.porcentaje_descuento, data.es_particular]
    );
    return result;
};

const update = async (id, data) => {
    const [result] = await pool.query(
        'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1',
        [data.nombre, data.descripcion, data.porcentaje_descuento, data.es_particular, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query('UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ? AND activo = 1', [id]);
    return result;
};

module.exports = { getAll, getById, getByName, create, update, remove };
