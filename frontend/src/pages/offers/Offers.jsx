import React, { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../context/context'
import { useState } from 'react'
import { Plus, Search ,  Clock, ChevronRight, LoaderCircle} from 'lucide-react'
import { AllCreatorOffers, CreatorOffers } from '../../services/CreatorOffers'


const tabs = ["Browse Offers", "My Offers"];
const check_btn =['All', 'Video', 'Photography', 'Tutorial', 'Social', 'Other']

const Offers = () => {
  const {isOpen, user, loading}= useAuth()

  const [active, setActive]=useState('Browse Offers')
  const [check, setCheck]=useState('All')

  const [allOffers, setAllOffers]= useState([])
  const [myOffers, setMyOffers]= useState([])
  const [offerLoading, setOfferLoading]=useState(true)

  useEffect(()=>{
    if(!user) return
    const getOffers = async()=>{
     try{
      const data = await AllCreatorOffers()
      console.log(data.offers)
      setAllOffers(data.offers)
    }catch(err){

      console.error(err)
    }finally{
      setOfferLoading(false)
    }
    }

    getOffers()
  }, [user])


  useEffect(() => {
    if (active !== 'My Offers' || !user) return

    const getMyOffers = async () => {
      setOfferLoading(true)
      try {
        const data = await CreatorOffers()
        setMyOffers(data.offers)
      } catch (err) {
        console.error(err)
      } finally {
        setOfferLoading(false)
      }
    }
    getMyOffers()
  }, [active, user])  // re-runs when tab switches to My Offers
  
const currentOffers = active === 'My Offers' ? myOffers : allOffers
const chooseOffers = currentOffers.filter((offer)=> offer.content_type === check || check === 'All')

if (loading || offerLoading) return (
    <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin w-6 h-6 text-sky-500" />
    </div>
)
  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      <Sidebar />

      <main className={`pt-16 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-20'} max-sm:ml-0`}>
        <section className='max-w-7xl mx-auto py-12 px-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
         <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Offers
        </h1>
        <p className="text-gray-500 mt-1">
         Browse brand requests or manage your listed micro-offers.
        </p>
         </div>

         <div className="flex sm:mt-4">
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
             <Plus className="w-4 h-4" />
             New Offer
           </button>
        </div>
        </section>

          <div className='max-w-7xl mx-auto mt-6 flex gap-1 rounded-xl p-1 w-fit bg-gray-200'>
          {tabs.map((tab, i)=>(
            <button
            key={i}
            onClick={()=>setActive(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              active === tab ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
            >
            {tab}
            </button>
          ))}
        </div>

        <div className='max-w-7xl mx-auto py-10 px-6'>
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8'>
            <div className='relative flex-1 max-w-sm'>
             <Search className='w-4 h-4 absolute left-3 top-3 text-gray-400'/>
             <input 
             type='text'
             placeholder='Search Offers...'
             className='w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all'
             />
            </div>

            <div className='flex gap-2 flex-1 sm:flex-none'>
              {check_btn.map((btn)=>(
                <button
                key={btn}
                onClick={()=> setCheck(btn)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide ${
                 check === btn ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                }`}
                >
                {btn}
                </button>
              ))}
            </div>
          </div>
          {chooseOffers.length === 0 ? (
           <div className="text-center py-16">
          {active === 'My Offers' ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-400 text-sm">You haven't created any offers yet.</p>
            
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No offers found.</p>
          )}
        </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chooseOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100">
                    {offer.image_url && (
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* type badge — kept from mock structure */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-700">
                      {offer.content_type || 'General'}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
                      Ksh.{offer.amount}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
                        {offer.creator_username || 'Creator'}
                      </p>
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {offer.title}
                      </h3>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{offer.delivery_days} day{offer.delivery_days > 1 ? 's' : ''} delivery</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {(offer.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-gray-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button className="w-full py-2 rounded-lg bg-gray-300 text-gray-700 text-sm font-semibold transition-colors duration-300 group-hover:bg-gray-900 group-hover:text-white">
                        Apply Today
                        <ChevronRight className="w-4 h-4 inline-block transform transition-transform duration-300 group-hover:translate-x-2 ease-in-out" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Offers