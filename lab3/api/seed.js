require('dotenv').config({ path: __dirname + '/.env' });
const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/';
const DB_NAME = process.env.MONGO_DB || 'scriptlangs_db';
const COLLECTION_NAME = process.env.MONGO_COLLECTION || 'messages';

async function seed() {
    const client = new MongoClient(MONGO_URL);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const text = process.env.MESSAGE || 'Привіт з MongoDB!';

        await collection.deleteMany({});
        await collection.insertOne({ text });

        console.log(`Inserted message: "${text}"`);
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await client.close();
    }
}

seed();