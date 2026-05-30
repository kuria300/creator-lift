import React, { useEffect } from 'react'
import { Mail, MailOpen, LockKeyhole, KeyIcon, RefreshCcw, Check} from 'lucide-react'
import { LoaderCircle } from 'lucide-react'
import '../App.css'
import main from '../assets/logos/main.png'
import { useState } from 'react'
import { Link, useParams} from 'react-router-dom'
import { useAuth } from '../context';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
   

const Signin = () => {
    const [email, setEmail]= useState('');
    const [password, setPassword]=useState('')
    const [username, setUsername]= useState('')
    const [confirmPassword, setConfirmPassword]= useState('')
    const [errors, setErrors]= useState('')
    const [loading, setLoading]= useState(false)
    const [usernameerror, setUsernameErrors]=useState('')

    const [mail, setMail] = useState(false)
    const [usernameFocus, setUsernameFocus] = useState(false)
    const [confirmKey, setConfirmKey] = useState(false)
    const [isKey, setIskey]=useState(0)
    const [nkey, setnKey]=useState(false)
    const [spinning, setSpinning]=useState(false)
    const {LoginG}=useAuth()

    const {role} = useParams()
  
    const generatedUsername=()=>{
       return uuidv4().replace(/-/g, "").slice(0, 10)
    }

    useEffect(()=>{
      setUsername(generatedUsername)
    }, [])

    const handleRefresh=()=>{
      setSpinning(true)

      setIskey((prev)=> prev + 1)

      const newName = generatedUsername();
       setUsername(newName);

       setUsernameErrors('')

      setTimeout(() => {
        setSpinning(false)
      }, 500);

    }

    const validateUsername = (name) => {
      if(!name && name.trim() === ''){
        return 'Username is required'
      }

      if (name.length < 4) {
        return 'Username must be at least 4 characters long!';
      }
      if(!/^[a-zA-Z0-9_]+$/.test(name)) {
        return 'Invalid username!';
      }
      return '';
    };

const handleUsernameChange = (e) => {
  const value = e.target.value;
  setUsername(value);
  
  // Real-time validation"?|||||||||||||||||||||||||||||||||||||||||\\\\\
  const error = validateUsername(value);
  setUsernameErrors(error);
};
  
const handleLoginG=()=>{
    try{
        LoginG(role)
    }catch(err){
        console.error(err)
        }
  }

 const handleSignup= async (e)=>{
    e.preventDefault()
    setErrors('')

   function validateEmail(email){
    let emailPattern= /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailPattern.test(email)
   }
   if(!email || email.trim() === ''){
     setErrors('Email is required!')
      return
   }
   if(!validateEmail(email)){
      setErrors('Invalid email credential!')
      return
   }
   if(!password || password.trim() === '' || password.length < 6){
       setErrors('Password should be atleast 6 chanarcters long!')
      return
   }
   if(password !== confirmPassword){
       setErrors('Password do not match!')
      return
   }

    if (usernameerror) return setErrors('Please fix username errors first.');

   setLoading(true)
   try{
      const res= await axios.post('http://localhost:8000/api/register', {
           role,
           username: username || "Guest",
           email,
           password,
         //   confirmPassword
        })
        toast.success('Signup succesfful', {position: 'top-center'})
        navigate('/dashboard')
        

   }catch(error){
      const message= error.response?.data?.error || error.message|| 'Signin failed!'
      setErrors(message)
   }finally{
     setLoading(false)
   }
}
  return (
     <div className='signin-container'>
       <form className='signin-form' onSubmit={handleSignup} key={isKey}>
                <span className='flex flex-row items-center justify-center gap-2 mb-6'>
                    <img src={main} alt='Logo' className='size-12 object-contain rounded-3xl ' />
                    <h1 className='font-semibold text-3xl text-white'>Create Account</h1>
                </span>
                <button
                type='button'
                onClick={handleLoginG}
                className='google-signin'
                >
                  Continue With Google
                </button>

                {/* <div className='relative flex justify-center mb-6'>  
                  <p className='absolute text-white text-sm px-2 -top-3 bg-black80'>OR</p>
                  <div className='border-t border-white/20 w-full'></div>
                </div> */}

                 {/* <input type='submit' name='Link' value='Link Your TikTok Account' className='link-account'/> */}

                 <div className='relative flex justify-center mb-4'>  
                   <p className='absolute text-white text-sm px-2 -top-3 bg-black80'>OR</p>
                     <div className='border-t border-white/20 w-full'></div>
                  </div>

                <div>{errors && <p className='text-sm text-red-400 mb-2'>{errors}</p>}</div>

                <input type='hidden' name='role' value={role}/>
                {/* Username */}
                <div className='input-container'>
                    <input 
                        key={isKey}
                        type='text' 
                        name='username' 
                        className={`input border ${
                            usernameFocus 
                                ? 'border-white/20'
                                : (usernameerror ? 'border-red-400' : 'border-green-400') 
                        }`} 
                        placeholder='Username'
                        value={username}
                        onChange={handleUsernameChange}
          
                        onFocus={() => setUsernameFocus(true)} 
                        onBlur={() => setUsernameFocus(false)} 
                    />
                    {spinning ? (
                      <RefreshCcw className="input-regenerate cursor-pointer animate-spin" />
                    ) : usernameFocus ? (
                      <RefreshCcw
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleRefresh();
                        }}
                        className="input-regenerate cursor-pointer"
                      />
                    ) : (
                      <Check className="input-check" />
                    )}

                    {usernameerror && <p className="text-xs text-red-400 mt-1">{usernameerror}</p>}

                     <ul className="my-1 ml-4 text-[12px] text-gray-200 list-disc list-inside opacity-60">
                        <li>Your username is auto-generated.</li>
                        <li>Click the refresh icon to generate a new one.</li>
                        <li>You can edit it manually if you want.</li>
                      </ul>               
                </div>

                {/* email */}
                <div className='input-container'>
                  <input 
                        type='email'
                        name='email'
                        className='input'
                        placeholder='example@gmail.com'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        onFocus={()=>setMail(true)}
                        onBlur={()=>setMail(false)}
                  />
                {mail ? <MailOpen className='input-icon' />: <Mail className='input-icon' /> }
                </div>

                {/* password */}
                <div className='input-container'>
                  <input 
                        type='password'
                        name='password'
                        className='input'
                        placeholder='Password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        onFocus={()=>setnKey(true)}
                        onBlur={()=>setnKey(false)}
                  />
                {nkey ? <KeyIcon className='input-icon' />: <LockKeyhole className='input-icon' /> }
                </div>

                {/* confirm Password */}
               <div className='input-container'>
                  <input 
                        type='password'
                        name='ConfirmPassword'
                        className='input'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        onFocus={()=>setConfirmKey(true)}
                        onBlur={()=>setConfirmKey(false)}
                  />
                {confirmKey ? <KeyIcon className='input-icon' />: <LockKeyhole className='input-icon' /> }
                </div>

                <button type='submit' disabled={loading} className='signin-btn'>
                  {loading ? <LoaderCircle className='animate-spin absolute right-32 bottom-2' />: 'create account'}
                </button>

                <p className='pt-4 text-center text-xs text-slate-100'>
                    Already have an account?{' '}<Link to='/Login' className='underline hover:text-blue-400'>Login</Link>
                </p>

       </form>
       <div class="mt-8 flex justify-center items-center gap-3">
          <div class="w-8 h-1.5 rounded-full bg-[#607D8B]"></div>
          <div class="w-8 h-1.5 rounded-full bg-[#607D8B]"></div>   
        </div>
    </div>

  )
}

export default Signin