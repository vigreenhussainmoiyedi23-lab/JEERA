import React from 'react'
import { Routes,Route } from "react-router-dom";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
import Projects from './pages/projects/Projects';
import ProjectDetails from './pages/projects/ProjectDetails';

const App = () => {
  return (
   <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/projects' element={<Projects/>}/>
    <Route path='/project/:projectid' element={<ProjectDetails/>}/>
   </Routes>
  )
}

export default App
