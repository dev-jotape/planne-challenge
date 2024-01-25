import { Schema, model } from 'mongoose';

const bucketSchema = new Schema({
    capacity: {
        type: Number,
        required: true,
        min: [1, 'should be at least 1']
    },
    fruits: [{
        type: Schema.Types.ObjectId,
        ref: 'Fruit'
    }],
}, { versionKey: false });

const Bucket = model('Bucket', bucketSchema);

export { Bucket }