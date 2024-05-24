const express = require('express');
const mongoose = require('mongoose');
const hateoasLinker = require('express-hateoas-links');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(hateoasLinker);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/hospital');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Swagger configuración
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Hospital API',
            version: '1.0.0',
            description: 'API for managing patient medical records',
        },
        basePath: '/api/v1',
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
const patientRoutes = require('./routes/patients');
app.use('/api/v1/patients', patientRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
