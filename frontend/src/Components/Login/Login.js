// Filename - Login.js

import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'
import Logo from '../../img/Logo.png';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            if (response.status === 200) {
                const userData = {
                    username: response.data.username,
                    role: response.data.role,
                    techid: response.data.techid,
                };
                onLoginSuccess(userData);
            }
        } catch (e) {
            alert('Incorrect username or password!');
        }
    };

    return (
        <div className='center-container'> {}
            <div className='wrapper'>
                <form onSubmit={handleLogin}> {}
                    
                    <h1>
                        <img src={Logo} alt="Logo" className="logo" />
                        Login
                    </h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
