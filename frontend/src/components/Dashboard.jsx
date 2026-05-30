import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Instagram, Play } from 'lucide-react'
import { useAuth } from '../context'

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
];
  return (
    <div className="min-h-screen bg-gray-300">
      <Navbar />

      <Sidebar />

      <main className={`pt-20 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Hero Section */}
        <section className='flex flex-col items-center justify-center text-center gap-6 py-24 px-6'>
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-7xl font-bold font-teko text-black uppercase tracking-tight max-sm:text-5xl">
              CREATOR LIFT
            </h1>
            <p className='text-xl md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
              A place where your work speaks louder than algorithms. 
              Focus on skills, quality, and results.
            </p>
            <div className='flex flex-row flex-wrap gap-3 justify-center pt-5'>
              <button className='px-8 py-3 text-white bg-gray-900 hover:bg-gray-800 font-semibold rounded-2xl transition-all duration-200 hover:scale-105 active:scale-[0.95] shadow-sm'>
                List Your Skills
              </button>
              <button className='px-8 py-3 bg-white text-gray-700 font-semibold border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 active:scale-[0.95] shadow-sm'>
                Browse your Requests
              </button>
            </div>
          </div>
        </section>

        {/* Your work Section */}
         <section className='py-12 px-6'>
          <div className="max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Work</h2>
              <button className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>

            <div className='flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-6 gap-4'>
              {portfolioItems.map((item) => (
                <div 
                  key={item.id}
                  className='flex-shrink-0 w-[280px] bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300'
                >
                  <div className="relative h-[200px] md:w-[320px] bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
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
      </main>
    </div>
  )
}

export default Dashboard
