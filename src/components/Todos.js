import React, { useState, useContext, useEffect } from 'react';
import { CredentialsContext } from '../App';

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
        .then(() => {})
    };

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
        .then((todos) => setTodos(todos))
        }, [])

    const addTodo = (e) => {
        e.preventDefault();
        if(!todoText) return; // Prevents the user from creating a blank todo

        const newTodo = { checked: false, text: todoText}
        const newTodos = [...todos, newTodo];
        setTodos(newTodos)
        
        setTodoText(""); // clears the text if the input that adds new todo
        
        persist(newTodos);
    }

    const toggleTodo = (id) => {
        const newTodoList = [...todos];
        
        // changes the value of "checked" to its opposite
        const todoItem = newTodoList.find((todo) => todo._id === id);
        todoItem.checked = !todoItem.checked;
        
        setTodos(newTodoList);
        persist(newTodoList);
    }

    const getTodos = () => {
        return todos.filter((todo) => filter === "completed" ? todo.checked : !todo.checked);
    }

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };

    return (
    <div>
        <select onChange={(e) => changeFilter(e.target.value)}>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
        </select>
        {getTodos().map((todo) => (
            <div key={todo._id} >
                <input 
                    checked={todo.checked}
                    onChange={() => toggleTodo(todo._id)}
                    type="checkbox" 
                />
                <label>{todo.text}</label>
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
