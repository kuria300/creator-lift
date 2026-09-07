import axios, { AxiosError } from 'axios'

const BASE = 'http://localhost/api'

export const ImageUpload = async (fileExt)=> {
    try{
        const res = await axios.post(`${BASE}/offers/image-presign`, { file_ext: fileExt }, { withCredentials: true })

        const { presigned_ur, public_url}= res.data

        return { presigned_url, public_url }

    }catch(error){
         if (error instanceof AxiosError) {
            const message = error.response?.data?.error || error.message || 'server error'
            throw new Error(message)
        }
        throw error

    }
}