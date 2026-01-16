import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleLogin = async e => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            const data = await res.json();
            if (!res.ok) { setMessage(data.message || 'Login failed'); }
            else { localStorage.setItem('mvBusUser', data.username); navigate('/dashboard'); }
        } catch (err) { setMessage('Backend not reachable'); }
    };
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 420, background: '#fff', padding: 35, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'center' }}>
                <h1 style={{ color: '#e53935', marginBottom: 5, fontSize: '28px' }}>🚌 MV Bus</h1>
                <h2 style={{ marginBottom: 10, color: '#333' }}>Login</h2>
                <p style={{ marginBottom: 25, color: '#666' }}>Book your bus tickets easily</p>
                {message && <p style={{ color: 'red', marginBottom: 15 }}>{message}</p>}
                <form onSubmit={handleLogin}>
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>
                <p style={{ marginTop: 20 }}>New user? <Link to="/signup" style={{ color: '#e53935', fontWeight: 'bold' }}>Sign up</Link></p>
            </div>
        </div>
    );
}
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' };
const buttonStyle = { width: '100%', padding: '12px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' };
export default Login;
