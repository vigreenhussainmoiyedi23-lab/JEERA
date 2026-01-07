import React from 'react'
import { Routes,Route } from "react-router-dom";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
import Projects from './pages/projects/Projects';
import ProjectDetails from './pages/projects/ProjectDetails';
import NotFound from './pages/NotFound';
import CreateProject from './pages/projects/CreateProject';
import Profile from './pages/Profile/Profile';

const App = () => {
  return (
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/projects' element={<Projects/>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/createProject' element={<CreateProject/>}/>
    <Route path='/project/:projectid' element={<ProjectDetails/>}/>

     <Route path="*" element={<NotFound />} />
   </Routes>
  )
}

export default App
