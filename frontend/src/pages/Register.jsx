import React,{useState} from 'react';
import { TextField, Button, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState('');
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(''); const navigate=useNavigate();
  async function onRegister(){
    setErr('');
    if(!name||!email||!username||!password){ setErr('Please fill all fields'); return; }
    try{
      const res = await fetch(API_BASE + '/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({name,email,username,password})});
      const data = await res.json().catch(()=>null);
      if(!res.ok){ setErr(data?.error || 'Registration failed'); return; }
      navigate('/login');
    }catch(e){ console.error(e); setErr('Network error'); }
  }
  return (<Box sx={{maxWidth:480,mx:'auto'}}><h2>Register</h2>{err && <Alert severity="error" sx={{mb:2}}>{err}</Alert>}<TextField label="Full name" fullWidth value={name} onChange={e=>setName(e.target.value)} sx={{mb:2}}/><TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} sx={{mb:2}}/><TextField label="Username" fullWidth value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}}/><TextField label="Password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}}/><Button variant="contained" onClick={onRegister}>Register</Button><Box sx={{mt:2}}><Link href="/login">Already registered? Login</Link></Box></Box>);
}
