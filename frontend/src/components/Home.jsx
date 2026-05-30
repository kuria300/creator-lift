import Navbar from './Navbar'
import '../App.css'
import { useRef } from 'react'

import HeroSection from './HeroSection'
import { Join } from './join'
import { useCursor } from '../utilities/useCursor'
import Footer from './Footer'

export const Home = () => {
const container= useRef(null)

useCursor(container, 60, 0.04)
  return (
   <main>
    
     <div ref={container} className='home-container'>
       <Navbar />

       <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-800/20 to-slate-800" />
      <section className='relative z-10 flex items-center justify-center text-center gap-6 flex-col mt-10'>

          <div className="uppercase tracking-wide text-sm opacity-80 text-white">
            Creators belong in the spotlight
          </div>

          <h1 className="text-8xl flex flex-col leading-none tracking-tight font-bold max-sm:text-5xl font-teko gap-3 text-white">
            <span>BE SEEN.</span>
            <span>GET NOTICED.</span>
            <span>GROW FAST.</span>
          </h1>

          <p className="max-w-[600px] text-base opacity-90 text-white">
            You're not just another profile lost in the feed. Here, your creativity takes center stage—no algorithms hiding your work.
            Connect with brands, find your people, and let your content open new doors.
            Welcome to a community where your voice is valued and your journey matters.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="
                relative
                bg-red-600
                px-8 py-3
                rounded-md
                text-white
                font-semibold
                transition
                hover:opacity-75
                active:scale-95
              "
            >
              <div className='absolute -inset-1 bg-gradient-to-r from-red-400 to-red-400 opacity-75 -z-10 transition duration-200 blur-xl'></div>
              Join Now
            </button>

            <button
              type="button"
              className="
                px-8 py-3
                rounded-md
                border
                text-white
                transition
                hover:bg-white/10
                active:scale-95
              "
            >
              How it Works
            </button>
         </div>
      </section>
      </div>

     <HeroSection />
     < Join/>
     {/* <Editorial /> */}
  
   <Footer /> 
   </main>
     

    
  )
}
