import React, { useState } from 'react'
import '../App.css'
import main from '../assets/logos/main.png'
import {Link} from 'react-router-dom'
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen]= useState(false)
  return (
   <header className='fixed top-0 left-0 bg-white/80 backdrop-blur-md w-full z-50 h-16 px-6 flex items-center'>

  <div className="relative flex flex-row items-center w-full h-full">
    
    <span className='flex flex-row items-center gap-2 flex-shrink-0 ms-14'>
      <img src={main} alt='Logo' className='size-12 object-contain rounded-3xl' />
      <h1 className='font-semibold text-2xl text-gray-900'>CreatorLift</h1>
    </span>
    <nav className="hidden sm:flex flex-1 justify-center">
      <ul className="flex flex-row gap-8 items-center">
        <li>Deals</li>
        <li>Offers</li>
        <li>Messages</li>
      </ul>
    </nav>

    <div className='ml-auto flex gap-3'>
      <Link to="/Login">
        <button className="btn-cont">Log in</button>
      </Link>
      <Link to="/choose-role">
        <button className="btn-cont-sign">Sign up</button>
      </Link>
    </div>

      {isOpen && (
        <nav className="sm:hidden absolute top-full left-0 w-full bg-black80 p-6 z-40">
          <ul className="flex flex-col gap-6">
            <li>Deals</li>
            <li>Offers</li>
            <li>Messages</li>

          <div>
            <li className="pt-3 border-t border-white/10">
              <Link to="/Login">
                <button className="btn-cont w-full">Log in</button>
              </Link>
            </li>
            <li className="pt-3">
              <Link to="/choose-role">
                <button className="btn-cont-sign w-full">Sign up</button>
              </Link>
            </li>
          </div>
          </ul>
        </nav>
      )}
       <button className='sm:hidden p-2 transition-transform duration-300' style={{transform: isOpen ? 'rotate(180deg)': 'rotate(0deg)'}} onClick={()=>setIsOpen(!isOpen)}>
         {isOpen ? <X size={28} className='text-white' /> : <Menu size={28} className='text-white' />}
      </button>
      </div>
    </header>
  )
}

export default Navbar