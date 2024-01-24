import { Router } from 'express';
import { BucketController } from '../controllers/bucket.controller';

export default (app: Router) => {
    const route = Router();
    const controller = new BucketController();

    app.use('/buckets', route);

    route.post('/', controller.create);
}