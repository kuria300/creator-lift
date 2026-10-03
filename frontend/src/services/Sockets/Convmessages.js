import axios, { AxiosError } from 'axios'

const BASE = 'http://localhost/api'

export const fetchConversationMessages = async (conversation_id) => {
    try{
        const res = await axios.get(`${BASE}/conversations/${conversation_id}/messages`, {
        withCredentials: true
    })
    return res.data.data
    }catch(err){
        console.error(err.response.data.error)
        throw err
    }
}