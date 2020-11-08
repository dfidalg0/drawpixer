// eslint-disable-next-line no-unused-vars
import { MongoClient, Db } from 'mongodb';

const url = process.env.MONGO_URL;

let cachedClient = null;

/**
 * @returns {Promise<Db>}
 */
export async function getDb() {
    const client = await getClient();

    const db = client.db('drawpixer');

    return db;
}

export async function getSession(){
    const client = await getClient();

    return client.startSession();
}

/**
 * @returns {Promise<MongoClient>}
 */
async function getClient(){
    if (cachedClient) {
        return cachedClient;
    }

    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    cachedClient = client;

    return client;
}
