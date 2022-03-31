import React, { useState } from 'react'

export default function Todos() {
    const [todos, setTodos] = useState([{text: "what is up dawg",}]);
    const [todoText, setTodoText] = useState("");
    const addTodo = (e) => {
        e.preventDefault();
        if(!todoText) return; // Prevents the user from creating a blank todo
        setTodos([...todos, {text: todoText}])
        setTodoText(""); // clears the text if the input that adds new todo
    }

    return (
    <div>
        {todos.map((todo, index) => (
            <div key={index} >
                <input type="checkbox" />
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
