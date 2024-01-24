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
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    list = async (req: Request, res: Response) => {
        const result = await this.fruitService.list();
        return res.status(200).send(result);
    }
}

export { FruitController }