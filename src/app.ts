import express from 'express';
import config from './config';
import mongoose from 'mongoose';

const PORT = config.port || 3000;
const app = express();

app.use(express.json());

console.log(config.dbUrl);

mongoose.connect(config.dbUrl!).then(() => {
    console.info('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log('Server is running on port ', PORT)
    });
});
