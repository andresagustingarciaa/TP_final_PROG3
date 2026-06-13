const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Dependencias de Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const especialidadesRouter = require('./routes/especialidades.routes');
const obrasSocialesRouter = require('./routes/obras_sociales.routes');
const medicosRouter = require('./routes/medicos.routes');
const authRouter = require('./routes/auth.routes');
const pacientesRouter = require('./routes/pacientes.routes');
const turnosRouter = require('./routes/turnos.routes');
const adminRouter = require('./routes/admin.routes');
const pdfRouter = require('./routes/pdf.routes');
const app = express();

// Opciones de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Médica',
            version: '1.0.0',
            description: 'Documentación de la API del Trabajo Final Integrador de Programación III',
        },
        servers: [ { url: 'http://localhost:3000' } ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    // Le dice a Swagger que lea los comentarios de todos los archivos de rutas
    apis: ['./src/routes/*.js'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ruta para ver la documentación visual de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/especialidades', especialidadesRouter);
app.use('/api/v1/obras-sociales', obrasSocialesRouter);
app.use('/api/v1/medicos', medicosRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pacientes', pacientesRouter);
app.use('/api/v1/turnos', turnosRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/reportes', pdfRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ ok: true, message: 'Servidor funcionando!' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = app;