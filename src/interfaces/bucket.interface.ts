import mongoose from "mongoose";
import { IFruit } from './fruit.interface';

/**
 * @swagger
 *  components:
 *    schemas:
 *      createdBucket:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          capacity:
 *            type: number
*/
export interface ICreatedBucket {
    _id: mongoose.Types.ObjectId,
    capacity: number,
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      bucket:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          capacity:
 *            type: number
 *          occupation:
 *            type: number
 *          totalPrice:
 *            type: number
 *          fruits:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/fruit'
*/
export interface IBucket {
    _id: mongoose.Types.ObjectId,
    capacity: number,
    occupation: number,
    totalPrice: number,
    fruits: IFruit[],
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      reducedBucket:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          capacity:
 *            type: number
 *          fruits:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/fruit'
*/
export interface IReducedBucket {
    _id: mongoose.Types.ObjectId,
    capacity: number,
    fruits: IFruit[],
}