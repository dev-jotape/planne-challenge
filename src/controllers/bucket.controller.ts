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
            return res.status(200).send({ success: true, bucket: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        try {
            const result = await this.bucketService.list();
            return res.status(200).send({ success: true, buckets: result});
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            await this.bucketService.delete(req.params.id);
            return res.status(200).send({ success: true });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    depositFruits = async (req: Request, res: Response) => {
        const { fruitId } = req.body;

        try {
            const result = await this.bucketService.depositFruits(req.params.id, fruitId);
            return res.status(200).send({ success: true, bucket: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    removeFruits = async (req: Request, res: Response) => {
        const { bucketId, fruitId } = req.params;

        try {
            const result = await this.bucketService.removeFruits(bucketId, fruitId);
            return res.status(200).send({ success: true, bucket: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }
}

export { BucketController }