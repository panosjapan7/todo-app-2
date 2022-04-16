import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CredentialsContext } from '../App'

const handleErrors = async (response) => {
    if(!response.ok){
        const {message} = await response.json();
        throw Error(message);
    }
    return response.json();
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [, setCredentials] = useContext(CredentialsContext);

    const login = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
        .then(handleErrors)
        .then(() => {
            setCredentials({
                username,
                password,
            })
            navigate("/");
        })
        .catch((error) => {
            setError(error.message);
        })
    };

  return (
    <div>
        <h1>Login</h1>
        {error && <span style={{ color: "red" }}>{error}</span>}
        <form onSubmit={login} >
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
            <button type="submit">Login</button>
        </form>
        <br />
        <Link to="/register">Don't have an account? Register here.</Link>
    </div>
  )
}

// export default Login