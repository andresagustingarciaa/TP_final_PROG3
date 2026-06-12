const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const especialidadesRouter = require('./routes/especialidades.routes');
const obrasSocialesRouter = require('./routes/obras_sociales.routes');
const medicosRouter = require('./routes/medicos.routes');
const authRouter = require('./routes/auth.routes');
const pacientesRouter = require('./routes/pacientes.routes');
const turnosRouter = require('./routes/turnos.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/especialidades', especialidadesRouter);
app.use('/api/v1/obras-sociales', obrasSocialesRouter);
app.use('/api/v1/medicos', medicosRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pacientes', pacientesRouter);
app.use('/api/v1/turnos', turnosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ ok: true, message: 'Servidor funcionando!' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
