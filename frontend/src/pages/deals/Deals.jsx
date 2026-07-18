import React, { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../context/context'
import { useState } from 'react'
import { MessageSquare, ArrowUpRight, Calendar, DollarSign, Clock, LoaderCircle } from "lucide-react";
import { CreatorDealsm } from '../../services/CreatorDeals'

const btns = ['All Deals', 'active', 'completed', 'cancelled']

 const statusStyle = (status) => {
    switch (status) {
        case 'completed': return 'bg-green-50 text-green-600 border-green-100'
        case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
        default:          return 'bg-blue-50 text-blue-600 border-blue-100'  
    }
}


const Deals = () => {
    const {user, isOpen, loading}= useAuth()

    const [active, setActive]= useState('All Deals')
    const [deal, setDeal]=useState([])
    const [dealLoading, setDealLoading] = useState(true)


  useEffect(()=>{
    if ( !user) return;

    const getDeals = async()=>{
     try{
      const data = await CreatorDealsm()
      console.log(data.Deals)
      setDeal(data.Deals)
     }catch(err){

       console.error(err)
     }finally{
       setDealLoading(false)
     }
    }


    getDeals()
  }, [user])


 const stats = [
        { label: 'Active Deals',  value: deal.filter(d => d.status === 'active').length,    color: 'text-blue-600'  },
        { label: 'Completed',     value: deal.filter(d => d.status === 'completed').length,  color: 'text-green-600' },
        { label: 'Total Earned',  value: `Ksh.${deal.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseFloat(d.agreed_price || 0), 0).toLocaleString()}`, color: 'text-gray-900' },
    ]
 

  const filteredCards = active === 'All Deals' ? deal : deal.filter((d)=> d.status === active)

  if (loading || dealLoading) return (
    <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin w-6 h-6 text-sky-500" />
    </div>
)


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
           
            {filteredCards.length === 0 ? (
               <p className="text-gray-400 text-sm">No deals found.</p>
            ):(
              <div className="space-y-4">
            {filteredCards.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        {d.brand}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle(d.status)}`}>
                        {d.status}
                      </span>

                      {/* <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {d.messages}
                      </span> */}
                      
                    </div>

                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      {d.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{d.description}</p>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Due</p>
                      <p className="text-sm font-bold text-gray-700">
                          {new Date(d.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Budget</p>
                      <p className="text-sm font-bold text-gray-900">Ksh.{d.agreed_price}</p>
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
            )}
        </section>
      </main>
    </div>
  )
}

export default Deals