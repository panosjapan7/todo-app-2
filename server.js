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

// Login User
app.post("/login", async (req, res) => {
    const { username, password} = req.body;
    const user = await User.findOne({ username }); //Checks if there is a username in db that's the same as the username passed in req
    if(!user || user.password !== password){
        res.status(403);
        res.json({
            message: "Invalid Login",
        });
        return;
    }
    res.json({
        message: "Success",
    });
})

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
        console.log("before { todos }");
        const { todos } = await Todos.findOne({userId: user._id}) || {} //Get just the todos from Schema, not the userId

        // todos.sort()
        
    // Sorts the todos array to descending by time
        // function sortTasks(a, b) {
        //     if(a.time < b.time){
        //         return 1;
        //     }
        //     if(a.time > b.time){
        //         return -1;
        //     }
        //     return 0;
        // }

        // if(todos !== undefined){

        //     todos.sort(function sortTasks(a, b){
        //         return a.time - b.time;
        //     })
            
        //     // todos.reverse()
        // }

        // todos.sort(sortTasks);
    // End of: Sorts the todos array to descending by time
    
    // console.log(todos);
    res.json(todos)
})

// Connects to server once connection with local db has been established
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(PORT, () => {
        console.log(`Connected to MongoDB local db. Server started on port ${PORT}`);
  });
});