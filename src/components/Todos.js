import React, { useState, useContext, useEffect } from 'react';
import { CredentialsContext } from '../App';
import { v4 as uuidv4 } from "uuid";

export default function Todos() {
    const [todos, setTodos] = useState([]);
    const [todoText, setTodoText] = useState("");
    const [credentials, setCredentials] = useContext(CredentialsContext);
    const [filter, setFilter] = useState("uncompleted");
    

    const persist = (newTodos) => {
        fetch(`http://localhost:4000/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify(newTodos), //we're passing the todos
        })
        .then(() => {
            persistFetch();
            console.log("persistFetch() triggered")
        })
    };    

    // I execute this when the user adds a new task while logged in - otherwise, I need to refresh the page somehow to have useEffect() run and do the job
    // and I wasn't sure how to achieve that.
    const persistFetch = () => {
        fetch(`http://localhost:4000/todos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials.username}:${credentials.password}`,
        },
    })
    .then((response) => response.json())
    .then((todos) => {
        
        todos.sort(sortTasks) // sorts task by time
        
        // todos.reverse() 

        setTodos(todos)
    })
    }

    // Sorts tasks by time field        
    function sortTasks(a, b) {
        if(a.time < b.time){
            return 1;
        }
        if(a.time > b.time){
            return -1;
        }
        return 0;
    }
    
    // Fetches the todos from the user's todos Schema when the Todos.js components mounts/loads
        useEffect(() => {
            fetch(`http://localhost:4000/todos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
        })
        .then((response) => response.json())
        .then((todos) => {
            
            todos.sort(sortTasks); // sorts task by time
            
            // todos.reverse() 

            setTodos(todos)
            console.log("useEffect() triggered")
            // console.log(todos)
        })
        }, [])

    const addTodo = (e) => {
        e.preventDefault()
        if(!todoText) return; // Prevents the user from creating a blank todo

        // const newTodo = { id: uuidv4(), checked: false, text: todoText, time: "2022-04-03T07:43:55.557+00:00" }
        const newTodo = { id: uuidv4(), checked: false, text: todoText, time: new Date() }
        console.log(newTodo.time);

        todos.unshift(newTodo); //Inserts thew newly added todo task element in the first position in the array instead of the last position

        // const newTodos = [...todos, newTodo];
        // const newTodos = [...todos];
        
        setTodos(todos)
        
        setTodoText(""); // clears the text if the input that adds new todo

        persist(todos)

    }

    // Turns the value of "time: new Date()" to a more readable date format
    function readableDate(d){
        const date = new Date(d).toGMTString();
        return date;
    }


    const toggleTodo = (id) => {
        const newTodoList = [...todos];
        
        // changes the value of "checked" to its opposite
        const todoItem = newTodoList.find((todo) => todo.id === id)
        todoItem.checked = !todoItem.checked;
        
        setTodos(newTodoList);
        persist(newTodoList);
        persistFetch()
    }

    const getTodos = () => {
        return todos.filter((todo) => filter === "completed" ? todo.checked : !todo.checked);
    }

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    }

    return (
    <div>
        <select value={filter} onChange={(e) => changeFilter(e.target.value)}>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
        </select>
        {getTodos().map((todo) => (
            <div key={todo.id} >
                <input 
                    checked={todo.checked}
                    onChange={() => toggleTodo(todo.id)}
                    type="checkbox" 
                />
                <label>{todo.text} </label>
                
                <span>(created: {readableDate(todo.time)})</span> 
                
            </div>
        ))}

        <br />
        <form onSubmit={addTodo}>
            <input 
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                type="text">    
            </input>
            <button type="submit">Add</button>
        </form>
    </div>
    )
}
