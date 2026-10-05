import { useCallback, useEffect, useRef, useState } from "react"
import { fetchUnreadNotifications } from "../services/Sockets/Convmessages"
import { singletonSockets } from "../lib/Socket"


export const useUnreadNotification =(userId)=>{
  const [count, setCount] = useState(0)
  const socketRef = useRef(null)

  const refetch=useCallback(async ()=>{
   try{
     setCount(await fetchUnreadNotifications())
   }catch{
    return count
   }
  }, [])

 
  const MarkAllRead =useCallback(()=>{
    const socket = singletonSockets().notificationSocket
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    socket.send(JSON.stringify({ type: "mark_all_read" }))
    return true
  }, [])

  useEffect(()=>{
    if(!userId) return

    let socket
    try{
       socket= singletonSockets().notificationSocket
    }catch { return }

    socketRef.current=socket

    const onMessage = (e)=>{
      let data
      try { data = JSON.parse(e.data) } catch { return }

      if (data.type === "new_notification") setCount((c) => c + 1)
      if (data.type === "notifications_changed") refetch()
      if (data.type === "notifications_read") {
        setCount(0)
        toast.success(
          data.count > 0
            ? `Marked ${data.count} notification${data.count > 1 ? "s" : ""} as read`
            : "No new Messages"
        )
      }

      if (data.type === "error") toast.error(data.message) 
    }

     socket.addEventListener("message", onMessage)
    return () => socket.removeEventListener("message", onMessage)
  }, [userId, refetch])

  return { count, MarkAllRead}
}