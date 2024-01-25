import { Router } from 'express';
import { BucketController } from '../controllers/bucket.controller';

export default (app: Router) => {
    const route = Router();
    const controller = new BucketController();

    app.use('/buckets', route);

    route.post('/', controller.create);
    route.get('/', controller.list);
    route.delete('/:id', controller.delete);
    route.post('/:id/fruits', controller.depositFruits);
    route.delete('/:bucketId/fruits/:fruitId', controller.removeFruits);
}