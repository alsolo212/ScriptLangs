const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const jsonParser = express.json();

const client = new MongoClient("mongodb://localhost:27017/");
let db;

// статика
app.use(express.static(__dirname + "/public"));

async function start() {
    try {
        await client.connect();
        db = client.db("usersDB");                    // НОВА база
        app.locals.collection = db.collection("users"); // НОВА колекція
        app.listen(3000, () => {
            console.log("Сервер запущено: http://localhost:3000");
        });
    } catch (err) {
        console.error("Помилка підключення до MongoDB:", err);
        process.exit(1);
    }
}

start();

// ====== API для users ======

// Отримати всіх користувачів
app.get("/api/users", async (req, res) => {
    const users = await req.app.locals.collection.find({}).toArray();
    res.send(users);
});

// Отримати одного користувача
app.get("/api/users/:id", async (req, res) => {
    const user = await req.app.locals.collection.findOne({
        _id: new ObjectId(req.params.id)
    });
    res.send(user);
});

// Додати нового користувача
app.post("/api/users", jsonParser, async (req, res) => {
    const user = {
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight
    };
    const result = await req.app.locals.collection.insertOne(user);
    user._id = result.insertedId;
    res.send(user);
});

// Видалити користувача
app.delete("/api/users/:id", async (req, res) => {
    const result = await req.app.locals.collection.findOneAndDelete({
        _id: new ObjectId(req.params.id)
    });
    res.send(result?.value ?? null);
});

// Оновити користувача
app.put("/api/users", jsonParser, async (req, res) => {
    const id = new ObjectId(req.body.id);

    const updated = await req.app.locals.collection.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                name: req.body.name,
                height: req.body.height,
                weight: req.body.weight
            }
        },
        { returnDocument: "after" }
    );

    res.send(updated?.value ?? null);
});

// Коректне завершення
process.on("SIGINT", async () => {
    await client.close();
    process.exit();
});