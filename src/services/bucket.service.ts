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
                // deconstructs fruits array
                {
                  $unwind: {
                    path: '$allFruits',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                // filter by valid fruits
                {
                  $match: {
                    $or: [
                      { "fruits": [] },
                      { "fruits.expireAt": { $gt: new Date() } },
                    ],
                  },
                },
                // format response (calculating the occupancy percentage)
                {
                  $project: {
                    _id: 1,
                    capacity: 1,
                    totalFruits: {$size: "$fruits"},
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
                    totalPrice: { $sum: '$fruits.price' }, 
                  },
                },
                // sort by occupation (descending)
                {
                  $sort: { occupation: -1 },
                },
              ]);

            return bucket;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    delete = async (_id: string) => {
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
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    depositFruits = async (
        _id: string,
        fruitId: string
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

            const result = await Bucket.findByIdAndUpdate({ _id }, { $push: { fruits: fruitId } }, { new: true }).populate({
              path: "fruits",
              select: "_id name price expireAt",
              match: { expireAt: {$gt: new Date()}}
            });

            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    removeFruits = async (bucketId: string, fruitId: string) => {
      try {
        const bucket = await Bucket.findById(bucketId);

        if (!bucket) {
          throw new Error('Bucket not found');
        }

        const result = await Bucket.findByIdAndUpdate({ _id: bucketId }, { $pull: { fruits: fruitId } }, { new: true }).populate({
          path: "fruits",
          select: "_id name price expireAt",
          match: { expireAt: {$gt: new Date()}}
        });;

        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
}

export { BucketService }