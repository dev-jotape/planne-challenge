import { Response, Request } from "express";
import { FruitService } from '../services/fruit.service';

class FruitController {
    private fruitService: FruitService;

    constructor() {
        this.fruitService = new FruitService();
    }

    create = async (req: Request, res: Response) => {
        const data = req.body;

        try {
            const result = await this.fruitService.create(data);
            return res.status(200).send({ success: true, fruit: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        try {
            const result = await this.fruitService.list();
            return res.status(200).send({ success: true, fruits: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const result = await this.fruitService.delete(req.params.id);
            return res.status(200).send({ success: true, deleted: result });
        } catch (error: any) {
            return res.status(400).send({ success: false, error: error.message });
        }
    }
}

export { FruitController }