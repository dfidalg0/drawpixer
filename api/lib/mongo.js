// eslint-disable-next-line no-unused-vars
import { MongoClient, Db } from 'mongodb';

const url = process.env.MONGO_URL;

let cachedDb = null;

/**
 * @returns {Db}
 */
export default async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb
    }

    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = await client.db('drawpixer');

    cachedDb = db
    return db
}
