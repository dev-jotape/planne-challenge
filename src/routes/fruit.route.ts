import { Router } from 'express';
import { FruitController } from '../controllers/fruit.controller';
import * as FruitValidator from '../validators/fruit.validator';

export default (app: Router) => {
    const route = Router();
    const controller = new FruitController();

    app.use('/fruits', route);

    /**
     * @swagger
     *
     * /fruits:
     *   post:
     *     tags:
     *       - "fruits"
     *     summary: "Create fruit"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 required: true
     *               price:
     *                 type: number
     *                 required: true
     *               expiration:
     *                 type: string
     *                 required: true
     *                 description: Use "s" for seconds, "m" for minutes, or "h" for hours 
     *                 default: 1s
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 fruit:
     *                   $ref: '#/components/schemas/fruit'
     */
    route.post('/', FruitValidator.create, controller.create);

    /**
     * @swagger
     *
     * /fruits:
     *   get:
     *     tags:
     *       - "fruits"
     *     summary: "List fruits"
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 fruits:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/fruit'
     */
    route.get('/', controller.list);

    /**
     * @swagger
     *
     * /fruits/{id}:
     *   delete:
     *     tags:
     *       - "fruits"
     *     summary: "Delete fruit"
     *     parameters:
     *      - in: path
     *        name: id
     *        description: Fruit ID
     *        required: true
     *        schema:
     *          type: string
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 deleted:
     *                   type: string
     *                   description: deleted fruit id
     */
    route.delete('/:id', controller.delete);
}