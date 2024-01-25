import { Joi, celebrate } from 'celebrate';
import { defaultSchema } from './defaultSchema';

export const create = celebrate({
    body: defaultSchema.object({
        capacity: Joi.number().min(1).required()
    })
});

export const depositFruits = celebrate({
    body: defaultSchema.object({
        fruitId: Joi.string().required()
    })
});