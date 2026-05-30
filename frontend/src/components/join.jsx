import React from 'react'
import '../App.css'

export const Join = () => {
  return (
    <section className='creatorSpot-container'>
      <div className='creatorSpot-content'>
         <h2 className='text-7xl font-teko font-semibold tracking-tight text-white/70 max-sm:text-5xl mt-12'>Creators, lifted and in the spotlight</h2>
           <div className='w-2/3 tracking-wide mt-3 max-sm:w-full'>
             <p className='text-white/60 text-balance leading-normal text-base'>
               Step into a space where your creativity gets noticed. 
               Find the tools, support, and brand connections you need to grow and thrive—no more feeling invisible.
             </p>
           </div>

         <div className='spot-container mb-6 mt-10 max-sm:mt-6'>
           <div className='relative group'>
            <img src='./pexels-cottonbro-6878172.jpg'
             width={350} 
             height={250} 
            className='
            object-contain 
            group-hover:brightness-50 
            group-hover:scale-105 
            transition 
            duration-300
            h-auto'
            />
            <div className='absolute left-4 bottom-4 right-4 text-white space-y-2 group-hover:translate-y-4'>
               <h2 className='text-2xl font-teko font-medium text-left'>Stand out to brands</h2>
               <p className='text-white/80 text-left text-sm mt-2 mb-6'>Share your work and let brands discover you. 
               Here, your creativity rises above the noise and gets the attention it deserves.</p>

               <button type='button' className='opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 
               group-hover:max-h-10 transition-all duration-300 ease-in-out py-2 px-3 bg-red-600 rounded
              text-white font-medium cursor-pointer hover:bg-red-400 mb-5 flex items-start justify-center w-full'>Discover</button>
            </div>
           </div>
            <div className='relative group'>
            <img src='./pexels-cottonbro-3205568.jpg'
             width={350} 
             height={250} 
            className='
            object-contain 
            group-hover:brightness-50 
            group-hover:scale-105 
            transition 
            duration-300
            h-auto'
            />
            <div className='absolute left-4 bottom-4 right-4 text-white space-y-2 group-hover:translate-y-4'>
               <h2 className='text-2xl font-teko font-medium text-left'>Expand your circle</h2>
               <p className='text-white/80 text-left text-sm mt-2 mb-6'>
               Meet fellow creators and brands who get you. Swap ideas, team up, and build real connections that last.</p>

               <button type='button' className='opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 
               group-hover:max-h-10 transition-all duration-300 ease-in-out py-2 px-3 bg-red-600 rounded
              text-white font-medium cursor-pointer hover:bg-red-400 mb-5 flex items-start justify-center w-full'>Join</button>
            </div>
           </div>
            <div className='relative group'>
            <img src='./pexels-ivan-s-8117813.jpg'
             width={350} 
             height={250} 
            className='
            object-contain 
            group-hover:brightness-50 
            group-hover:scale-105 
            transition 
            duration-300
            h-auto'
            />
            <div className='absolute left-4 bottom-4 right-4 text-white space-y-2 group-hover:translate-y-4'>
               <h2 className='text-2xl font-teko font-medium text-left'>Open new doors</h2>
               <p className='text-white/80 text-left text-sm mt-2 mb-6'>
               Get access to resources, tips, and special offers to help you create, connect, and reach new fans.</p>

               <button type='button' className='opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 
               group-hover:max-h-10 transition-all duration-300 ease-in-out py-2 px-3 bg-red-600 rounded
              text-white font-medium cursor-pointer hover:bg-red-400 mb-5 flex items-start justify-center w-full'>Begin</button>
            </div>
           </div>
         </div>
      </div>
    </section>
  )
}
