import React, { useState } from 'react'
import { Menu, X, Tag, Zap, MessageSquare, User, Settings, HelpCircle, Home, CircleQuestionMark } from 'lucide-react'
import { useAuth } from '../../context/context'
import { Link, NavLink } from 'react-router-dom'

const Sidebar = () => {
  const{isOpen, togglesidebar}=useAuth()

  const NAV_LINKS =[
    {
      id:1,
      to:'/dashboard',
      icon: Home,
      label: 'Home'
    },
    {
      id:2,
      to:'/deal',
      icon: Tag,
      label: 'Deals'
    },
    {
      id:3,
      to:'/offer',
      icon: Zap,
      label: 'Offers'
    },
    {
      id:4,
      to:'/message',
      icon: MessageSquare,
      label: 'Message'
    },
  
  ]



  return (
   <aside
  className={`fixed left-0 top-0 z-40 bg-white h-screen transition-all duration-300 border-r border-gray-200 ${isOpen ? "w-72" : "w-20"} max-sm:w-0 max-sm:overflow-hidden
  `}
>
  <div className="relative h-full w-full p-5 pt-8 flex flex-col">
        
        {/* Toggle Button*/}
        <button 
          onClick={togglesidebar}
          className="absolute -right-3 top-24 bg-white text-gray-900 rounded-full border border-gray-900 p-1 z-50 shadow-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation items */}
        <nav className="mt-16 flex-1 overflow-y-auto scrollbar-hide">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map(({id, to, icon: Icon, label})=>{
             return (
                <li key={to} className="group">
                  <NavLink
                    to={to}
                    className={({isActive})=>`flex items-center gap-x-2 p-2 rounded-xl transition-colors w-full h-full font-semibold text-sm 
                            ${isActive ? 'bg-blue-100/90 text-blue-600 shadow-sm': 'text-gray-500 hover:bg-blue-100/30 hover:text-gray-900'}`}
                  >
                    <Icon size={20} />
                    <span className={`${!isOpen && "hidden"} whitespace-nowrap origin-left duration-200`}>
                      {label}
                    </span>
                  </NavLink>
                </li>
              );
              })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className='mt-auto pt-6 border-t border-gray-300'>
          <ul className='flex flex-col gap-4'>
            <NavLink to="/settings" className={({isActive})=>`flex items-center gap-x-2 p-2 rounded-xl transition-colors font-semibold text-sm 
                            ${isActive ? 'bg-blue-100/90 text-blue-600 shadow-sm': 'text-gray-500 hover:bg-blue-100/30 hover:text-gray-900'}`}>
              <Settings size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap`}>Settings</span>
            </NavLink>
            <NavLink to="/support" className={({isActive})=>`flex items-center gap-x-2 p-2 rounded-xl transition-colors w-full h-full font-semibold text-sm 
                            ${isActive ? 'bg-blue-100/90 text-blue-600 shadow-sm': 'text-gray-500 hover:bg-blue-100/30 hover:text-gray-900'}`}>
              <CircleQuestionMark size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap`}>Support</span>
            </NavLink>
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
