import axios from "axios";

const BASE = 'http://localhost:8000/api'

export const CreatorOffers = async()=>{
    try{
        const res = await axios.get(`${BASE}/offers/creator`, { withCredentials: true})

        return res.data

    }catch(err){
        console.error(err.response.data.error)
        throw err
    }
}


export const AllCreatorOffers = async () => {
    try{
    const res = await axios.get(`${BASE}/offers`, { withCredentials: true })
    return res.data

    }catch(err){
        console.error(err.response.data.error)
        throw err
    }
  
}