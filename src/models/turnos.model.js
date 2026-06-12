const pool = require('../db.js');

const getAll = async () => {
    const [rows] = await pool.query(
        `SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido, tr.activo,
                tr.id_medico, CONCAT(um.apellido, ', ', um.nombres) AS medico,
                tr.id_paciente, CONCAT(up.apellido, ', ', up.nombres) AS paciente,
                tr.id_obra_social, os.nombre AS obra_social
         FROM turnos_reservas tr
         JOIN medicos m ON tr.id_medico = m.id_medico
         JOIN usuarios um ON m.id_usuario = um.id_usuario
         JOIN pacientes p ON tr.id_paciente = p.id_paciente
         JOIN usuarios up ON p.id_usuario = up.id_usuario
         JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
         WHERE tr.activo = 1
         ORDER BY tr.fecha_hora DESC`
    );
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        `SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido, tr.activo,
                tr.id_medico, CONCAT(um.apellido, ', ', um.nombres) AS medico,
                tr.id_paciente, CONCAT(up.apellido, ', ', up.nombres) AS paciente,
                tr.id_obra_social, os.nombre AS obra_social
         FROM turnos_reservas tr
         JOIN medicos m ON tr.id_medico = m.id_medico
         JOIN usuarios um ON m.id_usuario = um.id_usuario
         JOIN pacientes p ON tr.id_paciente = p.id_paciente
         JOIN usuarios up ON p.id_usuario = up.id_usuario
         JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
         WHERE tr.id_turno_reserva = ? AND tr.activo = 1`,
        [id]
    );
    return rows[0];
};

const getByMedico = async (id_medico) => {
    const [rows] = await pool.query(
        `SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                tr.id_paciente, CONCAT(up.apellido, ', ', up.nombres) AS paciente,
                tr.id_obra_social, os.nombre AS obra_social
         FROM turnos_reservas tr
         JOIN pacientes p ON tr.id_paciente = p.id_paciente
         JOIN usuarios up ON p.id_usuario = up.id_usuario
         JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
         WHERE tr.id_medico = ? AND tr.activo = 1
         ORDER BY tr.fecha_hora DESC`,
        [id_medico]
    );
    return rows;
};

const getByPaciente = async (id_paciente) => {
    const [rows] = await pool.query(
        `SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atentido,
                tr.id_medico, CONCAT(um.apellido, ', ', um.nombres) AS medico,
                tr.id_obra_social, os.nombre AS obra_social
         FROM turnos_reservas tr
         JOIN medicos m ON tr.id_medico = m.id_medico
         JOIN usuarios um ON m.id_usuario = um.id_usuario
         JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
         WHERE tr.id_paciente = ? AND tr.activo = 1
         ORDER BY tr.fecha_hora DESC`,
        [id_paciente]
    );
    return rows;
};

const create = async (data) => {
    const [result] = await pool.query(
        `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo)
         VALUES (?, ?, ?, ?, ?, 0, 1)`,
        [data.id_medico, data.id_paciente, data.id_obra_social, data.fecha_hora, data.valor_total]
    );
    return result;
};

const marcarAtendido = async (id) => {
    const [result] = await pool.query(
        `UPDATE turnos_reservas SET atentido = 1
         WHERE id_turno_reserva = ? AND activo = 1 AND atentido = 0`,
        [id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query(
        'UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ? AND activo = 1',
        [id]
    );
    return result;
};

module.exports = { getAll, getById, getByMedico, getByPaciente, create, marcarAtendido, remove };
