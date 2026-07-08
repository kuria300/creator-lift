import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { Instagram, Play } from 'lucide-react'
import { useAuth } from '../../context/context'
import { ShoppingBag, Clock, Briefcase, DollarSign, ChevronRight} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const {isOpen}= useAuth()

  const portfolioItems = [
  {
    id: 1,
    title: 'Cinematic Travel Reel',
    platform: 'Instagram',
    description: 'High-energy travel montage for tourism brands.',
    tags: ['Video', 'Travel', 'Cinematic'],
    image: 'https://images.unsplash.com/photo-1736710744593-9995ac2ba227?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Minimalist Product Photography',
    platform: 'TikTok',
    description: 'Clean, aesthetic product shots for beauty brands.',
    tags: ['Photography', 'Beauty', 'Minimalist'],
    image: 'https://images.unsplash.com/photo-1674183672521-9156cfee0987?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Gourmet Food Promo',
    platform: 'Instagram',
    description: 'Engaging cooking demo and food styling.',
    tags: ['Food', 'Promo', 'Video'],
    image: 'https://images.unsplash.com/photo-1607930231977-1c1668f74067?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    title: 'Urban Lifestyle Shoot',
    platform: 'TikTok',
    description: 'Fashion and lifestyle content in urban settings.',
    tags: ['Fashion', 'Lifestyle', 'Urban'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    title: 'Urban Lifestyle Shoot',
    platform: 'TikTok',
    description: 'Fashion and lifestyle content in urban settings.',
    tags: ['Fashion', 'Lifestyle', 'Urban'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  },
];


const offers = [
  {
    price: "$250",
    title: "Short-Form Video Ad (15-30s)",
    delivery: "2 Days delivery",
    tags: ["Video", "UGC", "Promo"],
  },
  {
    price: "$180",
    title: "Product Lifestyle Shoot (5 Photos)",
    delivery: "3 Days delivery",
    tags: ["Photo", "Lifestyle", "Product"],
  },
  {
    price: "$120",
    title: "TikTok/Reels Trend Implementation",
    delivery: "24 Hours delivery",
    tags: ["Social", "Trend", "TikTok"],
  },
  {
    price: "$350",
    title: "Brand Integration Shoutout",
    delivery: "5 Days delivery",
    tags: ["Integration", "Promo", "Video"],
  },
];

const requests = [
  {
    brand: "EcoVibe Skincare",
    price: "$500 - $800",
    desc: "Looking for 3 lifestyle videos showcasing our new organic facial serum. Focus on morning routine and texture shots.",
    tags: ["Skincare", "Video", "Lifestyle"],
  },
  {
    brand: "PureBrew Coffee",
    price: "$300 - $450",
    desc: "Aesthetic home barista setup shots and one tutorial-style reel showing how to make a perfect cold brew.",
    tags: ["Coffee", "Photography", "Tutorial"],
  },
  {
    brand: "FitTrack Wearables",
    price: "$1,200 - $1,500",
    desc: "High-performance fitness content. 10 edited photos and 2 high-energy reels using our smart watch during a workout.",
    tags: ["Fitness", "Wearable", "Video"],
  },
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Sidebar />

      <main className={`pt-20 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-20'} max-sm:ml-0`}>
        
        {/* Hero Section */}
        <section className='max-w-7xl mx-auto py-12 px-6'>
          <p className='text-sm tracking-[0.2em] uppercase text-sky-500 mb-3'>{days[new Date().getDay()]}, {months[new Date().getMonth()]} <span className='text-sm'>{new Date().getDate()}</span></p>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Welcome back, Alex!
        </h1>
        <p className="text-gray-500 mt-1">
          Three new matches and one proposal awaiting your reply.
        </p>
        </section>

        {/* Your work Section */}
        <div className='space-y-14 pb-2'>
         <section className='py-12 px-6'>
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Your Work
            </h2>

            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>

            <div className='flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-6 gap-6'>
              {portfolioItems.map((item) => (
                <div 
                  key={item.id}
                  className='flex-shrink-0 w-[280px] bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300'
                >
                  <div className="relative h-[200px] md:w-[320px] bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
          </div>
        </section>

      <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Your Micro-Offers
          </h2>

          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Manage Offers
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
              <div className="space-y-4">

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>

                  <div className="text-xl font-bold text-gray-900">
                    {offer.price}
                  </div>

                </div>

                {/* Title + delivery */}
                <div className="space-y-1">

                  <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {offer.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{offer.delivery}</span>

                  </div>

                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {offer.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button className="w-full py-2.5 bg-gray-50 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300">
                  Select Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

       <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {requests.map((req, i) => (
            <div
              key={i}
              className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >

              {/* Top */}
              <div className="flex items-start justify-between mb-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>

                  <Link
                    to={`/brands/${req.brand.toLowerCase().replaceAll(" ", "-")}`}
                    className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {req.brand}
                  </Link>

                </div>

                <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {req.price}
                </div>

              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {req.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50 mt-auto">
                {req.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                to={`/brands/${req.brand.toLowerCase().replaceAll(" ", "-")}`}
                className="w-full mt-6 py-2.5 bg-white text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
              >
                Send Proposal
                <ChevronRight className="w-4 h-4" />
              </Link>

            </div>
          ))}

        </div>

      </div>
    </section>
      </div>
      </main>
    </div>
  )
}

export default Dashboard
