import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useAuth } from "./context/context";
import Assistant from "./components/ui/Assistant";

export default function AppLayout(){
      const {isOpen}= useAuth()

    return(
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isOpen ? 'ml-96' : 'ml-20'} max-sm:ml-0`}>
        <Outlet />

    
      </main>

      <Assistant />
    </div>
    )
}

