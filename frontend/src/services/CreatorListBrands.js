import axios from "axios";

const BASE = 'http://localhost:8000/api'

export const fetchBrands = async () => {
    try{

        const res = await axios.get(`${BASE}/brands`, { withCredentials: true})

        return res.data.brands

    }catch(err){
        console.error(err.response.data.error)
        throw err

    }
}