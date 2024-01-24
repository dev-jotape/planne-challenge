import { Bucket } from '../models';

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
}

export { BucketService }