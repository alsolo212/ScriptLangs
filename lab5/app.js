const express = require("express");
const mongoose = require("mongoose");

const app = express();
const jsonParser = express.json();

//     STATIC FILES
app.use(express.static(__dirname + "/public"));

//  MONGO CONNECTION

// Значения берутся из переменных окружения docker-compose.
// На всякий случай есть дефолты, чтобы код не падал, если запустить без compose.
const {
    MONGO_DB_HOSTNAME = "localhost",
    MONGO_DB_PORT = 27017,
    MONGO_DB = "usersDB"
} = process.env;

const mongoUrl = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("Успішне підключення до MongoDB:", mongoUrl);

        app.listen(3000, () => {
            console.log("Сервер запущено на http://localhost:3000");
        });
    })
    .catch((err) => {
        console.error("Помилка підключення до MongoDB:", err);
    });

//   СХЕМА + МОДЕЛЬ
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        height: Number,
        weight: Number,
    },
    { versionKey: false }
);

const User = mongoose.model("User", userSchema);

//        API

// Отримати всіх користувачів
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка сервера");
    }
});

// Отримати одного користувача
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка сервера");
    }
});

// Додати нового користувача
app.post("/api/users", jsonParser, async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            height: req.body.height,
            weight: req.body.weight,
        });
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка сервера");
    }
});

// Видалити користувача
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка сервера");
    }
});

// Оновити користувача
app.put("/api/users", jsonParser, async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                height: req.body.height,
                weight: req.body.weight,
            },
            { new: true }
        );
        res.send(updated);
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка сервера");
    }
});
