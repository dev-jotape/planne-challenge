import { Router } from 'express';
import bucketRoute from './bucket.route';
import fruitRoute from './fruit.route';

export default (): Router => {
    const app = Router();
    bucketRoute(app);
    fruitRoute(app);

    return app;
}