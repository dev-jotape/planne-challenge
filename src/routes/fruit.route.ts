import { Router } from 'express';
import { FruitController } from '../controllers/fruit.controller';
import * as FruitValidator from '../validators/fruit.validator';

export default (app: Router) => {
    const route = Router();
    const controller = new FruitController();

    app.use('/fruits', route);

    route.post('/', FruitValidator.create, controller.create);
    route.get('/', controller.list);
    route.delete('/:id', controller.delete);
}