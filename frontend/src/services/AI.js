import axios from 'axios'

const BASE = 'http://localhost/api'

export const AI = async (message, conversation_id) => {
    try{
    const res = await axios.post(`${BASE}/chat`, 
    {
      message,
      conversation_id: conversation_id || null
    },
    {
        withCredentials: true
    })
    return res.data
    }catch(err){
        console.error(err.response.data.error)
        throw err
    }
}

export const fetchHistory = async (conversation_id) => {
    try {
        const res = await axios.get(
            `${BASE}/chat/history/`,
            {
                params: { conversation_id },
                withCredentials: true,
            }
        )
        return res.data.messages  
    } catch (err) {
        console.error(err.response?.data?.error)
        throw err
    }
}