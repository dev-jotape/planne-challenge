import { Bucket, Fruit } from '../models';
import { connect, closeDatabase } from '../config/memory-server';
import { BucketService } from '../services/bucket.service';
import { FruitService } from '../services/fruit.service';
import mongoose from 'mongoose';

describe('test bucket', () => {
    let bucketService: BucketService;
    let fruitService: FruitService;
    jest.useFakeTimers({ advanceTimers: true });

    beforeAll(async () => {
        bucketService = new BucketService();
        fruitService = new FruitService();
        await connect()
    });

    afterAll(async () => await closeDatabase());
    afterEach(async () => {
        await Fruit.deleteMany()
        await Bucket.deleteMany()
    });

    describe('create bucket', () => {
        it('should create a bucket successfully', async () => {
            const result = await bucketService.create(10);

            expect(result).toBeTruthy();
            expect(result.capacity).toBe(10);
        });

        it('should return error when trying to create a bucket with an invalid capacity', async () => {
            try {
                await bucketService.create(-10);
            } catch (error: any) {
                expect(error.message).toBe("Bucket validation failed: capacity: should be at least 1")
            }
        });
    });

    describe('deposit fruits', () => {
        it('should deposit a fruit in a bucket successfully', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            const bucket = await bucketService.create(5);
            const deposit = await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());

            expect(fruit).toBeTruthy();
            expect(bucket).toBeTruthy();
            expect(deposit!.fruits.length).toBe(1);
            expect(deposit!.fruits[0]._id.toString()).toBe(fruit._id.toString());
        });

        it('should return error when trying to deposit a fruit in an invalid bucket', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);

            try {
                const invalidId = new mongoose.Types.ObjectId();
                await bucketService.depositFruits(invalidId.toString(), fruit._id.toString());
            } catch (error: any) {
                expect(error.message).toBe('Bucket not found')
            }
        });

        it('should return error when trying to deposit a fruit with an invalid fruitID', async () => {
            const bucket = await bucketService.create(5);

            try {
                const invalidId = new mongoose.Types.ObjectId();
                await bucketService.depositFruits(bucket._id.toString(), invalidId.toString());
            } catch (error: any) {
                expect(error.message).toBe('Fruit not found')
            }
        });

        it('should return error when trying to deposit a fruit in a full bucket', async () => {
            const obj1 = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };
            const obj2 = {
                name: 'Uva',
                price: 0.8,
                expiration: '30s'
            };

            const [fruit1, fruit2] = await Promise.all([
                fruitService.create(obj1),
                fruitService.create(obj2)
            ]);
            const bucket = await bucketService.create(1);
            await bucketService.depositFruits(bucket._id.toString(), fruit1._id.toString());

            try {
                await bucketService.depositFruits(bucket._id.toString(), fruit2._id.toString());
            } catch (error: any) {
                expect(error.message).toBe('Bucket above the capacity')
            }
        });

        it('should return error when trying to deposit the same fruit twice', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            const bucket = await bucketService.create(5);
            await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());

            try {
                await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());
            } catch (error: any) {
                expect(error.message).toBe('Fruit is already in the bucket')
            }
        });
    });

    describe('remove fruits', () => {
        it('should remove a fruit from a bucket successfully', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            const bucket = await bucketService.create(5);
            const deposit = await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());
            const removed = await bucketService.removeFruits(bucket._id.toString(), fruit._id.toString());

            expect(fruit).toBeTruthy();
            expect(bucket).toBeTruthy();
            expect(deposit!.fruits.length).toBe(1);
            expect(deposit!.fruits[0]._id.toString()).toBe(fruit._id.toString());
            expect(removed!.fruits.length).toBe(0);
        });

        it('should return error when trying to remove a fruit from an invalid bucket', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            try {
                const invalidId = new mongoose.Types.ObjectId();
                await bucketService.removeFruits(invalidId.toString(), fruit._id.toString());
            } catch (error: any) {
                expect(error.message).toBe('Bucket not found')
            }
        });
    });

    describe('delete bucket', () => {
        it('should delete a bucket successfully', async () => {
            const bucket = await bucketService.create(5);
            const deletedBucket = await bucketService.delete(bucket._id.toString());

            expect(bucket).toBeTruthy();
            expect(deletedBucket).toBe(bucket._id.toString());
        });

        it('should return error when trying to delete an invalid bucket', async () => {
            try {
                const invalidId = new mongoose.Types.ObjectId();
                await bucketService.delete(invalidId.toString());
            } catch (error: any) {
                expect(error.message).toBe('Bucket not found')
            }
        });

        it('should return error when trying to delete a bucket that is not empty', async () => {
            const obj = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '30s'
            };

            const fruit = await fruitService.create(obj);
            const bucket = await bucketService.create(5);
            await bucketService.depositFruits(bucket._id.toString(), fruit._id.toString());

            try {
                await bucketService.delete(bucket._id.toString());
            } catch (error: any) {
                expect(error.message).toBe('Bucket not empty')
            }
        });
    });

    describe('list buckets', () => {
        it('list buckets checking expiration date', async () => {
            const obj1 = {
                name: 'Abacaxi',
                price: 4.95,
                expiration: '5s'
            };
            const obj2 = {
                name: 'Laranja',
                price: 0.80,
                expiration: '7s'
            };
            const obj3 = {
                name: 'Uva',
                price: 3.95,
                expiration: '10s'
            };

            const [bucket1, bucket2, bucket3] = await Promise.all([
                bucketService.create(4),
                bucketService.create(4),
                bucketService.create(4)
            ]);

            const [fruit1, fruit2, fruit3] = await Promise.all([
                fruitService.create(obj1),
                fruitService.create(obj2),
                fruitService.create(obj3)
            ]);

            await Promise.all([
                // bucket 1
                bucketService.depositFruits(bucket1._id.toString(), fruit1._id.toString()),
                bucketService.depositFruits(bucket1._id.toString(), fruit2._id.toString()),
                bucketService.depositFruits(bucket1._id.toString(), fruit3._id.toString()),

                // bucket 2
                bucketService.depositFruits(bucket2._id.toString(), fruit1._id.toString()),
                bucketService.depositFruits(bucket2._id.toString(), fruit2._id.toString()),

                // bucket 3
                bucketService.depositFruits(bucket3._id.toString(), fruit1._id.toString()),
            ])

            // first list
            let list = await bucketService.list();

            expect(list.length).toBe(3);

            expect(list[0]._id.toString()).toBe(bucket1._id.toString());
            expect(list[0].occupation).toBe(75);
            expect(list[0].totalPrice).toBe((fruit1.price + fruit2.price + fruit3.price));

            expect(list[1]._id.toString()).toBe(bucket2._id.toString());
            expect(list[1].occupation).toBe(50);
            expect(list[1].totalPrice).toBe((fruit1.price + fruit2.price));

            expect(list[2]._id.toString()).toBe(bucket3._id.toString());
            expect(list[2].occupation).toBe(25);
            expect(list[2].totalPrice).toBe(fruit1.price);

            
            // list after 5 seconds
            jest.advanceTimersByTime(5000);
            list = await bucketService.list();

            expect(list[0]._id.toString()).toBe(bucket1._id.toString());
            expect(list[0].occupation).toBe(50);
            expect(list[0].totalPrice).toBe((fruit2.price + fruit3.price));

            expect(list[1]._id.toString()).toBe(bucket2._id.toString());
            expect(list[1].occupation).toBe(25);
            expect(list[1].totalPrice).toBe(fruit2.price);

            expect(list[2]._id.toString()).toBe(bucket3._id.toString());
            expect(list[2].occupation).toBe(0);
            expect(list[2].totalPrice).toBe(0);

            // list after 7 seconds
            jest.advanceTimersByTime(2000);
            list = await bucketService.list();

            expect(list[0]._id.toString()).toBe(bucket1._id.toString());
            expect(list[0].occupation).toBe(25);
            expect(list[0].totalPrice).toBe(fruit3.price);

            expect(list[1]._id.toString()).toBe(bucket2._id.toString());
            expect(list[1].occupation).toBe(0);
            expect(list[1].totalPrice).toBe(0);

            expect(list[2]._id.toString()).toBe(bucket3._id.toString());
            expect(list[2].occupation).toBe(0);
            expect(list[2].totalPrice).toBe(0);

            // list after 10 seconds
            jest.advanceTimersByTime(3000);
            list = await bucketService.list();

            expect(list[0]._id.toString()).toBe(bucket1._id.toString());
            expect(list[0].occupation).toBe(0);
            expect(list[0].totalPrice).toBe(0);

            expect(list[1]._id.toString()).toBe(bucket2._id.toString());
            expect(list[1].occupation).toBe(0);
            expect(list[1].totalPrice).toBe(0);

            expect(list[2]._id.toString()).toBe(bucket3._id.toString());
            expect(list[2].occupation).toBe(0);
            expect(list[2].totalPrice).toBe(0);
        });
    });
});