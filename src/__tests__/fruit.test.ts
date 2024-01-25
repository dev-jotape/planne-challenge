import { connect, closeDatabase } from '../config/memory-server';
import { FruitService } from '../services/fruit.service';
import { BucketService } from '../services/bucket.service';
import { Bucket, Fruit } from '../models';

describe('test fruits', () => {
    let fruitService: FruitService;
    let bucketService: BucketService;
    jest.useFakeTimers({ advanceTimers: true });

    beforeAll(async () => {
        fruitService = new FruitService();
        bucketService = new BucketService();
        await connect()
    });

    afterAll(async () => await closeDatabase());
    afterEach(async () => {
        await Fruit.deleteMany()
        await Bucket.deleteMany()
    });

    describe('create fruits', () => {
        it('should create a fruit successfully', async () => {
            const fruit = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            let expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + 30);

            const result = await fruitService.create(fruit);

            expect(result).toBeTruthy();
            expect(result._id).toBeTruthy();
            expect(result.name).toEqual(fruit.name);
            expect(result.price).toEqual(fruit.price);
            expect(result.expireAt.toString()).toEqual(expirationDate.toString());
        });

        it('should return error when trying to create a fruit with an invalid expiration date (value)', async () => {
            const fruit = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: 'abs'
            };

            try {
                await fruitService.create(fruit);
            } catch (error: any) {
                expect(error.message).toEqual('Invalid expiration value')
            }
        });

        it('should return error when trying to create a fruit with an invalid expiration date (unit)', async () => {
            const fruit = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '1d'
            };

            try {
                await fruitService.create(fruit);
            } catch (error: any) {
                expect(error.message).toEqual('Invalid unit. Use "s" for seconds, "m" for minutes, or "h" for hours.')
            }
        });
    });

    describe('list fruits', () => {
        it('list fruits checking expiration date', async () => {
            const fruit1 = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '5s'
            };
            const fruit2 = {
                name: 'Laranja',
                price: 0.80,
                expiration: '7s'
            };
            const fruit3 = {
                name: 'Uva',
                price: 3.95,
                expiration: '10s'
            };

            await Promise.all([
                fruitService.create(fruit1),
                fruitService.create(fruit2),
                fruitService.create(fruit3)
            ]);

            let list = await fruitService.list();
            expect(list.length).toBe(3);

            jest.advanceTimersByTime(5000);

            list = await fruitService.list();
            expect(list.length).toBe(2);

            jest.advanceTimersByTime(2000);

            list = await fruitService.list();
            expect(list.length).toBe(1);

            jest.advanceTimersByTime(3000);

            list = await fruitService.list();
            expect(list.length).toBe(0);
        });
    });

    describe('delete fruits', () => {
        it('should delete a fruit successfully', async () => {
            const fruit = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const created = await fruitService.create(fruit);
            const deleted = await fruitService.delete(created._id.toString());
            
            expect(created).toBeTruthy();
            expect(deleted).toBeTruthy();
        });

        it('should delete the fruit record and remove it from all buckets it belongs to', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            const bucket = await bucketService.create(5);
            await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());
            const bucketListBefore = await bucketService.list();

            const deleted = await fruitService.delete(fruit._id.toString());
            const bucketListAfter = await bucketService.list();
            
            expect(fruit).toBeTruthy();
            expect(deleted).toBeTruthy();
            expect(bucketListBefore[0].fruits.length).toBe(1);
            expect(bucketListAfter[0].fruits.length).toBe(0);
        });

        it('should return error when trying to delete a fruit using a invalid ID', async () => {
            const fruit = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const created = await fruitService.create(fruit);
            expect(created).toBeTruthy();

            try {
                await fruitService.delete('invalid');
            } catch (error: any) {
                expect(error.message).toBe('Cast to ObjectId failed for value "invalid" (type string) at path "_id" for model "Fruit"')  
            }
        });
    });
});