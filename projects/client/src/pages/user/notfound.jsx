import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect} from "react";


export default function NotFound(){
    const Navigate = useNavigate()
    const Location = useLocation()

    const confirm = async() => {
        try {
            let {data}= await axios.post('http://localhost:8000/users/notFound')
            setTimeout(()=> {
                Navigate("/")
            }, 3000)
        } catch (error) {
            console.log(error)  
        }
    }

    useEffect(() => {
        confirm()
    }, []);

    return (
        <>
        <div className='activation container flex justify-center align-center items-center'>
            <div className='flex flex-col justify-center items-center h-[500px] w-[600px]'>
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Whoops!</h1>
                </div>
                <h1 className="text-5xl">
                error 
                </h1>
                <div className='my-4'>
                    <h2 className='text-md'>404 NOT FOUND</h2>
                </div>
                </div>
        </div>
        </>
    )
}