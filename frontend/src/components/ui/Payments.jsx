import { Bell,MessageCircle, Handshake,CreditCard,CalendarDays, Sparkles,} from "lucide-react";
import { useState } from "react";

const notificationSettings = [
  {
    id:1,
    title: "New Matched Request",
    description: "When a brand request matches your skills",
    icon: Bell,
  },
  {
    id:2,
    title: "New Message",
    description: "When a brand sends you a message",
    icon: MessageCircle,
  },
  {
    id:3,
    title: "Deal Status Update",
    description: "When a deal moves to a new stage",
    icon: Handshake,
  },
  {
    id:4,
    title: "Payment Received",
    description: "When a payment is released to you",
    icon: CreditCard,
  },
  {
    id:5,
    title: "Weekly Digest",
    description: "A weekly summary of your activity",
    icon: CalendarDays,
  },
  {
    id:6,
    title: "Product Updates",
    description: "News and updates from Creator-Lift",
    icon: Sparkles,
  },
];
export default function Payments (){

const [notify, setNotify]=useState({
  1:true,
  2:true,
  3:true,
  4:false,
  5:false,
  6:false
})

const toggleNotification =(id)=>{
  setNotify((prev)=>({
    ...prev,
    [id]: !prev[id]
}))

}

 
    return(
        <>
          <section className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="space-y-10 p-8">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                    Notification Preferences
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Choose how and when you'd like to be notified
                    </p>
                 </div>
                 <div className="space-y-4">
                  {notificationSettings.map(({id, title, description, icon:Icon})=>(
                    
                    <div key={id} className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50">
                          <Icon className="w-4 h-4 text-gray-500" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-700">
                            {title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {description}
                          </p>
                        </div>
                        </div>

                        <button 
                        type="button"
                        onClick={()=>toggleNotification(id)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        notify[id] ? "bg-blue-500" : "bg-gray-200"
                         }`}>
                            <span
                              className={`absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                                notify[id] ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                        </button>

                    </div>
                  ))}

                 </div>
                  <div className="flex justify-end">
                    <button className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                        Save Changes
                    </button>
                    </div>
                </div>
          </section>
        </>
    )
}