import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import routes from './routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const PORT = config.port || 3000;
const app = express();

// swagger documentation
const options = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            description:
                'Swagger UI for Planne Challenge API.',
            version: '1.0.0',
            title: 'Planne Challenge',
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
            }
        },
        tags: [
            {
                name: 'buckets',
                description: 'Everything about buckets'
            },
            {
                name: 'fruits',
                description: 'Everything about fruits'
            }
        ],
        servers: [
          {
              url: `http://localhost:${PORT}`
          }
        ],
        schemes: ['http'],
    },
    apis: [
        path.join(__dirname, './routes/**/*.ts'),
        path.join(__dirname, './interfaces/**/*.ts'),
    ]
};
const swaggerSpec = swaggerJsdoc(options);

console.log(swaggerSpec);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(routes());

// error handling - Joi validation
app.use((error, req, res, next) => {
    if (error && error.toString().indexOf('Validation failed') !== -1) {
        return res.status(400).json({
            success: false,
            error: {
                name: 'INVALID_PAYLOAD',
                message: 'invalid payloads',
                details: error.details.get('query')
                    ? error.details.get('query').details
                    : error.details.get('body').details
            }
        });
    }
    next();
});

mongoose.connect(config.dbUrl!).then(() => {
    console.info('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log('Server is running on port ', PORT)
    });
});
