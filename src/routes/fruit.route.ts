import { Router } from 'express';
import { FruitController } from '../controllers/fruit.controller';

export default (app: Router) => {
    const route = Router();
    const controller = new FruitController();

    app.use('/fruits', route);

    route.post('/', controller.create);
    route.get('/', controller.list);
}