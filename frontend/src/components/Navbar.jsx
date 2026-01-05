import React from 'react'

const Navbar = () => {
  const links=[
    {to:"/" , name:"JEERA"},
    {to:"/projects" , name:"Projects"},
    {to:"/tasks" , name:"Tasks"},
    {to:"/" , name:"JEERA"},
    {to:"/" , name:"JEERA"}
  ]
  return (
     <nav className="bg-cyan-600/10 fixed top-0 backdrop-blur-md  w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
        </div>
      </nav>
  )
}

export default Navbar
