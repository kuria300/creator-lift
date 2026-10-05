import React, { useEffect, useState } from "react";
import "../../App.css";
import main from "../../assets/logos/main.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { Menu, X, MessageSquare, Bell, User, Tag, Zap, LogOut} from "lucide-react";
import { useUnreadNotification } from "../../hooks/useUnreadNotifications";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, Logout, avatarUrl}= useAuth()
   const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate()

  const {count: unread, MarkAllRead }=useUnreadNotification(user?.id)

  const navItems = [
  { to: "/deal", icon: Tag, label: "Deals" },
  { to: "/offer", icon: Zap, label: "Offers" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/profile", icon: User, label: "Profile" },
];

const handleLogout = ()=>{
  Logout()
  navigate('/login')
}

useEffect(()=>{
  console.log(avatarUrl)
}, [])

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
          <Link to="/message" className="p-2 hover:bg-gray-50 rounded-full relative transition-colors text-gray-500 hover:text-gray-900">
            <MessageSquare className="w-5 h-5" />
          </Link>


          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
              aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                  <button
                    onClick={MarkAllRead}
                    disabled={unread === 0}
                    className="text-xs text-blue-500 hover:underline disabled:opacity-40"
                  >
                    Mark all as read
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {unread > 0
                    ? `You have ${unread} unread conversation${unread > 1 ? "s" : ""}.`
                    : "No new Messages."}
                </p>
                <Link
                  to="/message"
                  onClick={() => setBellOpen(false)}
                  className="block mt-3 text-sm text-blue-500 hover:underline"
                >
                  Go to messages
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"/>


          {/* Profile */}
         {user && (
           <div className="flex items-center gap-1">
              <Link to="/settings" className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-full transition-colors">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.username || user.data?.username }
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-full" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors mr-6"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
         )}

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