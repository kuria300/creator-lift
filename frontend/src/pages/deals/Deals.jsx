import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../context/context'
import { useState } from 'react'
import { MessageSquare, ArrowUpRight, Calendar, DollarSign, Clock } from "lucide-react";

const btns= ['All Deals', 'In Progress', 'Completed', 'In Review']

const Deals = () => {
    const {isOpen}= useAuth()

    const [active, setActive]= useState('All Deals')

    const stats = [
  {
    label: "Active Deals",
    value: "3",
    color: "text-blue-600",
  },
  {
    label: "Completed",
    value: "1",
    color: "text-green-600",
  },
  {
    label: "Total Earned",
    value: "Ksh.150,000",
    color: "text-gray-900",
  },
];

  const projects = [
    {
      brand: "Safaricom",
      title: "M-PESA Everyday Heroes Campaign — 3 Videos",
      status: "In Progress",
      due: "Jul 10, 2026",
      budget: "KES 90,000",
      messages: 3,
    },
    {
      brand: "KFC Kenya",
      title: "Nairobi Foodie Review Series — 5 Reels",
      status: "In Review",
      due: "Jul 5, 2026",
      budget: "KES 75,000",
      messages: 1,
    },
    {
      brand: "Airtel Kenya",
      title: "Affordable Data Pack Awareness Reels",
      status: "In Progress",
      due: "Jul 9, 2026",
      budget: "KES 60,000",
      messages: 0,
    },
    {
      brand: "Coca-Cola Kenya",
      title: "Nairobi Street Life Series — Short Film",
      status: "Completed",
      due: "Jun 28, 2026",
      budget: "KES 150,000",
      messages: 0,
    },
  ];

  const filteredCards = active === 'All Deals' ? projects : projects.filter((project)=> project.status === active)


  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      <Sidebar />

      <main className={`pt-20 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-20'} max-sm:ml-0`}>
        <section className='max-w-7xl mx-auto py-12 px-6'>
         <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Deals
        </h1>
        <p className="text-gray-500 mt-1">
          Track active collaborations and deliverables in real time.
        </p>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>

              <p className={`text-2xl font-extrabold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        </section>

        <section className='max-w-7xl mx-auto py-6 px-6 bg-gray-200/20'>
          <div className="flex gap-4 flex-wrap mb-8">
          {btns.map((btn)=>{
            const isActive = active === btn

            return(
            <button
             key={btn}
              onClick={() => setActive(btn)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide ${
              isActive ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
            >
             {btn}
            </button>
            )
           })}
           </div>

            <div className="space-y-4">
            {filteredCards.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        {p.brand}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          p.status === "Completed"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : p.status === "In Review"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {p.status}
                      </span>

                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {p.messages}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      {p.title}
                    </h3>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Due</p>
                      <p className="text-sm font-bold text-gray-700">{p.due}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Budget</p>
                      <p className="text-sm font-bold text-gray-900">{p.budget}</p>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>

                {/* Actions */}
                {/* <div className="px-6 pb-5 pt-3 border-t border-gray-50 flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition">
                    <MessageSquare className="w-4 h-4" />
                    Message Brand
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Deals