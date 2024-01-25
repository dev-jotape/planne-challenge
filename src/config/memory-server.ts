
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
 export const closeDatabase = async () => {
  await mongod.stop();
};