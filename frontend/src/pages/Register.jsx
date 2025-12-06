import React,{useState} from 'react';
import { TextField, Button, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState('');
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(''); const navigate=useNavigate();
 async function onRegister() {
  setErr('');

  if(!name || !email || !username || !password){
    setErr('Please fill all fields');
    return;
  }

  try {
    const res = await fetch(API_BASE + '/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        fullname: name,   // 🔥 FIX #1 — backend expects "fullname"
        email,
        username,
        password
      })
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;    // backend may return empty body
    }

    // 🔥 FIX #2 — correct success check
    if (!res.ok || !data || data.ok !== true) {
      setErr(data?.error || 'Registration failed');
      return;
    }

    // 🔥 FIX #3 — use replace() for smooth redirect
    window.location.replace('/login');

  } catch (error) {
    console.error(error);
    setErr('Network error');
  }
}
