import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect} from "react";
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

export default function Activation(){
    const Navigate = useNavigate()
    const Location = useLocation()
    console.log(Location.pathname.slice(12))

    const confirm = async() => {
        try {
            await axios.patch('http://localhost:8000/users/activation/id', {id:Location.pathname.slice(12)})
            setTimeout(()=> {
                Navigate("/user/login")
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
        <NavbarUser/>
        <HomeMenu/>
        <div className='activation container flex justify-center align-center items-center'>
            <div className='flex flex-col justify-center items-center h-[500px] w-[600px]'>
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Your Account Verified!</h1>
                </div>
                <h1 className="text-5xl">
                Welcome to Gamepedia
                </h1>
                <div className='my-4'>
                    <h2 className='text-md'>Jadi GG bersama kami</h2>
                </div>
                </div>
        </div>
        <Footer/>
        </>
    )
}