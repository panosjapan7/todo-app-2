require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

// Connects to our local MongoDB db
mongoose.connect("mongodb://localhost/todo-app-2");

// User Schema
    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, trim: true},
        password: { type: String, required: true, trim: true},
        token: {type: String},
    })
    const User = mongoose.model("User", userSchema) // Creates a User model

// Todo tasks Schema
    const todosSchema = new mongoose.Schema({
        userId: String,
        todos: [
            {
                checked: Boolean,
                text: String,
                id: String,
                // time : { type : Date, default: Date.now }, // Testing purposes
                time : Date, 
            },
        ],
    })
    const Todos = mongoose.model("Todos", todosSchema) // Creates a Todos model


app.use(cors());
app.use(express.json());


// Register User
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


// Login User - with JWT
app.post("/login", async (req, res) => {
    const { username, password} = req.body;
    const loggedInUser = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
    if(!loggedInUser || loggedInUser.password !== password){
        res.status(403);
        res.json({
            message: "Invalid Login",
        });
        return;
    }
    const token = jwt.sign(
        {
            user_id: loggedInUser._id,
            username: loggedInUser.username
        
        }, process.env.ACCESS_TOKEN_SECRET);

        loggedInUser.token = token;
    await loggedInUser.save();

        const user = {
            username: loggedInUser.username,
            token: loggedInUser.token,
        }

    console.log("user with new token:", user)
    res.json({user: user});
})

// Login User
// app.post("/login", async (req, res) => {
//     const { username, password} = req.body;
//     const user = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
//     if(!user || user.password !== password){
//         res.status(403);
//         res.json({
//             message: "Invalid Login",
//         });
//         return;
//     }
//     res.json({
//         message: "Success",
//     });
// })

// Creates Todos array that contains the tasks
app.post("/todos", async (req, res) => {
    //Authorization
    // We want to check which user accessed the "/todos" endpoint:
        const { authorization } = req.headers; //saves the user credentials to this object
        const [, token] = authorization.split(" ");
        const [username, password] = token.split(":");
        const todosItems = req.body; // Includes the array of Todo tasks that's sent
        console.log("req.body")
        console.log(req.body)
    
    // If the user doesn't exist, we send an error message
        const user = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
        if(!user || user.password !== password){
            res.status(403);
            res.json({
                message: "Invalid Login",
            });
            return;
        }
    //End of Authorization

    //Finds the todos Schema that matches the user's id
        const todos = await Todos.findOne({userId: user._id})
        
        //If it won't find a Todos Schema model that matches the user's id, it creates a new todos Schema for that user
            if(!todos) {
                await Todos.create({
                    userId: user._id,
                    todos: todosItems,
                })
            }
        //If a Todos Schema model that matches the user's id already exists, it saves the todo array that was sent to the user's Todos model
            else{
                todos.todos = todosItems;
                await todos.save();
            }
    
    res.json(todosItems);
})

// Renders the Todos array
app.get("/todos", async (req, res) => {
    //Authorization
    // We want to check which user accessed the "/todos" endpoint:
        const { authorization } = req.headers; //saves the user credentials to this object
        const [, token] = authorization.split(" ");
        const [username, password] = token.split(":");
    
    // If the user doesn't exist, we send an error message
        const user = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
        if(!user || user.password !== password){
            res.status(403);
            res.json({
                message: "Invalid Login",
            });
            return;
        }
    //End of Authorization

    //Finds the todos Schema that matches the user's id
        const { todos } = await Todos.findOne({userId: user._id}) || {} //Get just the todos from Schema, not the userId

    res.json(todos)
})


function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    // Check first if we have an authHeader; if yes, save the TOKEN portion; otherwise, it will be undefined.
    const token = authHeader && authHeader.split(" ")[1]; 
    if(token == null) {
        return sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);} // We can see that you have a token, but this token is no longer valid so you don't have access
        req.user = user;
        console.log("req.user:", req.user)
        next();
    })
}

// Connects to server once connection with local db has been established
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
        console.log(`Connected to MongoDB local db. Server started on port ${PORT}`);
  });
});