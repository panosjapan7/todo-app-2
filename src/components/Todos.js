import React, { useState, useContext, useEffect } from 'react';
import { CredentialsContext } from '../App';
import { v4 as uuidv4 } from "uuid"; // It wasn't storing unique ids to Todo tasks so I am using this.

export default function Todos() {
    const [todos, setTodos] = useState([]); // Array that includes all the Todo tasks of a user
    const [todoText, setTodoText] = useState(""); // Value of one Todo task sent via form
    const [credentials, setCredentials] = useContext(CredentialsContext);
    const [filter, setFilter] = useState("uncompleted"); 
    
    //For Sorting function
    const [sortBy, setSortBy] = useState("time")
    //END OF For Sorting function

    // For Search function
        const [searchInput, setSearchInput] = useState("");
    // END OF For Search function

    // Makes a request to backend and sends the current state of the Todos array to our backend
    const persist = (newTodos) => {
        fetch(`http://localhost:4000/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify(newTodos), //we're passing the updated todos array
        })
        .then(() => {
            persistFetch();
            console.log("persistFetch() triggered")
        })
    };    

    // I execute this when the user adds a new task while logged in - otherwise, I need to refresh the page in some way to execute useEffect() again and do the rendering
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
        console.log("persistFetch triggered")
        console.log("sortBy value in persistFetch:", sortBy)


        if(sortBy === "timeAsc"){
            // todos.sort(sortTasks) // sorts task by time
            todos.sort((a,b) => (a.time < b.time) ? 1 : ((a.time > b.time) ? -1 : 0))
        }
        if(sortBy === "timeDesc"){
            // todos.sort(sortTasks) // sorts task by time
            todos.sort((a,b) => (a.time < b.time) ? -1 : ((a.time > b.time) ? 1 : 0))
        }
        if(sortBy === "textAsc"){
            todos.sort((a,b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))
        }
        if(sortBy === "textDesc"){
            todos.sort((a,b) => (a.text > b.text) ? -1 : ((b.text > a.text) ? 1 : 0));
        };

        setTodos(todos);
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
    
    
    // Fetches the Todos array from the user's Todos model when the Todos.js components loads/reloads
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
            
            console.log("useEffect() triggered")
            console.log("sortBy value in useEffect:", sortBy)
           
            // Sorting    
            if(sortBy === "timeAsc"){
                // todos.sort(sortTasks) // sorts task by time
                todos.sort((a,b) => (a.time < b.time) ? 1 : ((a.time > b.time) ? -1 : 0))
            }
            if(sortBy === "timeDesc"){
                // todos.sort(sortTasks) // sorts task by time
                todos.sort((a,b) => (a.time < b.time) ? -1 : ((a.time > b.time) ? 1 : 0))
            }
            if(sortBy === "textAsc"){
                todos.sort((a,b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0))
            }
            if(sortBy === "textDesc"){
                todos.sort((a,b) => (a.text > b.text) ? -1 : ((b.text > a.text) ? 1 : 0));
            }

            setTodos(todos);
        })
    }, [sortBy])

    // Creates a Todo task
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

    // Hides checked Todo task that has this id
    const toggleTodo = (id) => {
        const newTodoList = [...todos];
        
        // changes the value of "checked" to its opposite
        const todoItem = newTodoList.find((todo) => todo.id === id) // Finds the todo task whose checkbox was clicked
        todoItem.checked = !todoItem.checked; // Changes checked value to the opposite of what it was
        
        setTodos(newTodoList); // Sends a new array of todo tasks with updated checkbox values
        persist(newTodoList);
        persistFetch()
    }

    // Filters the "todo" array and shows the Todo tasks that match the "filter" variable's value.
    // If the filter = "completed" we only want to render the tasks that are checked; otherwise, it renders the unchecked.
    const getTodos = () => {
        return todos.filter((todo) => filter === "completed" ? todo.checked : !todo.checked);
    }

    // Changes the "filter" variable's value to what we selected in Select
    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    }

    // For Search function
        const searchFunction = (query) => {
            if(query){
                const result = todos.filter((todo) => todo.text.toLowerCase().includes(query.toLowerCase()) && todo.checked == false)
                
                console.log(result)
                return result;
            }
        }

        const searchFunctionCompleted = (query) => {
            if(query){
                const result = todos.filter((todo) => todo.text.toLowerCase().includes(query.toLowerCase()) && todo.checked == true)
                
                console.log(result)
                return result;
            }
        }

    // END OF For Search function
    

    // For sorting function
        // Store current select value
        const currentSortSelectValue = (e) => {
            console.log("currentSortSelectValue triggered")
            console.log("e:")
            console.log(e)
            setSortBy(e)
            return setSortBy(e)
        }
    // END OF For sorting function


    return (
    <div>
        <select value={filter} onChange={(e) => changeFilter(e.target.value)}>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
        </select>
        
        <br/>
        <br/>
        
        {/* Search Bar */}
        <form // onSubmit={searchFunction()}
        >
            <input
                type="text"
                onChange={(e) => {setSearchInput(e.target.value); searchFunction(e.target.value)}}
                placeholder="Search"
                // onChange={(e) => searchFunction(setSearchInput(e.target.value))}
                // value={searchInput}
            />
        </form>

        <br/>

        {/* Sort By Bar */}
        <label>Sort By: </label>
        <select  onChange={(e) => {currentSortSelectValue(e.target.value)}}>
            <option value="timeAsc" >Time (ascending)</option>
            <option value="timeDesc" >Time (descending)</option>
            <option value="textAsc" >Text (ascending)</option>
            <option value="textDesc" >Text (descending)</option>
        </select>
        
        <br/>

        <br/>
        
        
        {/* Search List of Uncompleted Todo Tasks */}
        {searchInput && filter === "uncompleted" && searchFunction(searchInput).map((todo) => (
            <div key={todo.id}>
                <input 
                    checked={todo.checked}
                    onChange={() => toggleTodo(todo.id)}
                    type="checkbox" 
                />
                <label>{todo.text}</label>

                <span>(created: {readableDate(todo.time)})</span> 
                <br/>
            </div>
            ))
        }

        {/* Search List of Completed Todo Tasks */}
        {searchInput && filter === "completed" && searchFunctionCompleted(searchInput).map((todo) => (
            <div key={todo.id}>
                <input 
                    checked={todo.checked}
                    onChange={() => toggleTodo(todo.id)}
                    type="checkbox" 
                />
                <label>{todo.text}</label>

                <span>(created: {readableDate(todo.time)})</span> 
                <br/>
            </div>
            ))
        }

        {/* List of Todo Tasks */}
        {!searchInput && getTodos().map((todo) => (
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
        
        {/* Add a new Todo Task */}
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
