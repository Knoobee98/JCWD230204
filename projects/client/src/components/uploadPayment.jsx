import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom' 

export default function UploadPayment() {
    const [file, setFile] = useState(null)
    const { id } = useParams()

    const token = localStorage.getItem('token')
    const Navigate = useNavigate()

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    const handleUpload = async() => {
        try {
            const formData = new FormData()
            formData.append('images', file)
            const response = await axios.post(`http://localhost:8000/api/transaction/uploadPayment/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: token
                }
            })
            console.log(response)
            toast("upload payment successful")
            setTimeout(() => {
                Navigate('/')
            }, 1000)
            
        } catch (error) {
            console.log(error)
        }
        

    }

    return(
        <>
        <div className='flex flex-col gap-4 justify-center items-center'>
            <input type='file' onChange={handleFile} />
            <button className='p-4 bg-[#db2b39] rounded-full text-white' onClick={handleUpload}>Upload Payment Proof</button>
        </div>
        </>
    )
}