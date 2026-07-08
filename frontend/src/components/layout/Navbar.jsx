import React, { useState } from "react";
import "../../App.css";
import main from "../../assets/logos/main.png";
import { Link } from "react-router-dom";
import { Menu, X, MessageSquare, Bell, User, Tag, Zap} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
  { to: "/deal", icon: Tag, label: "Deals" },
  { to: "/offer", icon: Zap, label: "Offers" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/profile", icon: User, label: "Profile" },
];

  return (
    <header className="fixed top-0 left-0 bg-white/80 backdrop-blur-md w-full z-50 h-16 flex items-center">
      <div className="relative flex items-center w-full h-full">

        {/* Logo */}
        <span className="flex items-center gap-2 flex-shrink-0 ms-14">
          <img
            src={main}
            alt="Logo"
            className="size-12 object-contain rounded-3xl"
          />

          <h1 className="font-semibold text-2xl text-gray-900">
            CreatorLift
          </h1>
        </span>


        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Messages */}
          <Link to="/messages" className="p-2 hover:bg-gray-50 rounded-full relative transition-colors text-gray-500 hover:text-gray-900">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"/>
          </Link>


          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5"/>
          </button>


          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"/>


          {/* Profile */}
          <Link to="/settings" className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-full transition-colors">
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              Alex Riviera
            </span>

            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 mr-6">
              <User className="w-4 h-4 text-blue-500"/>
            </div>

          </Link>


          {/* Mobile Menu */}
          <button
            className="sm:hidden p-2 outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={28} className="text-gray-400"/>
            ) : (
              <Menu size={28} className="text-gray-400"/>
            )}

          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
      <nav className="md:hidden absolute top-16 left-0 right-0 bg-white border-2 border-outline-variant/40 p-6 z-50">

        <ul className="flex flex-col gap-4">
        {navItems.map(({ to, icon: Icon, label }, index) => (
          <>
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-x-3 p-2 text-gray-900 hover:bg-gray-300 rounded-xl transition-colors"
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>

            {/* Add divider after Messages */}
            {label === "Messages" && (
              <li className="h-px bg-gray-200 my-2" />
            )}
          </>
        ))}
      </ul>
      </nav>
        )}

      </div>

    </header>
  );
};


export default Navbar;