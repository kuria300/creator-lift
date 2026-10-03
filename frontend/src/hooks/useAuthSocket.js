import { useEffect, useState } from "react"
import { useAuth } from "../context/context"
import { singletonSockets, closeSockets} from "../lib/Socket"

export const useAuthSocket=()=>{
    const { user, loading, processed } =useAuth()

    useEffect(()=>{

        if (user && !loading && processed) {
          try{
            singletonSockets()
          }catch(error){
            console.error("Failed to initialize sockets:", error);
          }

        }
        return ()=> closeSockets()
    }, [user, processed, loading])

}