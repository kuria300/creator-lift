import axios, { AxiosError } from 'axios'

const BASE = 'http://localhost/api'


export const fetchBrandDashboard = async () =>{
    try{
        const data = await axios.get(`${BASE}/dashboard/brand`, {withCredentials: true})

        return data.data

    }catch(error){
         if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error
    }
}

export const fetchBrandDeals = async () =>{
    try{

        const res = await axios.get(`${BASE}/deal/brand`, {withCredentials: true})

        return res.data.Deals

    }catch(error){
       if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error
    }
}

export const fetchBrandOffers = async () =>{
    try{

        const res = await axios.get(`${BASE}/offer/brand`, {withCredentials: true})

        return res.data.offers

    }catch(error){
         if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error

    }
}


export const fetchCreators = async () => {
    try{

        const res = await axios.get(`${BASE}/creators`,{ withCredentials: true})

        return res.data.creators

    }catch(error){
       if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error
    }
}

