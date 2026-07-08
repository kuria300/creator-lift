import { Paperclip, Search } from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import { useAuth } from "../../context/context"
import { ChevronLeft, Ellipsis, Send } from "lucide-react"
import { useState } from "react"

const Message =()=>{
 const {isOpen}= useAuth()
 const [active , setActive]= useState(1)
 const [showChat, setShowChat]= useState(false)

 const conversations = [
  {
    id: 1,
    initials: "EV",
    company: "EcoVibe Skincare",
    time: "2h ago",
    project: "3x Lifestyle Videos",
    message: "Can you send the second video draft by Friday?",
    unread: 2,
    active: true,
    avatar: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    initials: "PB",
    company: "PureBrew Coffee",
    time: "5h ago",
    project: "Cold Brew Tutorial Reel",
    message: "The tutorial reel looks fantastic! Approving now.",
    unread: 1,
    active: false,
    avatar: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    initials: "FT",
    company: "FitTrack Wearables",
    time: "Yesterday",
    project: "2x Workout Reels",
    message: "Welcome aboard! Brief document attached.",
    unread: 0,
    active: false,
    avatar: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    initials: "LS",
    company: "Lumé Studio",
    time: "2 days ago",
    project: "Candle Collection Editorial",
    message: "Everything looks perfect. Payment released.",
    unread: 0,
    active: false,
    avatar: "bg-purple-100 text-purple-700",
  },
  {
    id: 5,
    initials: "NA",
    company: "Nōrd Audio",
    time: "3 days ago",
    project: "Unboxing & First Impressions",
    message: "Interested in your unboxing offer. Can we talk rates?",
    unread: 0,
    active: false,
    avatar: "bg-gray-100 text-gray-700",
  },
];


const messages = {
  1:[
  {
    id: 1,
    sender: "brand",
    text: "Hi Alex! We loved the first video you delivered. Really captured the morning routine feel we wanted.",
    time: "10:02 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Thank you! I was really happy with how the lighting turned out in that one. Working on the second video now.",
    time: "10:15 AM",
  },
  {
    id: 3,
    sender: "brand",
    text: "Great to hear. Can you send the second video draft by Friday? We have an internal review on Monday.",
    time: "11:30 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Absolutely, Friday works perfectly. I'll send it over in the afternoon along with the raw files.",
    time: "11:45 AM",
  },
 ],
  2:[],
  3:[ {
    id: 5,
    sender: "brand",
    text: "Perfect! Also — any chance you could add a shot of the pump dispenser? Our team felt it wasn't prominent enough.",
    time: "2:10 PM",
  },
  {
    id: 6,
    sender: "brand",
    text: "Can you send the second video draft by Friday?",
    time: "3:22 PM",
  }],
  4:[],
  5:[]
};

const activeMessage = messages[active];

const activeConversation = conversations.find((conversation) => conversation.id === active);
    return(
        <>
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <Sidebar />
            <main className={`pt-16 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-20'} max-sm:ml-0`}>
             <div className="flex h-[calc(100vh-4rem)]">
              <aside className={`w-full md:w-96 border-r border-gray-200 flex flex-col flex-shrink-0 mt-0 ${showChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold ml-2">Messages</h2>
                  </div>

                  <div className='relative'>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search Conversations..." 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conversation)=>(
                        <button
                         key={conversation.id}
                         onClick={() =>{
                            setActive(conversation.id);
                            setShowChat(true)
                         }}
                         className={`w-full text-left py-4 px-4 transition-colors duration-200 flex gap-3 hover:bg-blue-100/80
                            ${active === conversation.id ? 'bg-blue-100/60': 'bg-gray-100'}`}>
                            <div className = {`w-10 h-10 rounded-full items-center justify-center font-bold text-sm shrink-0 flex ${conversation.avatar}`}>
                                {conversation.initials}
                            </div>
                          <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-bold text-gray-900 truncate">
                                        {conversation.company}
                                    </span>

                                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                        {conversation.time}
                                    </span>
                                </div>

                                <p className="text-xs text-blue-400 font-medium mb-0.5 truncate">
                                {conversation.project}
                                </p>

                                <p
                                className={`text-xs truncate ${conversation.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                                {conversation.message}
                                </p>
                            </div>

                            {conversation.unread > 0 && (
                                <span className="w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                {conversation.unread}
                                </span>
                            )}
                        </button>
                    ))}

                </div>
            </aside>

            <section className={`flex-1 min-w-0 md:flex flex-col ${showChat ? 'flex' : 'hidden'}`}>
                <div className="px-6 py-4 border-b border-t-2 border-gray-100 flex items-center gap-4 bg-gray-50/80">
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5 text-gray-500" onClick={()=> setShowChat(false)}/>
                    </button>

                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                     EV
                    </div>

                    <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">
                        EcoVibe Skincare
                    </h3>
                    <p className="text-xs text-gray-400">
                        3x Lifestyle Videos
                    </p>
                    </div>

                    <button className="p-2 hover:bg-gray-50 rounded-lg">
                     <Ellipsis className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-100/30">
                    {activeMessage?.map((message)=>(
                       <div key={message.id} className={`flex gap-3 ${message.sender === "me" ? "flex-row-reverse" : "flex-row"} `}>
                
                        {message.sender === "brand" && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                            EV
                        </div>
                        )}

                         <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed 
                              ${message.sender === "me" ? "bg-gray-900 text-white rounded-tr-sm" : "bg-white text-gray-700 rounded-tl-sm border border-gray-100 shadow-sm"}`}>
                            <p>{message.text}</p>

                            <p className={`text-[10px] mt-1.5 
                            ${message.sender === "me" ? "text-gray-400" : "text-gray-300" }`}>
                                {message.time}
                            </p>
                            </div>
                       </div>
                    ))}
                  
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/80">
                 <div className="flex gap-3 items-center">
                   <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Paperclip className="w-5 h-5" />
                    </button>
                 <div className="flex-1">
                    <textarea
                    rows={1}
                    placeholder="Write a message..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                </div>

                <button className="p-3 rounded-xl bg-gray-900 text-gray-300 hover:bg-gray-800 transition-colors">
                    <Send className="w-4 h-4" />
                </button>
                 </div>
                </div>
            </section>
            </div>
            </main>
         </div>
        </>
    )

}

export default Message;