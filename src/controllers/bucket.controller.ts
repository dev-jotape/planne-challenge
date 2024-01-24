import { Response, Request } from "express";
import { BucketService } from '../services/bucket.service';

class BucketController {
    private bucketService: BucketService;

    constructor() {
        this.bucketService = new BucketService();
    }

    create = async (req: Request, res: Response) => {
        const data = req.body;

        try {
            const result = await this.bucketService.create(parseInt(data.capacity));
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export { BucketController }