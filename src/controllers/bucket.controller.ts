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
        } catch (error: any) {
            return res.status(400).send(error.message);
        }
    }

    list = async (req: Request, res: Response) => {
        try {
            const result = await this.bucketService.list();
            return res.status(200).send(result);
        } catch (error: any) {
            return res.status(400).send(error.message);
        }
    }

    depositFruits = async (req: Request, res: Response) => {
        const data = req.body;

        try {
            const result = await this.bucketService.depositFruits(req.params.id, data);
            return res.status(200).send(result);
        } catch (error: any) {
            return res.status(400).send(error.message);
        }
    }
}

export { BucketController }