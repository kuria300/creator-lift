import axios from 'axios'

const BASE = 'http://localhost:8000/api'

export const fetchCreatorDashboard = async () => {
    try{
        const res = await axios.get(`${BASE}/dashboard/creator`, {
        withCredentials: true
    })
    return res.data 
    }catch(err){
        console.error(err.response.data.error)
        throw err
    }
}