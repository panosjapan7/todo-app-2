import React, { useState, useContext, useEffect } from 'react';
import { CredentialsContext } from '../App';

export default function Todos() {
    const [todos, setTodos] = useState([]);
    const [todoText, setTodoText] = useState("");
    const [credentials, setCredentials] = useContext(CredentialsContext);

    

    const persist = (newTodos) => {
        fetch(`http://localhost:4000/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify(newTodos) //we're passing the todos
        })
        .then(() => {})
        
    }

    const addTodo = (e) => {
        e.preventDefault();
        if(!todoText) return; // Prevents the user from creating a blank todo

        const newTodo = { checked: false, text: todoText}
        const newTodos = [...todos, newTodo];
        setTodos(newTodos)
        
        setTodoText(""); // clears the text if the input that adds new todo
        
        persist(newTodos);
    }

    const toggleTodo = (index) => {
        const newTodoList = [...todos];
        newTodoList[index].checked = !newTodoList[index].checked; // changes the value of "checked" to its opposite
        setTodos(newTodoList);

    }

    return (
    <div>
        {todos.map((todo, index) => (
            <div key={index} >
                <input 
                    onChange={() => toggleTodo(index)}
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
