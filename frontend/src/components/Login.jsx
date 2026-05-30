import React from 'react'
import { Mail } from 'lucide-react';
import { MailOpen } from 'lucide-react';
import { LockKeyhole, KeyIcon } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import '../App.css'
import main from '../assets/logos/main.png'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import axios from 'axios';



export const Login = () => {
    const [email, setEmail]= useState('');
    const [password, setPassword]=useState('')
    const [errors, setErrors]= useState('')
    const [loading, setLoading]= useState(false)

    const [mail, setMail]= useState(false)
    const [key, setKey]= useState(false)
    const navigate= useNavigate()
    const {LoginG}=useAuth()

const handleLoginG=()=>{
      try{
            LoginG()
      }catch(err){
             console.error(err)
          }
  }
      
const handleLogin = async (e) =>{ 
     e.preventDefault()
     setErrors('')
      // validate inputs
      function validateEmail(email){
        let regex= /^[a-zA-Z0-9.+_%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email)
      }
      if(!email || email.trim() === ''){
        setErrors('Email is empty!')
        return 
      }
      if(!validateEmail(email)){
        setErrors('Invalid email credential!')
        return 
      }

      if(!password || password.trim() === ''){
         setErrors('Password is empty!')
        return 
      }
      if(password.length < 6){
         setErrors('password should be more than 6 characters!')
        return 
      }
      //  if we got to here inouts are fine so start api call and make it load
       setLoading(true)

      try{
        const res= await axios.post('http://localhost:8000/api/login', {
           email,
           password
        })
        toast.success('Login successful!', {position:'top-center'})
        navigate('/dashboard')
        
        setErrors('')
        setLoading(false)

      }catch(error){
         const message= error.response?.data?.error || error.message || 'Login failed!'
         console.log(message)
         setErrors(message)
      } finally{
        setLoading(false)
      }
    }
  return (
     <div className='login-container'>
        <form onSubmit={handleLogin} className='form-cont_login'>
           <span className='flex flex-row items-center justify-center gap-2 mb-8'>
                <img src={main} alt='Logo' className='size-12 object-contain rounded-3xl '/>
                <h1 className='font-semibold text-3xl text-white'>CreatorLift</h1>
            </span>
            <button
                onClick={handleLoginG}
                className='google-signin'
                >
                  Continue With Google
            </button>
             <div className='relative flex justify-center my-6'>  
                   <p className='absolute text-white text-sm px-2 -top-3 bg-black80'>OR</p>
                    <div className='border-t border-white/20 w-full'></div>
              </div>

       
            <div className='text-sm mb-2 text-red-400'>{errors && <p>{errors}</p>}</div>
           <div className='input-container'>
             <input  
             type='email' 
             name='email' 
             className='input' 
             placeholder='email' 
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             onFocus={()=>setMail(true)} 
             onBlur={()=>setMail(false)}
             />
             {mail ? <MailOpen className='input-icon' aria-hidden='true'/>:<Mail className='input-icon' aria-hidden='true'/>}
           </div>

           <div className='input-container'>
            <input 
            type='password' 
            name='password' 
            className='input' 
            placeholder='Password' 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            onFocus={()=>setKey(true)} 
            onBlur={()=>setKey(false)}
            required
            />
            {key ? <KeyIcon className='input-icon' aria-hidden='true'/>:<LockKeyhole className='input-icon' aria-hidden="true"/>}
           </div>
           
            <p className='flex justify-end w-full pt-2'><Link to='/forgot-password' className='underline text-xs text-white hover:text-blue-400'>forgot your password?</Link></p>
            
            <div className='flex justify-center my-6'>  
                <div className='border-t border-white w-full'></div>
            </div>
           <button className='form-btn' type='submit'disabled={loading} >
             {loading ? <LoaderCircle className='animate-spin mx-auto' /> : 'Login'}
           </button>
           <p className='pt-4 text-center text-xs text-white'>Don't have an account? <Link to='/choose-role' className='underline hover:text-blue-400'>Sign up</Link></p>
        </form>
     </div>
  )
}
