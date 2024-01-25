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
    expireAt: {
        type: Date,
        required: true
    }
}, { versionKey: false });

fruitSchema.index({expireAt: 1}, { expireAfterSeconds: 0 });
const Fruit = model('Fruit', fruitSchema);

export { Fruit }