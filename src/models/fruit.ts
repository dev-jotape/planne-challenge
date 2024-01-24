import { Schema, model } from 'mongoose';

const fruitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expiration: {
        type: String,
        required: true
    },
});

const Fruit = model('Fruit', fruitSchema);

export { Fruit }