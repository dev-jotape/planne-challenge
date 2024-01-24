import express from 'express';
import config from './config';

const PORT = config.port || 3000;
const app = express();

app.use(express.json());

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
});