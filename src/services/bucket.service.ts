import { Bucket, Fruit } from '../models';

class BucketService {
    create = async (capacity: number) => {
        try {
            const bucket = await Bucket.create({
                capacity
            });

            return bucket;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    list = async () => {
        try {
            const bucket = await Bucket.aggregate([
                // include fruits
                {
                    $lookup: {
                      from: 'fruits',
                      localField: 'fruits',
                      foreignField: '_id',
                      as: 'fruits',
                    },
                },
                // filter by valid fruits
                {
                    $match: {
                      "fruits.expireAt": { $gt: new Date() },
                    },
                },
                // format response (calculating the occupancy percentage)
                {
                  $project: {
                    _id: 1,
                    capacity: 1,
                    total_items: {$size: "$fruits"},
                    fruits: {
                        $map: {
                          input: '$fruits',
                          as: 'fruits',
                          in: {
                            _id: '$$fruits._id',
                            name: '$$fruits.name',
                            price: '$$fruits.price',
                            expireAt: '$$fruits.expireAt',
                          },
                        },
                      },
                    occupation: {
                      $multiply: [
                        { $divide: [ { $size: "$fruits" }, "$capacity" ] },
                        100
                      ]
                    },
                  },
                },
                // sort by occupation
                {
                  $sort: { occupation: 1 },
                },
              ]);

            return bucket;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    depositFruits = async (
        _id: string,
        fruit: {
            _id: string
        }
    ) => {
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
            const containFruit = bucket.fruits.find(el => el._id.toString() === fruit._id);
            if (containFruit) {
                throw new Error('Fruit is already in the bucket');
            }

            // check if is a valid fruit
            const isValid = await Fruit.findOne({
                _id: fruit._id,
                expireAt: { $gt: new Date() }
            });

            if (!isValid) {
                throw new Error('Fruit not found');
            }

            const result = await Bucket.updateOne({ _id }, { $push: { fruits: fruit._id } });

            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { BucketService }