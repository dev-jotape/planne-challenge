import { Bucket, Fruit } from '../models';
import { ICreatedBucket, IBucket, IReducedBucket } from '../interfaces/bucket.interface';

class BucketService {
    create = async (capacity: number): Promise<ICreatedBucket> => {
        try {
            const bucket = await Bucket.create({
                capacity
            });

            return bucket;
        } catch (error) {
            throw error;
        }
    }

    list = async (): Promise<IBucket[]> => {
        try {
          const buckets: IReducedBucket[] = await Bucket.find().populate({
            path: "fruits",
            select: "_id name price expireAt",
            match: { expireAt: {$gt: new Date()}}
          });

          const formatedBucket = buckets.map(bucket => {
            const occupation = bucket.fruits.length
                                ? (bucket.fruits.length / bucket.capacity) * 100
                                : 0;
            const totalPrice = bucket.fruits.length
                                ? bucket.fruits.reduce((accumulator, currentValue) => accumulator + currentValue['price'], 0)
                                : 0;
            return {
              _id: bucket._id,
              capacity: bucket.capacity,
              occupation,
              fruits: bucket.fruits,
              totalPrice: parseFloat(totalPrice.toFixed(2))
            }
          });

          return formatedBucket.sort((a, b) => b.occupation - a.occupation);
        } catch (error) {
            throw error;
        }
    }

    delete = async (_id: string): Promise<string> => {
      try {
        const bucket = await Bucket.findById(_id).populate({
          path: "fruits",
          select: "_id",
          match: { expireAt: {$gt: new Date()}}
        });

        if (!bucket) {
          throw new Error('Bucket not found');
        }

        if (bucket.fruits.length > 0) {
          throw new Error('Bucket not empty');
        }

        await Bucket.deleteOne({ _id });
        return _id;
      } catch (error) {
        throw error;
      }
    }

    depositFruits = async (
        _id: string,
        fruitId: string
    ): Promise<IReducedBucket> => {
        try {
            const bucket = await Bucket.findById(_id).populate({
                path: "fruits",
                select: "_id",
                match: { expireAt: {$gt: new Date()}}
            });

            if (!bucket) {
                throw new Error('Bucket not found');
            }

            if (bucket.fruits.length >= bucket.capacity) {
                throw new Error('Bucket above the capacity');
            }

            // check if the fruit is already in the bucket
            const containFruit = bucket.fruits.find(el => el._id.toString() === fruitId);
            if (containFruit) {
                throw new Error('Fruit is already in the bucket');
            }

            // check if is a valid fruit
            const isValid = await Fruit.findOne({
                _id: fruitId,
                expireAt: { $gt: new Date() }
            });

            if (!isValid) {
                throw new Error('Fruit not found');
            }

            const result: IReducedBucket | null = await Bucket.findByIdAndUpdate({ _id }, { $push: { fruits: fruitId } }, { new: true }).populate({
              path: "fruits",
              select: "_id name price expireAt",
              match: { expireAt: {$gt: new Date()}}
            });

            return result!;
        } catch (error) {
            throw error;
        }
    }

    removeFruits = async (bucketId: string, fruitId: string): Promise<IReducedBucket> => {
      try {
        const bucket = await Bucket.findById(bucketId);

        if (!bucket) {
          throw new Error('Bucket not found');
        }

        const result: IReducedBucket | null = await Bucket.findByIdAndUpdate({ _id: bucketId }, { $pull: { fruits: fruitId } }, { new: true }).populate({
          path: "fruits",
          select: "_id name price expireAt",
          match: { expireAt: {$gt: new Date()}}
        });

        return result!;
      } catch (error) {
        throw error;
      }
    }
}

export { BucketService }