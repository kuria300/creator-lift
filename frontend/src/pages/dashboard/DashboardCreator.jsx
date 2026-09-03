import React, { useEffect, useState } from 'react'
import { Instagram, Play } from 'lucide-react'
import { useAuth } from '../../context/context'
import { ShoppingBag, Clock, Briefcase, DollarSign, ChevronRight, LoaderCircle} from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchCreatorDashboard } from '../../services/CreatorDashboard'

const DashboardCreator = () => {
  const {user , loading}= useAuth()
  const [dashData, setDashData]= useState(null)
  const [dashLoading, setDashLoading] = useState(true)
  const [dashError, setDashError]= useState(null)

  useEffect(()=>{
   console.log(user)
  }, [])

  useEffect(() => {
      if (!user) return
      const load = async () => {
          try {
              const data = await fetchCreatorDashboard()
              setDashData(data)
          } catch (err) {
              setDashError('Failed to load dashboard')
              console.error(err)
          } finally {
              setDashLoading(false)
          }
      }
      load()
  }, [user])

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading || dashLoading) return (
      <div className="flex items-center justify-center min-h-screen">
          <LoaderCircle className="animate-spin w-6 h-6 text-sky-500" />
      </div>
  )

  const { works, offers, requests } = dashData ?? []

  return (
      <>
        {/* Welcome header */}
        <section className='py-12 px-6'>
          <div className="max-w-[1200px] mx-auto">
            <p className='text-sm tracking-[0.2em] uppercase text-sky-500 mb-3'>
              {days[new Date().getDay()]}, {months[new Date().getMonth()]} <span className='text-sm'>{new Date().getDate()}</span>
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Welcome back, {user.username || user.data.username}
            </h1>
            <p className="text-gray-500 mt-1">
              Three new matches and one proposal awaiting your reply.
            </p>
          </div>
        </section>

        {dashError && <p className="text-red-500 p-8">{dashError}</p>}

        <div className='space-y-14 pb-2'>

          {/* Your Work Section */}
          <section className='py-12 px-6'>
            <div className="max-w-[1200px] mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Your Work
                </h2>

                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  View All
                </button>
              </div>

              {works.length === 0 ? (
                <p className="text-gray-400 text-sm">No portfolio items yet.</p>
              ) : (
                <div className='flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-6 gap-6'>
                  {works.map((item) => (
                    <div
                      key={item.id}
                      className='flex-shrink-0 w-[280px] bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300'
                    >
                      <div className="relative h-[200px] md:w-[320px] bg-gray-100 overflow-hidden">
                        {item.thumbnail_url
                            ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                        }
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-lg text-[10px] font-bold uppercase tracking-wide text-gray-900 flex items-center gap-1.5 shadow-sm">
                          {item.platform === 'Instagram' ? <Instagram size={12} /> : <Play size={12} />}
                          {item.platform}
                        </div>
                      </div>

                      <div className='p-4 space-y-2'>
                        <h3 className='font-bold group-hover:text-blue-500 transition-colors text-gray-900 line-clamp-1'>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 italic">
                          "{item.description}"
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-gray-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Your Offers Section */}
          <section className="py-12 px-6">
            <div className="max-w-[1200px] mx-auto">

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Your Offers
                </h2>

                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Manage Offers
                </button>
              </div>

              {offers.length === 0 ? (
                <p className="text-gray-400 text-sm">No offers yet. Create your first offer.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div className="text-xl font-bold text-gray-900">${offer.amount}</div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{offer.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{offer.delivery_days} day{offer.delivery_days > 1 ? 's' : ''} delivery</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {offer.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-100">{tag}</span>
                          ))}
                        </div>
                        <button className="w-full py-2.5 bg-gray-50 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300">
                          Select Offer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* Matched Requests Section */}
          <section className="py-12 px-6">
            <div className="max-w-[1200px] mx-auto">

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Matched Requests
                </h2>

                <Link
                  to="/brands"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All Matches
                </Link>
              </div>

              {requests.length === 0 ? (
                <p className="text-gray-400 text-sm">No open requests right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map((req) => (
                    <div key={req.id} className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="font-bold text-gray-900">{req.brand}</span>
                        </div>
                        <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${req.amount}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">{req.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                        {req.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-100">{tag}</span>
                        ))}
                      </div>
                      <Link
                        to={`/requests/${req.id}`}
                        className="w-full mt-6 py-2.5 bg-white text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                      >
                        Send Proposal <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </>
  )
}

export default DashboardCreator