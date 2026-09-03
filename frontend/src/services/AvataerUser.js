import axios, { AxiosError } from 'axios'


const BASE = 'http://localhost/api'

export const AvaterUpload = async(fileExt)=>{
  try{
    const response = await axios.post(`${BASE}/profile/avatar-presign`, { file_ext: fileExt }, { withCredentials: true })

    const { presigned_url, public_url } = response.data

    return { presigned_url, public_url }

  }catch(err){
     if (err instanceof AxiosError) {
            const message = err.response?.data?.error || err.message || 'server error'
            throw new Error(message)
        }
        throw err 
  }
}




