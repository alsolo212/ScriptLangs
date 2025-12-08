// api/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// Конфіг з .env
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/';
const DB_NAME = process.env.MONGO_DB || 'scriptlangs_db';
const COLLECTION_NAME = process.env.MONGO_COLLECTION || 'messages';

let collection;

// Підключення до MongoDB один раз при старті
async function connectDb() {
    try {
        // ❗ БЕЗ useUnifiedTopology
        const client = new MongoClient(MONGO_URL);
        await client.connect();

        const db = client.db(DB_NAME);
        collection = db.collection(COLLECTION_NAME);

        console.log(
            `Connected to MongoDB: ${MONGO_URL}${DB_NAME}, collection ${COLLECTION_NAME}`
        );
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

connectDb();

// GET / – віддати одне повідомлення з БД
app.get('/', async (req, res) => {
    try {
        if (!collection) {
            return res.status(503).send('Database not ready');
        }

        const doc = await collection.findOne({});
        if (!doc || !doc.text) {
            return res.status(404).send('No message found in MongoDB');
        }

        res.send(doc.text);
    } catch (err) {
        console.error('Error in GET /:', err);
        res.status(500).send('Internal server error');
    }
});

// POST /message – оновити/створити текст
app.post('/message', async (req, res) => {
    try {
        if (!collection) {
            return res.status(503).send('Database not ready');
        }

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Field "text" is required' });
        }

        const result = await collection.findOneAndUpdate(
            {},
            { $set: { text } },
            { upsert: true, returnDocument: 'after' }
        );

        res.json(result.value);
    } catch (err) {
        console.error('Error in POST /message:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = app;