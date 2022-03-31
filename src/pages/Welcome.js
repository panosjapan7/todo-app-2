import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export function Welcome() {
  return (
    <div>
        <h1>Welcome</h1>
        <Link to="/register">Register</Link>
    </div>
  )
}

export default Welcome