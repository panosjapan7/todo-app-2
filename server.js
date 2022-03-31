const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

mongoose.connect("mongodb://localhost/todo-app-2");

app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
    const { username, password} = req.body;
    res.json({
        username,
        password,
    });
})

// app.listen(PORT, () => {

// })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
        console.log(`Connected to MongoDB local db. Server started on port ${PORT}`);
  });
});