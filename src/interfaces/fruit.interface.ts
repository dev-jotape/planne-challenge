import mongoose from "mongoose";

/**
 * @swagger
 *  components:
 *    schemas:
 *      fruit:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          name:
 *            type: string
 *          price:
 *            type: number
 *          expireAt:
 *            type: string
 *            format: date-time
*/
export interface IFruit {
    _id: mongoose.Types.ObjectId,
    name: string,
    price: number,
    expireAt: Date
}