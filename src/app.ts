import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import routes from './routes';

const PORT = config.port || 3000;
const app = express();

app.use(express.json());
app.use(routes());

mongoose.connect(config.dbUrl!).then(() => {
    console.info('Connected to MongoDB');
    mongoose.set('debug', true);
    app.listen(PORT, () => {
        console.log('Server is running on port ', PORT)
    });
});
