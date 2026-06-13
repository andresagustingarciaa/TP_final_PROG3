const estadisticasModel = require('../models/estadisticas.model');

// Devuelve un objeto combinado con las tres estadísticas, generadas
// exclusivamente mediante stored procedures (requisito del enunciado)
const getEstadisticas = async () => {
    const [generales, porObraSocial, porMedico] = await Promise.all([
        estadisticasModel.getGenerales(),
        estadisticasModel.getPorObraSocial(),
        estadisticasModel.getPorMedico(),
    ]);

    return { generales, porObraSocial, porMedico };
};

module.exports = { getEstadisticas };
