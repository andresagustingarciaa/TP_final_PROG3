const turnosService = require('../services/turnos.service');
const pool = require('../db.js');

// Devuelve todos los turnos activos
const browse = async (req, res) => {
    try {
        const turnos = await turnosService.getAll();
        res.status(200).json({ ok: true, data: turnos });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve un turno por su ID
const read = async (req, res) => {
    try {
        const turno = await turnosService.getById(req.params.id);
        if (!turno) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
        res.status(200).json({ ok: true, data: turno });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve todos los turnos de un médico
const byMedico = async (req, res) => {
    try {
        const turnos = await turnosService.getByMedico(req.params.id_medico);
        res.status(200).json({ ok: true, data: turnos });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Devuelve todos los turnos de un paciente
const byPaciente = async (req, res) => {
    try {
        const turnos = await turnosService.getByPaciente(req.params.id_paciente);
        res.status(200).json({ ok: true, data: turnos });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Registra un nuevo turno calculando el valor_total según obra social del paciente
const add = async (req, res) => {
    try {
        const { id_medico, id_paciente, fecha_hora } = req.body;

        // Obtener datos del médico (valor_consulta)
        const [medicoRows] = await pool.query(
            'SELECT m.valor_consulta, m.id_medico FROM medicos m JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE m.id_medico = ? AND u.activo = 1',
            [id_medico]
        );
        if (medicoRows.length === 0) return res.status(404).json({ ok: false, message: 'Médico no encontrado' });

        // Obtener datos del paciente (obra social y su descuento)
        const [pacienteRows] = await pool.query(
            `SELECT p.id_obra_social, os.porcentaje_descuento
             FROM pacientes p
             JOIN usuarios u ON p.id_usuario = u.id_usuario
             JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
             WHERE p.id_paciente = ? AND u.activo = 1`,
            [id_paciente]
        );
        if (pacienteRows.length === 0) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });

        const { valor_consulta } = medicoRows[0];
        const { id_obra_social, porcentaje_descuento } = pacienteRows[0];

        // Calcular valor total con descuento de la obra social
        const descuento = (valor_consulta * porcentaje_descuento) / 100;
        const valor_total = parseFloat((valor_consulta - descuento).toFixed(2));

        const result = await turnosService.create({ id_medico, id_paciente, id_obra_social, fecha_hora, valor_total });

        res.status(201).json({
            ok: true,
            data: {
                id_turno_reserva: result.insertId,
                id_medico,
                id_paciente,
                id_obra_social,
                fecha_hora,
                valor_total
            }
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Marca un turno como atendido
const atender = async (req, res) => {
    try {
        const result = await turnosService.marcarAtendido(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: 'Turno no encontrado o ya fue marcado como atendido' });
        }
        res.status(200).json({ ok: true, message: 'Turno marcado como atendido' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Cancela (soft delete) un turno
const remove = async (req, res) => {
    try {
        const result = await turnosService.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
        res.status(200).json({ ok: true, message: 'Turno cancelado' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { browse, read, byMedico, byPaciente, add, atender, remove };
