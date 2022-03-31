import React, { useState } from 'react'

export default function Todos() {
    const [todos, setTodos] = useState([]);


    return (
    <div>
        {todos.map(todo => {
            <div>
                <input id="checkbox1" type="checkbox" />
                <label>what is up</label>
            </div>
        })}
        <br />
        <input type="text"></input>
        <button>Add</button>
    </div>
    )
}
