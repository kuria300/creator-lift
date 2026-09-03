import { useState } from "react"

export const useToggleAi=()=>{

    const [open ,setOpen]=useState(false)

    const toggleAiState=()=>{
        setOpen(!open)
    }

    return {open, setOpen, toggleAiState}
}