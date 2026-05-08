const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const especialidadesRouter = require('./routes/especialidades.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/especialidades', especialidadesRouter);

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