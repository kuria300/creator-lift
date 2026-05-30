import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {BrushIcon, Briefcase, Check} from 'lucide-react'
import main from '../assets/logos/main.png'

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
     <div className='choose-container'>
      <form className='form-cont'>
        <div className="flex justify-center flex-col gap-4 p-5 bg-slate-100/20 rounded-md mb-3">

          {/* Header */}
          <div className="text-center mb-6">
           <span className='flex flex-row items-center justify-center gap-2 mb-6'>
              <img src={main} alt='Logo' className='size-12 object-contain rounded-3xl ' />
              <h1 className='font-semibold text-3xl'>Creator-Lift</h1>
            </span>
            <h2 className="text-xl font-bold mb-3">
              Choose your journey
            </h2>
            <p className="text-slate-500 text-sm">
              Select the path that best aligns with your goals.
            </p>
          </div>

          {/* Creator */}
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`relative flex items-center p-4 rounded-xl border border-slate-300 transition-all duration-200 ${
              role === 'creator'
                ? 'ring-1 ring-green-500'
                : ''
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center mr-4 rounded-lg ${
              role === 'creator' ? 'bg-[#607D8B] text-white' : 'bg-slate-100'
            }`}>
              <BrushIcon size={24} />
            </div>

            <div className="flex-grow text-left">
              <h2 className="font-semibold">I'm a Creator</h2>
              <p className="text-sm text-slate-500">
                I want to monetize my expertise.
              </p>
            </div>

            {role === 'creator' && (
              <Check size={18} className="absolute right-4 text-[#607D8B]" />
            )}
          </button>

          {/* Brand */}
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`relative flex items-center p-4 rounded-xl border border-slate-300 transition-all duration-200 ${
              role === 'brand'
                ? 'ring-1 ring-green-500'
                : ''
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center mr-4 rounded-lg ${
              role === 'brand' ? 'bg-[#607D8B] text-white' : 'bg-slate-100'
            }`}>
              <Briefcase size={24} />
            </div>

            <div className="flex-grow text-left">
              <h2 className="font-semibold">I'm a Brand</h2>
              <p className="text-sm text-slate-500">
                I want to discover talent and expand.
              </p>
            </div>

            {role === 'brand' && (
              <Check size={18} className="absolute right-4 text-[#607D8B]" />
            )}
          </button>

        </div>
         {/* Submit */}
       
            <button
            type="button"
            className='signin-btn mb-3'
            onClick={handleRedirect}
          >
            Create Account
          </button>

        <p className='text-center text-xs'>
          Already have an account?{' '}
          <Link to='/Login' className='underline hover:text-blue-400'>
            Log in
          </Link>
        </p>

      </form>

       <div class="mt-8 flex justify-center items-center gap-3">
          <div class="w-8 h-1.5 rounded-full bg-[#607D8B]"></div>
          <div class="w-8 h-1.5 rounded-full bg-slate-300"></div>   
        </div>
    </div>
  )
}

export default ChooseRole