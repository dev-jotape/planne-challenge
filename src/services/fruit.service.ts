import { Fruit, Bucket } from '../models';
import { IFruit } from '../interfaces/fruit.interface';

class FruitService {      
    create = async (data: {
        name: string,
        price: number,
        expiration: string
    }): Promise<IFruit> => {
        try {
            const numericValue = parseInt(data.expiration);
            const unit = data.expiration.slice(-1);
            if (!numericValue) {
                throw new Error('Invalid expiration value');
            }

            let expirationDate = new Date();

            switch (unit) {
                case 's':
                  expirationDate.setSeconds(expirationDate.getSeconds() + numericValue);
                  break;
                case 'm':
                  expirationDate.setMinutes(expirationDate.getMinutes() + numericValue);
                  break;
                case 'h':
                  expirationDate.setHours(expirationDate.getHours() + numericValue);
                  break;
                default:
                  throw new Error('Invalid unit. Use "s" for seconds, "m" for minutes, or "h" for hours.');
            }

            const fruit = await Fruit.create({
                ...data,
                expireAt: expirationDate
            });

            return fruit;
        } catch (error) {
            throw error;
        }
    }

    list = async (): Promise<IFruit[]> => {
        try {
            const result = await Fruit.find({ expireAt: { $gt: new Date() } });
            return result; 
        } catch (error) {
            throw error;
        }
    }

    delete = async (_id: string): Promise<string> => {
        try {
            await Fruit.deleteOne({ _id });

            // remove from all buckets
            await Bucket.updateMany(
                { fruits: _id },
                { $pull: { fruits: _id } }
            );

            return _id; 
        } catch (error) {
            throw error;
        }
    }
}

export { FruitService }