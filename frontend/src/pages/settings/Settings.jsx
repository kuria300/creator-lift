import { useState } from "react";
import { useAuth } from "../../context/context";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { User, Bell, CreditCard, Shield, Link2, Camera} from "lucide-react";
import Security from "../../components/ui/Security";
import Profile from "../../components/ui/Profile";
import Payments from "../../components/ui/Payments";
import Integrations from "../../components/ui/Integrations";

const menuItems = [
  { name: "Profile", icon: User },
  // { name: "Notifications", icon: Bell },
  { name: "Payments", icon: CreditCard },
  { name: "Security", icon: Shield },
  { name: "Integrations", icon: Link2 },
];


const Settings = () => {
  const { isOpen } = useAuth();
 const [active, setActive] = useState('Profile')


  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Sidebar />

        <main className={`pt-16 transition-all duration-300 ${isOpen ? "ml-72" : "ml-20"} max-sm:ml-0`}>
           <div className="min-h-screen bg-gray-100/50">
           
            <div className="bg-white border-b border-t-2 border-gray-100 px-6 py-8">
              <div className="max-w-5xl mx-auto text-start">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Settings
                </h1>
                <p className="text-gray-500 mt-2">
                  Manage your account, notifications, and preferences.
                </p>
              </div>
            </div>

              <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 md:flex-row">
              {/* Sidebar */}
              <aside className="w-full md:w-60 shrink-0">
                <ul className="space-y-3">
                  {menuItems.map(({ name, icon: Icon }) => (
                    <li key={name}>
                      <button
                       onClick={()=> setActive(name)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          name === active
                            ? "bg-blue-100/90 text-blue-600 shadow-sm'"
                            : "text-gray-500 hover:bg-blue-100/30 hover:text-gray-900"
                        }`}
                      >
                        <Icon size={18} />
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>


               {active === "Profile" && (
                <Profile />
               )}

                {active === 'Security' && (
                   <Security />
                )}

                {active === 'Payments' && (
                  <Payments />
                )}

                {active === 'Integrations' &&(
                  <Integrations />
                )}

                

              </div>
          </div>
          
        </main>
      </div>
    </>
  );
};

export default Settings;