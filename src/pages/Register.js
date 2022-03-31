import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const register = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
    };

  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={register} >
            <input 
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <input 
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
            />
            <br/>
            <button type="submit">Register</button>
        </form>
    </div>
  )
}

export default Register