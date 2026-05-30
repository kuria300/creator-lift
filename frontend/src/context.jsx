import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useContext, createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AuthContext= createContext(null)

const AuthProvider=({children})=>{
    const navigate= useNavigate()

    const [user, setUser]= useState(null)
    const[role, setRole]= useState(null)

    // toggle sidebar
    const [isOpen, setIsopen] = useState(true)
    const togglesidebar = () => setIsopen(prev => !prev)

    const redirect_url=import.meta.env.VITE_REDIRECT_URL

    const googleLogin= useGoogleLogin({
        flow:'auth-code', //use authorization code flow not implicit flow
        prompt: 'consent',
        onSuccess: async (codeResponse)=>{
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
            toast.success('Signin successful!', {position:'top-center'})
         }else{
            toast.success('Login successful!', {position:'top-center'})
         }
         
        }catch(error){
          toast.error('Signup Failed. Try again', {position:'top-center'})
        }
        },
      
        onError: ()=>toast.error('Login failed', {position: 'top-center'})
    })

    const LoginG=(role)=>{
       setRole(role)
       googleLogin()
    }
  

    const Logout=()=>{
        googleLogout()
        setUser(null)
    }

    return (
     <AuthContext.Provider value={{ user, LoginG, Logout, isOpen, togglesidebar}}>
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
