import React, { useEffect, useState } from 'react'
import { Mail, MailOpen, LockKeyhole, KeyIcon, RefreshCcw, Check, LoaderCircle } from 'lucide-react'
import '../../App.css'
import main from '../../assets/logos/main.png'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/context'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import axios from 'axios'

const Signin = () => {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [username, setUsername]   = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [usernameError, setUsernameError] = useState('')

  const [mail, setMail]               = useState(false)
  const [usernameFocus, setUsernameFocus] = useState(false)
  const [confirmKey, setConfirmKey]   = useState(false)
  const [isKey, setIsKey]             = useState(0)
  const [nkey, setNkey]               = useState(false)
  const [spinning, setSpinning]       = useState(false)

  const { LoginG, updateState, googleLoading }  = useAuth()
  const { role }    = useParams()
  const navigate =useNavigate()

  const generatedUsername = () =>
    uuidv4().replace(/-/g, '').slice(0, 10)

  useEffect(() => {
    setUsername(generatedUsername())
  }, [])

  const handleRefresh = () => {
    setSpinning(true)
    setIsKey((prev) => prev + 1)
    setUsername(generatedUsername())
    setUsernameError('')
    setTimeout(() => setSpinning(false), 500)
  }

  const validateUsername = (name) => {
    if (!name || name.trim() === '') return 'Username is required'
    if (name.length < 4) return 'Username must be at least 4 characters long!'
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Invalid username!'
    return ''
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value
    setUsername(value)
    setUsernameError(validateUsername(value))
  }

  const handleLoginG = () => {
    try {
      LoginG(role)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setErrors('')

    const emailPattern = /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email || email.trim() === '')         return setErrors('Email is required!')
    if (!emailPattern.test(email))             return setErrors('Invalid email address!')
    if (!password || password.length < 6)      return setErrors('Password must be at least 6 characters!')
    if (password !== confirmPassword)          return setErrors('Passwords do not match!')
    if (usernameError)                         return setErrors('Please fix username errors first.')

    setLoading(true)
    try {
      const res= await axios.post('http://localhost:8000/api/register', {
        role,
        username: username || 'Guest',
        email,
        password,
      }, { withCredentials: true })
      updateState(res.data)
      console.log(res.data)
      toast.success('Account created successfully!', { position: 'top-center' })
      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Signup failed!'
      setErrors(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex w-full min-h-screen'>
    <div className="max-sm:hidden flex-1 bg-gray-900"></div>
     <div className='flex-1 flex justify-center items-center flex-col'>
      <form className="w-full max-w-[400px] bg-white flex flex-col" onSubmit={handleSignup} key={isKey}>

        {/* Header */}
        <div className="flex flex-col justify-start gap-1 mb-6">
          <h1 className="font-semibold text-2xl text-slate-800">Create your creator Account</h1>
          <p className='text-sm text-gray-500'>Just a few details to get started.</p>
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

        <input type="hidden" name="role" value={role} />

        {/* Username */}
        <div className="input-container">
          <input
            key={isKey}
            type="text"
            name="username"
            className={`className="w-full placeholder:text-slate-400 text-sm rounded-lg px-6 py-2 
                       border border-gray-300 outline-none text-slate-800 pr-3  focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition-colors ${
              usernameFocus
                ? 'border-slate-300'
                : usernameError
                ? 'border-red-400'
                : 'border-green-400'
            }`}
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
          />

          {/* Username icon */}
          {spinning ? (
            <RefreshCcw className="input-regenerate animate-spin" />
          ) : usernameFocus ? (
            <RefreshCcw
              onMouseDown={(e) => { e.preventDefault(); handleRefresh(); }}
              className="input-regenerate cursor-pointer"
            />
          ) : (
            <Check className="input-check" />
          )}

          {usernameError && (
            <p className="text-xs text-red-500 mt-1">{usernameError}</p>
          )}

          <ul className="mt-1 ml-3 text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
            <li>Your username is auto-generated.</li>
            <li>Click the refresh icon to generate a new one.</li>
            <li>You can edit it manually if you want.</li>
          </ul>
        </div>

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
            ? <MailOpen className="input-icon" />
            : <Mail className="input-icon" />
          }
        </div>

        {/* Password */}
        <div className="input-container">
          <input
            type="password"
            name="password"
             className="w-full placeholder:text-slate-400 text-sm rounded-lg px-6 py-2 
                       border border-gray-300 outline-none text-slate-800 pr-3  focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition-colors"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setNkey(true)}
            onBlur={() => setNkey(false)}
          />
          {nkey
            ? <KeyIcon className="input-icon" />
            : <LockKeyhole className="input-icon" />
          }
        </div>

        {/* Confirm Password */}
        <div className="input-container">
          <input
            type="password"
            name="ConfirmPassword"
             className="w-full placeholder:text-slate-400 text-sm rounded-lg px-6 py-2 
                       border border-gray-300 outline-none text-slate-800 pr-3  focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition-colors"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmKey(true)}
            onBlur={() => setConfirmKey(false)}
          />
          {confirmKey
            ? <KeyIcon className="input-icon" />
            : <LockKeyhole className="input-icon" />
          }
        </div>

        {/* Submit */}
         <button
            type="submit"
            className='group w-full bg-slate-800 mt-4 px-4 py-2 rounded-full text-white text-sm font-medium h-10 flex items-center justify-center
                      hover:bg-slate-900 transition-all shadow-sm
                      disabled:opacity-60 disabled:cursor-not-allowed mb-3'
            disabled={loading}>
          {loading
            ? <LoaderCircle className="animate-spin mx-auto h-4 w-4" />
            : 'Create Account'
          }
        </button>

        {/* Login link */}
        <p className="pt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/Login" className="underline hover:text-slate-800 font-medium">
            Login
          </Link>
        </p>

      </form>

      {/* Dots */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <div className="w-6 h-1 rounded-full bg-slate-300" />
        <div className="w-6 h-1.5 rounded-full bg-[#607D8B]"></div>
      </div>
    </div>
    </div>
  )
}

export default Signin