import { Joi, celebrate } from 'celebrate';
import { defaultSchema } from './defaultSchema';

export const create = celebrate({
    body: defaultSchema.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        expiration: Joi.string().required(),
    })
});