import React from 'react'
import { Menu, X, Tag, Zap, MessageSquare, User, Settings, HelpCircle } from 'lucide-react'
import { useAuth } from '../context'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const{isOpen, togglesidebar}=useAuth()
  return (
    <aside className={`fixed left-0 top-0 z-40 ${isOpen ? 'w-64' : 'w-20'} bg-white h-screen transition-all duration-300 border-r border-gray-200`}>
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
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors group">
              <Tag size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap origin-left duration-200`}><Link to='/deal'>Deals</Link></span>
            </li>
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-md cursor-pointer transition-colors group">
              <Zap size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap origin-left duration-200`}><Link to='/offer'>Offers</Link></span>
            </li>
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-md cursor-pointer transition-colors group">
              <MessageSquare size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap origin-left duration-200`}>Messages</span>
            </li>
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-md cursor-pointer transition-colors group">
              <User size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap origin-left duration-200`}>Profile</span>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className='mt-auto pt-6 border-t border-gray-300'>
          <ul className='flex flex-col gap-4'>
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-md cursor-pointer transition-colors">
              <Settings size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap`}>Settings</span>
            </li>
            <li className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-md cursor-pointer transition-colors">
              <HelpCircle size={20} />
              <span className={`${!isOpen && "hidden"} whitespace-nowrap`}>Support</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
