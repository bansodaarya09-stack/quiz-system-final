import React, {useState} from 'react';
import { TextField, Button, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';
export default function Login(){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(''); const navigate=useNavigate();
  async function onLogin(){
    setErr('');
    if(!username||!password){ setErr('Enter username and password'); return; }
    try{
      const res = await fetch(API_BASE + '/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({username,password})});
      const data = await res.json().catch(()=>null);
      if(!res.ok){ setErr(data?.error || 'Login failed'); return; }
      localStorage.setItem('token', data.token); localStorage.setItem('user', username);
      if(data.role==='admin') navigate('/admin'); else navigate('/quiz');
    }catch(e){ console.error(e); setErr('Network error'); }
  }
  return (<Box sx={{maxWidth:480,mx:'auto'}}><h2>Login</h2>{err && <Alert severity="error" sx={{mb:2}}>{err}</Alert>}<TextField label="Username" fullWidth value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}}/><TextField label="Password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}}/><Button variant="contained" onClick={onLogin}>Login</Button><Box sx={{mt:2}}><Link href="/register">Don't have an account? Register</Link></Box></Box>);
}
