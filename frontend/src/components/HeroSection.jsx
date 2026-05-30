import '../App.css'
import { Expand, ExpandIcon, Star, User } from 'lucide-react';

const HeroSection = () => {
  return (

      <section className='creatorfeed-container'>
        <div className='creatorfeed-content'>
           <h2 className='text-7xl font-teko font-semibold tracking-tight text-white/70 max-sm:text-5xl mt-6'>Creators, seen and celebrated.</h2>
           <div className='w-2/3 tracking-wide mt-3 max-sm:w-full'>
             <p className='text-white/60 text-balance leading-normal text-base'>
               Step into a space where your creativity isn't hidden by algorithms. 
               Here, you'll find a supportive community, real brand connections, and the tools to help your voice rise above the noise. 
               Let's make your content the next big thing.
             </p>
           </div>
           <div className='box-container'>
            <div className='group relative bg-[#6464b4] border border-black80 rounded-md p-10'>
              {/* backgound hover effect */}
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 
                    opacity-0 blur-xl transition duration-500 -z-10 group-hover:opacity-75 group-hover:duration-200"></div>

            <div className='box-content'>
              <ExpandIcon className='text-red-500' />
              <h3 className='font-semibold font-teko text-balance tracking-tight text-[24px] text-white/70'>Expand your reach</h3>
              <p className='text-white/75'>Share your work with a wider, engaged audience. No more feeling invisible—your content gets the spotlight it deserves.</p>
            </div>
            </div>
            <div className='group relative bg-[#1D1D1F] border border-black80 rounded-md p-10'>
              {/* backgound hover effect */}
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 
                    opacity-0 blur-xl transition duration-500 -z-10 group-hover:opacity-75 group-hover:duration-200"></div>
            <div className='box-content'>
              <User className='text-red-500' />
              <h3 className='font-semibold font-teko text-balance tracking-tight text-[24px] text-white/70'>Collaborate with Brands</h3>
              <p className='text-white/75'>Meet brands eager for authentic creators. Build partnerships that value your unique style and story.</p>
            </div>
            </div>
            <div className='group relative bg-[#1D1D1F] border border-black80 rounded-md p-10'>
              {/* backgound hover effect */}
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 
                    opacity-0 blur-xl transition duration-500 -z-10 group-hover:opacity-75 group-hover:duration-200"></div>
            <div className='box-content'>
              <Star className='text-red-500' />
              <h3 className='font-semibold font-teko text-balance tracking-tight text-[24px] text-white/70'>Earn from your creativity</h3>
              <p className='text-white/75'>Transform your passion into income. Simple tools help you get noticed, grow, and get paid for what you love.</p>
            </div>
            </div>
           </div>
        </div>
      </section>
  )
}

export default HeroSection