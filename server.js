const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

mongoose.connect("mongodb://localhost/todo-app-2");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
})

const User = mongoose.model("User", userSchema)

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password} = req.body;
    const user = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
    if(user){
        res.status(500);
        res.json({
            message: "Username already exists"
        });
        return;
    }
    await User.create({ username, password });
    res.json({
        message: "Success",
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