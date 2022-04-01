import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { CredentialsContext } from '../App'

const handleErrors = async (response) => {
    if(!response.ok){
        const {message} = await response.json();
        throw Error(message);
    }
    return response.json();
}

export function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [, setCredentials] = useContext(CredentialsContext);

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
        <h1>Register</h1>
        {error && <span style={{ color: "red" }}>{error}</span>}
        <form onSubmit={register} >
            <input 
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <br/>
            <input 
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
            />
            <br/>
            <button type="submit">Register</button>
        </form>
    </div>
  )
}

export default Register