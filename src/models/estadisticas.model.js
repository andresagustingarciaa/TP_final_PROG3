const pool = require('../db.js');

// Resumen general de turnos (totales, atendidos, pendientes, recaudado)
const getGenerales = async () => {
    const [rows] = await pool.query('CALL sp_estadisticas_generales()');
    return rows[0][0];
};

// Estadísticas agrupadas por obra social
const getPorObraSocial = async () => {
    const [rows] = await pool.query('CALL sp_estadisticas_por_obra_social()');
    return rows[0];
};

// Estadísticas agrupadas por médico
const getPorMedico = async () => {
    const [rows] = await pool.query('CALL sp_estadisticas_por_medico()');
    return rows[0];
};

module.exports = { getGenerales, getPorObraSocial, getPorMedico };
