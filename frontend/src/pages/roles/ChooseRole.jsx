import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {BrushIcon, Briefcase, Check, ChevronRight} from 'lucide-react'
import main from '../../assets/logos/main.png'

const ChooseRole = () => {
    const [role, setRole]=useState('')
    const navigate= useNavigate()

    const handleRedirect =()=>{
        if(!role){
            toast.error('select role!', {position:'top-center',
                className:"bg-red-500 text-white font-medium rounded-sm px-3 py-1 text-sm"
            })
            return;
        }
       navigate(`/Signin/${role}`)
    }
  return (
    <div className='flex w-full min-h-screen'>
    <div className="flex-1 bg-gray-900"></div>
     <div className='flex-1 flex justify-center items-center flex-col'>
      <form className='w-full max-w-[400px] bg-white flex flex-col'>
    
          {/* Header */}
           <div className="flex flex-col justify-start gap-1 mb-6">
            <h1 className="font-semibold text-xl tracking-tight text-slate-800">Choose your journey!</h1>
            <p className='text-sm text-gray-500'>Tell us how you'll use Creator-Lift.</p>
          </div>

          {/* Creator */}
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`relative flex items-center p-4 rounded-xl  mb-6 border border-slate-300 transition-all duration-200 ${
              role === 'creator'
                ? 'ring-1 ring-green-500'
                : ''
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center mr-4 rounded-lg ${
              role === 'creator' ? 'bg-green-400 text-white' : 'bg-slate-100'
            }`}>
              <BrushIcon size={24} />
            </div>

            <div className="flex-grow text-left">
              <h2 className="font-semibold">I'm a Creator</h2>
              <p className="text-sm text-slate-500">
                I want to monetize my expertise.
              </p>
            </div>

          </button>

          {/* Brand */}
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`relative flex items-center p-4 rounded-xl border border-slate-300 transition-all duration-200 mb-3 ${
              role === 'brand'
                ? 'ring-1 ring-green-500'
                : ''
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center mr-4 rounded-lg ${
              role === 'brand' ? 'bg-green-300 text-white' : 'bg-slate-100'
            }`}>
              <Briefcase size={24} />
            </div>

            <div className="flex-grow text-left">
              <h2 className="font-semibold">I'm a Brand</h2>
              <p className="text-sm text-slate-500">
                I want to discover talent and expand.
              </p>
            </div>
          </button>


         {/* Submit */}
       
          <button
            type="button"
            className='group w-full bg-slate-800 mt-4 px-4 py-2 rounded-full text-white text-sm font-medium h-10 flex items-center justify-center
                      hover:bg-slate-900 transition-all shadow-sm
                      disabled:opacity-60 disabled:cursor-not-allowed mb-3'
            onClick={handleRedirect}>
            Continue 
            <ChevronRight className='ml-1 w-4 h-4 group-hover:translate-x-1 transform transition-transform'/>
          </button>

        <p className='text-center text-xs'>
          Already have an account?{' '}
          <Link to='/Login' className='underline hover:text-blue-400'>
            Log in
          </Link>
        </p>

      </form>
       <div className="mt-8 flex justify-center items-center gap-2">
          <div className="w-6 h-1.5 rounded-full bg-[#607D8B]"></div>
        <div className="w-6 h-1 rounded-full bg-slate-300" />  
        </div>

    </div>
    </div>
  )
}

export default ChooseRole