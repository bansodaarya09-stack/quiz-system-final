import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Admin from './pages/Admin';
function App(){
  return (
    <>
      <AppBar position="static"><Toolbar><Typography variant="h6">Quiz App</Typography></Toolbar></AppBar>
      <Container sx={{mt:4}}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/quiz" element={<Quiz/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </Container>
    </>
  );
}
export default App;
