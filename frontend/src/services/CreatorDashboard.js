import axios, { AxiosError } from 'axios'

const BASE = 'http://localhost/api'

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


export const fetchCreatorProfile =async ()=>{
    try{
        const response = await axios.get(`${BASE}/profile`, {
            withCredentials: true
        })

        return response.data.profile
    }catch(error){
          if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error
    }
        
}

export const fetchSP = async()=>{
    try{
        const res= await axios.get(`${BASE}/specialities`, {
            withCredentials: true
        })

        return res.data.speciality

    }catch(error){
         if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error

    }
}


export const handleSaveProfile = async(payload)=>{
    try{
        const response = await axios.patch(`${BASE}/profile/update`, payload, {withCredentials: true})
        
        return response.data.profile
    }catch(err){
         if (err instanceof AxiosError) {
            const message = err.response?.data?.error || err.message || 'server error'
            throw new Error(message)
        }
        throw error

    }
}


export const ProfileUpdatePaasword = async(payload)=>{
 try{
    const res = await axios.patch(`${BASE}/profile/password`, payload, { withCredentials: true})

    return res.data.message

 }catch(err){
    if (err instanceof AxiosError) {
            const message = err.response.data.error || err.response?.data?.detail || err.message ||'Server error.Please try again'
            throw new Error(message)
        }

        console.log(err.message)
        throw err

 }
}