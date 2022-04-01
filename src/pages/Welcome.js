import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CredentialsContext } from '../App'
import Todos from '../components/Todos';

export function Welcome() {
    const [credentials, setCredentials] = useContext(CredentialsContext);
    
    const logout = () => {
        setCredentials(null);
    };

    return (
    <div>
        {credentials && <button onClick={logout} >Logout</button>}
        <h1>Welcome {credentials && credentials.username}</h1>
        {!credentials && <Link to="/register">Register</Link>}
        < br/>
        {!credentials && <Link to="/login">Login</Link>}
        {credentials && <Todos />}
    </div>
    )
}

export default Welcome