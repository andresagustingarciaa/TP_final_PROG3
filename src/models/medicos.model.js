const pool = require('../db.js');

const getAll = async () => {
    const [rows] = await pool.query(`
        SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula, m.descripcion, m.valor_consulta,
               u.documento, u.apellido, u.nombres, u.email, u.foto_path,
               e.nombre AS especialidad
        FROM medicos m
        JOIN usuarios u ON m.id_usuario = u.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE u.activo = 1 AND e.activo = 1
    `);
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(`
        SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula, m.descripcion, m.valor_consulta,
               u.documento, u.apellido, u.nombres, u.email, u.foto_path,
               e.nombre AS especialidad
        FROM medicos m
        JOIN usuarios u ON m.id_usuario = u.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_medico = ? AND u.activo = 1 AND e.activo = 1
    `, [id]);
    return rows[0];
};

const getByMatricula = async (matricula) => {
    const [rows] = await pool.query(`
        SELECT m.* FROM medicos m
        JOIN usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.matricula = ? AND u.activo = 1
    `, [matricula]);
    return rows[0];
};

const getByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]);
    return rows[0];
};

const getByDocumento = async (documento) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE documento = ? AND activo = 1', [documento]);
    return rows[0];
};

const create = async (usuarioData, medicoData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [usuarioResult] = await connection.query(
            'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, 1, 1)',
            [usuarioData.documento, usuarioData.apellido, usuarioData.nombres, usuarioData.email, usuarioData.contrasenia, '']
        );

        const [medicoResult] = await connection.query(
            'INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)',
            [usuarioResult.insertId, medicoData.id_especialidad, medicoData.matricula, medicoData.descripcion, medicoData.valor_consulta]
        );

        await connection.commit();
        return { id_medico: medicoResult.insertId, id_usuario: usuarioResult.insertId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const update = async (id, usuarioData, medicoData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const medico = await getById(id);
        if (!medico) {
            await connection.rollback();
            return { affectedRows: 0 };
        }

        if (usuarioData.contrasenia) {
            await connection.query(
                'UPDATE usuarios SET documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ? WHERE id_usuario = ? AND activo = 1',
                [usuarioData.documento, usuarioData.apellido, usuarioData.nombres, usuarioData.email, usuarioData.contrasenia, medico.id_usuario]
            );
        } else {
            await connection.query(
                'UPDATE usuarios SET documento = ?, apellido = ?, nombres = ?, email = ? WHERE id_usuario = ? AND activo = 1',
                [usuarioData.documento, usuarioData.apellido, usuarioData.nombres, usuarioData.email, medico.id_usuario]
            );
        }

        const [result] = await connection.query(
            'UPDATE medicos SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?',
            [medicoData.id_especialidad, medicoData.matricula, medicoData.descripcion, medicoData.valor_consulta, id]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const remove = async (id) => {
    const medico = await getById(id);
    if (!medico) return { affectedRows: 0 };
    const [result] = await pool.query('UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1', [medico.id_usuario]);
    return result;
};

const updateEspecialidad = async (id, id_especialidad) => {
    const [result] = await pool.query(
        'UPDATE medicos SET id_especialidad = ? WHERE id_medico = ?',
        [id_especialidad, id]
    );
    return result;
};

// --- Obras sociales del medico ---

const getObrasSociales = async (id_medico) => {
    const [rows] = await pool.query(`
        SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social, os.nombre, os.descripcion, os.porcentaje_descuento
        FROM medicos_obras_sociales mos
        JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
        WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1
    `, [id_medico]);
    return rows;
};

const getAsociacionObraSocial = async (id_medico, id_obra_social) => {
    const [rows] = await pool.query(
        'SELECT * FROM medicos_obras_sociales WHERE id_medico = ? AND id_obra_social = ?',
        [id_medico, id_obra_social]
    );
    return rows[0];
};

const asociarObraSocial = async (id_medico, id_obra_social) => {
    const existente = await getAsociacionObraSocial(id_medico, id_obra_social);
    if (existente) {
        if (existente.activo === 1) return { duplicado: true };
        const [result] = await pool.query(
            'UPDATE medicos_obras_sociales SET activo = 1 WHERE id_medico_obra_social = ?',
            [existente.id_medico_obra_social]
        );
        return { ...result, id_medico_obra_social: existente.id_medico_obra_social };
    }
    const [result] = await pool.query(
        'INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo) VALUES (?, ?, 1)',
        [id_medico, id_obra_social]
    );
    return result;
};

const desasociarObraSocial = async (id_medico, id_obra_social) => {
    const [result] = await pool.query(
        'UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico = ? AND id_obra_social = ? AND activo = 1',
        [id_medico, id_obra_social]
    );
    return result;
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
    updateEspecialidad,
    getObrasSociales,
    asociarObraSocial,
    desasociarObraSocial
};
