import React, { useState } from 'react'

export default function Todos() {
    const [todos, setTodos] = useState([{text: "what is up dawg",}]);
    const [todoText, setTodoText] = useState("");
    const addTodo = (e) => {
        e.preventDefault();
        if(!todoText) return; // Prevents the user from creating a blank todo

        const newTodo = { checked: false, text: todoText}
        setTodos([...todos, newTodo])
        
        setTodoText(""); // clears the text if the input that adds new todo
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
