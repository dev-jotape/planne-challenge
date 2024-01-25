import { Router } from 'express';
import { BucketController } from '../controllers/bucket.controller';
import * as BucketValidator from '../validators/bucket.validator';

export default (app: Router) => {
    const route = Router();
    const controller = new BucketController();

    app.use('/buckets', route);

    /**
     * @swagger
     *
     * /buckets:
     *   post:
     *     tags:
     *       - "buckets"
     *     summary: "Create bucket"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               capacity:
     *                 type: number
     *                 required: true
     *                 description: Bucket capacity
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
     *                 bucket:
     *                   $ref: '#/components/schemas/createdBucket'
     */
    route.post('/', BucketValidator.create, controller.create);

    /**
     * @swagger
     *
     * /buckets:
     *   get:
     *     tags:
     *       - "buckets"
     *     summary: "List buckets"
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
     *                 buckets:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/bucket'
     */
    route.get('/', controller.list);

    /**
     * @swagger
     *
     * /buckets/{id}:
     *   delete:
     *     tags:
     *       - "buckets"
     *     summary: "Delete bucket"
     *     parameters:
     *      - in: path
     *        name: id
     *        description: Bucket ID
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
     *                   description: deleted bucket id
     */
    route.delete('/:id', controller.delete);

    /**
     * @swagger
     *
     * /buckets/{id}/fruits:
     *   post:
     *     tags:
     *       - "buckets"
     *     summary: "Deposit a fruit in a bucket"
     *     parameters:
     *      - in: path
     *        name: id
     *        description: Bucket ID
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
     *                 bucket:
     *                   $ref: '#/components/schemas/reducedBucket'
     */
    route.post('/:id/fruits', BucketValidator.depositFruits, controller.depositFruits);

    /**
     * @swagger
     *
     * /buckets/{bucketId}/fruits/{fruitId}:
     *   delete:
     *     tags:
     *       - "buckets"
     *     summary: "Remove a fruit in a bucket"
     *     parameters:
     *      - in: path
     *        name: bucketId
     *        description: Bucket ID
     *        required: true
     *        schema:
     *          type: string
     *      - in: path
     *        name: fruitId
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
     *                 bucket:
     *                   $ref: '#/components/schemas/reducedBucket'
     */
    route.delete('/:bucketId/fruits/:fruitId', controller.removeFruits);
}