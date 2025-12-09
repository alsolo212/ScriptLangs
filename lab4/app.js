const express = require("express");
const mongoose = require("mongoose");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

// ПОДКЛЮЧЕНИЕ К MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/usersDB")
    .then(() => {

        app.listen(3000, () => {
            console.log("Сервер запущено на http://localhost:3000");
        });
    })
    .catch(err => {
        console.error("Помилка підключення до MongoDB:", err);
    });

//   СХЕМА + МОДЕЛЬ
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    height: Number,
    weight: Number
}, { versionKey: false });

const User = mongoose.model("User", userSchema);

//        API

// Отримати всіх користувачів
app.get("/api/users", async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

// Отримати одного користувача
app.get("/api/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
});

// Додати нового користувача
app.post("/api/users", jsonParser, async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight
    });
    res.send(user);
});

// Видалити користувача
app.delete("/api/users/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
});

// Оновити користувача
app.put("/api/users", jsonParser, async (req, res) => {
    const updated = await User.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            height: req.body.height,
            weight: req.body.weight
        },
        { new: true }  // повернути оновлений документ
    );
    res.send(updated);
});
