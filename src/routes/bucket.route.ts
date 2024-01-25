import { Router } from 'express';
import { BucketController } from '../controllers/bucket.controller';
import * as BucketValidator from '../validators/bucket.validator';

export default (app: Router) => {
    const route = Router();
    const controller = new BucketController();

    app.use('/buckets', route);

    route.post('/', BucketValidator.create, controller.create);
    route.get('/', controller.list);
    route.delete('/:id', controller.delete);
    route.post('/:id/fruits', BucketValidator.depositFruits, controller.depositFruits);
    route.delete('/:bucketId/fruits/:fruitId', controller.removeFruits);
}