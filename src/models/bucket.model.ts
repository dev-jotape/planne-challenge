import { Schema, model } from 'mongoose';

const bucketSchema = new Schema({
    capacity: {
        type: Number,
        required: true
    },
    fruits: [{
        type: Schema.Types.ObjectId,
        ref: 'Fruit'
    }],
});

const Bucket = model('Bucket', bucketSchema);

export { Bucket }