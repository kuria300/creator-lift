import React, { useState, useRef } from 'react'
import { Mail, MailOpen, LockKeyhole, KeyIcon, LoaderCircle, ArrowLeftIcon } from 'lucide-react'
import '../../App.css'
import main from '../../assets/logos/main.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/context'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Turnstile } from '@marsidev/react-turnstile'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]= useState('')
  const [loading, setLoading] = useState(false)
  const [mail, setMail]= useState(false)
  const [key, setKey]= useState(false)
  const [token, setToken] = useState('')
  const turnstileRef = useRef(null)

  const navigate  = useNavigate()
  const { LoginG , updateState, googleLoading} = useAuth()

  const handleLoginG = () => {
    try {
      LoginG()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors('')

    const emailRegex = /^[a-zA-Z0-9.+_%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email || email.trim() === '')return setErrors('Email is required!')
    if (!emailRegex.test(email))return setErrors('Invalid email address!')
    if (!password || password.trim() === '') return setErrors('Password is required!')
    if (password.length < 6)return setErrors('Password must be at least 6 characters!')
    if (!token) return setErrors('Please complete the verification!')

    setLoading(true)
    try {
      const res=await axios.post('http://localhost/api/login', { email, password, turnstile_token: token }, { withCredentials: true })
      updateState(res.data.data)
      console.log(res.data.data)
      toast.success('Login successful!', { position: 'top-center' })
      navigate('/dashboard')
    } catch (error) {
    const data = error.response?.data
  let message = 'Login failed!'


  if (typeof data === 'string') {
    message = data
  } else if (typeof data?.error === 'string') {
    message = data.error
  } else if (data && typeof data === 'object') {
    const firstKey = Object.keys(data)[0]
    const firstValue = data[firstKey]
    message = Array.isArray(firstValue) ? firstValue[0] : String(firstValue)
  } else if (error.message) {
    message = error.message
  }

  setErrors(message)

  turnstileRef.current.reset()
  setToken('')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='flex w-full min-h-screen'>
    <div className="max-sm:hidden relative flex-1 min-h-screen">
      <div 
        className="absolute inset-0 bg-[url(/creator.jpg)] bg-cover bg-center bg-no-repeat object-contain"
      />
      <div className="absolute inset-0 bg-black/60" />
  </div>
    <div className='flex-1 flex justify-center items-center'>
      <form onSubmit={handleLogin} className="form-cont_login">

        {/* Header */}
        <Link to='/' className='group mb-4 transition-all flex items-center gap-1'>
          <ArrowLeftIcon size={14} className='transition-transform duration-200 group-hover:text-blue-500 group-hover:-translate-x-1'/> 
          <span className=' transition-transform duration-200 group-hover:text-blue-500'>Home</span>
        </Link>
        <div className="flex flex-col justify-start gap-1 mb-6">
          <h1 className="font-semibold text-xl text-slate-800">Welcome Back!</h1>
          <p className='text-sm text-gray-500'>Log in to access your dashbaord</p>
        </div>

        {/* Google signin */}
       <button 
        type="button" 
        onClick={handleLoginG} 
        className="w-full inline-flex items-center justify-center gap-2 p-2 
                  rounded-md bg-gray-100 text-white text-sm leading-tight hover:bg-gray-50 transition-colors cursor-pointer border border-gray-300"
      >
       {googleLoading ?
         <LoaderCircle className="animate-spin w-4 h-4 text-black" />:
          <img src='/google-icon-logo-svgrepo-com.svg' className='w-4 h-4 flex-shrink-0' alt="Google" /> 
        }
        <span className='text-black text-sm font-semibold leading-tight'>
          {googleLoading ? 'Signing in...': 'Continue with Google'}
        </span>
      </button>   
        {/* Divider */}
        <div className="relative flex justify-center my-5">
          <p className="absolute text-slate-400 text-xs px-3 -top-2.5 bg-white/80">OR</p>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Errors */}
        {errors && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3">
            {errors}
          </p>
        )}

        {/* Email */}
        <div className="input-container">
          <input
            type="email"
            name="email"
            className="w-full placeholder:text-slate-400 text-sm rounded-lg px-6 py-2 
                       border border-gray-300 outline-none text-slate-800 pr-3  focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition-colors"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setMail(true)}
            onBlur={() => setMail(false)}
          />
          {mail
            ? <MailOpen className="input-icon" aria-hidden="true" />
            : <Mail className="input-icon  " aria-hidden="true" />
          }
        </div>

        {/* Password */}
        <div className="input-container mt-3">
          <input
            type="password"
            name="password"
             className="w-full placeholder:text-slate-400 text-sm rounded-lg px-6 py-2 
                       border border-gray-300 outline-none text-slate-800 pr-3  focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition-colors"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setKey(true)}
            onBlur={() => setKey(false)}
          />
          {key
            ? <KeyIcon className="input-icon" aria-hidden="true" />
            : <LockKeyhole className="input-icon" aria-hidden="true" />
          }
        </div>

        {/* Forgot password */}
        <div className="flex justify-end w-full mt-2">
          <Link
            to="/forgot-password"
            className="text-xs text-slate-500 underline hover:text-slate-800 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <div className='flex justify-start mt-4'>
          <Turnstile 
          ref={turnstileRef}
           siteKey={import.meta.env.VITE_SITE_KEY}
           onSuccess={(tok)=> setToken(tok)}
           onError={()=> setToken('')}
           onExpire={()=>setToken('')}
           className='rounded-2xl'
          />

        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 w-full my-5" />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="form-btn"
        >
          {loading
            ? <LoaderCircle className="animate-spin mx-auto h-4 w-4" />
            : 'Login'
          }
        </button>

        {/* Sign up link */}
        <p className="pt-4 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/choose-role" className="underline font-medium hover:text-slate-800 transition-colors">
            Sign up
          </Link>
        </p>

      </form>
    </div>
 </div>
  )
}