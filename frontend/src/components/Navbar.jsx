import React from 'react'

const Navbar = () => {
  return (
     <nav className="bg-cyan-600/10 fixed top-0 backdrop-blur-md  w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
            Jeera
          </h1>
        </div>
      </nav>
  )
}

export default Navbar
