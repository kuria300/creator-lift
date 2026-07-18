import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AuthContext= createContext(null)

const AuthProvider=({children})=>{
    const navigate= useNavigate()

    const [user, setUser]= useState(()=>{
        const store = localStorage.getItem('user')
        return store ? JSON.parse(store) : null
       }
    )
    const[role, setRole]= useState(null)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    // toggle sidebar
    const [isOpen, setIsopen] = useState(true)
    const togglesidebar = () => setIsopen(prev => !prev)

    const redirect_url=import.meta.env.VITE_REDIRECT_URL

    useEffect(()=>{
        const storeSession = async ()=>{
            try{
                const res = await axios.get('http://localhost:8000/api/me', { withCredentials: true})
                setUser(res.data)
                 localStorage.setItem('user', JSON.stringify(res.data))

            }catch(err){
                // token expired or invalid
                console.error(err)
                setUser(null)
                localStorage.removeItem('user')
                
            }finally{
                setLoading(false)
            }
        }

        storeSession()
    }, [])

    const googleLogin= useGoogleLogin({
        flow:'auth-code', //use authorization code flow not implicit flow
        prompt: 'consent',
        onSuccess: async (codeResponse)=>{
            setGoogleLoading(true)
        try{
        const payload=  {code:codeResponse.code}

        if (role) payload.role= role // only send if it exists

        const res= await axios.post(redirect_url, payload,  {
            withCredentials: true
            })      

         console.log(codeResponse.code)
         //console.log(res.data)
         setUser(res.data)
         navigate('/dashboard')
         if(res.data.is_new){
            toast.success('Account created successfully!', {position:'top-center'})
         }else{
            toast.success('Welcome Back!', {position:'top-center'})
         }
         
        }catch(error){
            const errMsg  = error.response?.data.role
            // console.error('2', errMsg)
            if(errMsg){
              toast.error('Please register first!.', { position: 'top-center' })
              navigate('/choose-role')
            }else{
              toast.error('Signup Failed.Try again Later', {position:'top-center'})
            }
        }finally{
            setGoogleLoading(false)
        }
        },
      
        onError: ()=>toast.error('Login failed', {position: 'top-center'})
    })

    const LoginG=(role)=>{
       setRole(role)
       googleLogin()
    }

    const updateState = (data)=> {
        setUser(data)
        localStorage.setItem('user',JSON.stringify(data))
    }
  

    const Logout2=()=>{
        googleLogout()
        setUser(null)
    }

     const Logout= async()=>{
      try{
        await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true})
      }catch(err){
        console.error(err)
      }finally{
        // always run regardless of failure
         setUser(null)
        localStorage.removeItem('user')
      }
    }

    return (
     <AuthContext.Provider value={{ user, LoginG, Logout, isOpen,loading, togglesidebar, updateState, googleLoading}}>
      {children}
    </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth=()=>{
    const contextData= useContext(AuthContext)
    if(!contextData) throw new Error('no data found')

    return contextData
}
