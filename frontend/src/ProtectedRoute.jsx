import { useState, useEffect } from "react";
import { useAuth } from "./context/context";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Sparkles } from "lucide-react";

export default function ProtectedRoute({Roles}){
    const { user, role, processed, loading}= useAuth()
    const navigate= useNavigate()

      useEffect(()=>{

        if (loading || !processed) return;

        console.log(`role: ${role}`)
        console.log(`user ${user}`)

        if(!user){
            toast.error('You need to be logged in to access this page1!')
            navigate('/login', {replace: true})
            return
        }

        if(Roles && !Roles.includes(role)){
           toast.error('You do not have permission to access this page2!')
            navigate('/login', {replace: true})
            return 
        }

    }, [user, loading, processed, Roles, navigate])


      if (loading || !processed) {
        return ( 
       <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
            Creator-Lift
        </h2>

        <p className="mt-2 animate-pulse text-sm text-gray-500">
            {loading ? "Verifying your session..." : "Redirecting..."}
        </p>
        </div>
        )
        }

    return(
      <Outlet />
    )
}