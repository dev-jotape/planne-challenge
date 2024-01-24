import { Router } from 'express';
import bucketRoute from './bucket.route';

export default (): Router => {
    const app = Router();
    bucketRoute(app);

    return app;
}