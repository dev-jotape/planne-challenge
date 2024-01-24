import { Fruit } from '../models';

class FruitService {      
    create = async (data: {
        name: string,
        price: number,
        expiration: string
    }) => {
        try {
            const numericValue = parseInt(data.expiration);
            const unit = data.expiration.slice(-1);

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
            console.error(error);
            throw error;
        }
    }

    list = async () => {
        try {
            const result = await Fruit.find({ expireAt: { $gt: new Date() } });
            return result; 
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { FruitService }