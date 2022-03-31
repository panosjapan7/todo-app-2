import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CredentialsContext } from '../App'
import Todos from '../components/Todos';

export function Welcome() {
    const [credentials] = useContext(CredentialsContext);

    return (
    <div>
        <h1>Welcome {credentials && credentials.username}</h1>
        {!credentials && <Link to="/register">Register</Link>}
        < br/>
        {!credentials && <Link to="/login">Login</Link>}
        {credentials && <Todos />}
    </div>
    )
}

export default Welcome