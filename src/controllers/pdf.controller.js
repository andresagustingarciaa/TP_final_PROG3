const PDFDocument = require('pdfkit');
const pool = require('../db.js');

// Genera un PDF con el informe de turnos.
// Incluye: total de turnos, turnos atendidos, desglose por obra social,
// y lista detallada de turnos con paciente, médico, fecha y valor.
// Solo accesible para administradores (ROL = 3).
const generarInformeTurnos = async (req, res) => {
    try {
        // Resumen general: total y atendidos
        const [resumen] = await pool.query(`
            SELECT
                COUNT(*) AS total_turnos,
                SUM(atentido = 1) AS turnos_atendidos,
                SUM(atentido = 0) AS turnos_pendientes,
                SUM(valor_total) AS monto_total
            FROM turnos_reservas
            WHERE activo = 1
        `);

        // Desglose por obra social
        const [porObraSocial] = await pool.query(`
            SELECT
                os.nombre AS obra_social,
                COUNT(tr.id_turno_reserva) AS cantidad_turnos,
                SUM(tr.valor_total) AS monto_total
            FROM turnos_reservas tr
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.activo = 1
            GROUP BY os.id_obra_social, os.nombre
            ORDER BY cantidad_turnos DESC
        `);

        // Lista detallada de turnos
        const [detalle] = await pool.query(`
            SELECT
                tr.id_turno_reserva,
                CONCAT(up.apellido, ', ', up.nombres) AS paciente,
                CONCAT(um.apellido, ', ', um.nombres) AS medico,
                os.nombre AS obra_social,
                tr.fecha_hora,
                tr.valor_total,
                tr.atentido
            FROM turnos_reservas tr
            JOIN pacientes p ON tr.id_paciente = p.id_paciente
            JOIN usuarios up ON p.id_usuario = up.id_usuario
            JOIN medicos m ON tr.id_medico = m.id_medico
            JOIN usuarios um ON m.id_usuario = um.id_usuario
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.activo = 1
            ORDER BY tr.fecha_hora DESC
            LIMIT 100
        `);

        // Crear documento PDF
        const doc = new PDFDocument({ margin: 50 });

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="informe-turnos.pdf"');
        doc.pipe(res);

        // ── Encabezado ──────────────────────────────────────────
        doc.fontSize(20).font('Helvetica-Bold').text('Clínica Médica', { align: 'center' });
        doc.fontSize(14).font('Helvetica').text('Informe de Turnos', { align: 'center' });
        doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-AR')}`, { align: 'center' });
        doc.moveDown(1.5);

        // ── Resumen general ──────────────────────────────────────
        doc.fontSize(13).font('Helvetica-Bold').text('Resumen General');
        doc.moveDown(0.4);
        doc.fontSize(11).font('Helvetica');

        const r = resumen[0];
        doc.text(`Total de turnos: ${r.total_turnos}`);
        doc.text(`Turnos atendidos: ${r.turnos_atendidos}`);
        doc.text(`Turnos pendientes: ${r.turnos_pendientes}`);
        doc.text(`Monto total facturado: $${Number(r.monto_total || 0).toFixed(2)}`);
        doc.moveDown(1.5);

        // ── Por obra social ──────────────────────────────────────
        doc.fontSize(13).font('Helvetica-Bold').text('Turnos por Obra Social');
        doc.moveDown(0.4);

        if (porObraSocial.length === 0) {
            doc.fontSize(11).font('Helvetica').text('Sin datos.');
        } else {
            // Encabezado de tabla
            const colOS = 200, colCant = 100, colMonto = 120;
            const xOS = 50, xCant = xOS + colOS, xMonto = xCant + colCant;

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Obra Social', xOS, doc.y, { width: colOS, continued: false });
            const yHeader = doc.y - doc.currentLineHeight();
            doc.text('Cantidad', xCant, yHeader, { width: colCant });
            doc.text('Monto Total', xMonto, yHeader, { width: colMonto });
            doc.moveDown(0.2);
            doc.moveTo(50, doc.y).lineTo(520, doc.y).stroke();
            doc.moveDown(0.3);

            doc.font('Helvetica').fontSize(10);
            for (const fila of porObraSocial) {
                const y = doc.y;
                doc.text(fila.obra_social, xOS, y, { width: colOS });
                doc.text(String(fila.cantidad_turnos), xCant, y, { width: colCant });
                doc.text(`$${Number(fila.monto_total || 0).toFixed(2)}`, xMonto, y, { width: colMonto });
                doc.moveDown(0.1);
            }
        }
        doc.moveDown(1.5);

        // ── Detalle de turnos ────────────────────────────────────
        doc.fontSize(13).font('Helvetica-Bold').text('Últimos 100 Turnos');
        doc.moveDown(0.4);

        if (detalle.length === 0) {
            doc.fontSize(11).font('Helvetica').text('Sin turnos registrados.');
        } else {
            doc.fontSize(9).font('Helvetica-Bold');
            const xPac = 50, xMed = 180, xFecha = 310, xValor = 400, xEst = 465;

            doc.text('Paciente', xPac, doc.y, { width: 130 });
            const yH2 = doc.y - doc.currentLineHeight();
            doc.text('Médico', xMed, yH2, { width: 130 });
            doc.text('Fecha', xFecha, yH2, { width: 90 });
            doc.text('Valor', xValor, yH2, { width: 65 });
            doc.text('Estado', xEst, yH2, { width: 55 });
            doc.moveDown(0.2);
            doc.moveTo(50, doc.y).lineTo(520, doc.y).stroke();
            doc.moveDown(0.3);

            doc.font('Helvetica').fontSize(9);
            for (const t of detalle) {
                // Salto de página si se acerca al borde
                if (doc.y > 720) {
                    doc.addPage();
                }
                const y = doc.y;
                const fecha = new Date(t.fecha_hora).toLocaleDateString('es-AR');
                const estado = t.atentido ? 'Atendido' : 'Pendiente';

                doc.text(t.paciente, xPac, y, { width: 130 });
                doc.text(t.medico, xMed, y, { width: 130 });
                doc.text(fecha, xFecha, y, { width: 90 });
                doc.text(`$${Number(t.valor_total).toFixed(2)}`, xValor, y, { width: 65 });
                doc.text(estado, xEst, y, { width: 55 });
                doc.moveDown(0.15);
            }
        }

        doc.end();
    } catch (error) {
        // Si ya se empezó a escribir el PDF no podemos cambiar el estatus,
        // así que solo terminamos el stream con un error logueado
        console.error('[pdf] error generando informe:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ ok: false, message: error.message });
        }
    }
};

module.exports = { generarInformeTurnos };