import React, { useState } from 'react'

export default function Todos() {
    const [todos, setTodos] = useState([
        {
            id: 1,
            text: "what is up dawg",
        }
    ]);


    return (
    <div>
        {todos.map((todo) => (
            <div key={todo.id} >
                <input type="checkbox" />
                <label>{todo.text}</label>
            </div>
        ))}
        <br />
        <input type="text"></input>
        <button>Add</button>
    </div>
    )
}
