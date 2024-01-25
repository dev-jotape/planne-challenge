import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import routes from './routes';

const PORT = config.port || 3000;
const app = express();

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
    mongoose.set('debug', true);
    app.listen(PORT, () => {
        console.log('Server is running on port ', PORT)
    });
});
