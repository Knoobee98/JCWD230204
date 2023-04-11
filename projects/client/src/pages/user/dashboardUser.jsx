import { useState, useEffect } from "react";
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import TransactionList from '../../components/transactionList'
import Profile from '../../components/profile'
import { MdOutlineDashboard, MdHistory, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import NavBar from '../../components/navbaruser';
import HomeMenu from "../../components/homemenu";
import Footer from '../../components/footer';

export default function DashboardUser(){

    const Navigate = useNavigate()
    const [select, setSelect] = useState('')

    const onLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout Success');
        
        setTimeout(() => {
            Navigate('/')
        }, 1000)

    }
    
    useEffect(() => {
        
    }, [])

    return(
        <>
        <div className='bg-[#1c1c1c]'>
            <NavBar />
            <HomeMenu />
        </div>
        <div className="flex justify-center bg-[#1c1c1c]">
            <div className="flex flex-col gap-7 w-[300px] h-[700px] border my-4 p-4 rounded-l-xl bg-white">
                 {/* sidebar */}
                <div className="text-lg">
                    <ul className="flex flex-col gap-5">
                        <li className="flex gap-3 items-center" onClick={() => {setSelect('dashboard')}}> <MdOutlineDashboard/> Dashboard</li>
                        <li className="flex gap-3 items-center" onClick={() => {setSelect('profile')}}> <CgProfile/> Profile</li>
                        <li className="flex gap-3 items-center" onClick={() => {setSelect('Transaction')}}> <GrTransaction/> Transaction</li>
                        <li className="flex gap-3 items-center" onClick={() => {setSelect('TransactionHistory')}}> <MdHistory/> Transaction History</li>
                    </ul>
                </div>
                <div>
                    <button onClick={onLogout} className="flex gap-3 items-center">Logout <MdLogout/> </button>
                </div>
            </div>

            <div className="w-[900px] border my-4 p-4 rounded-r-xl bg-white">
                {/* content */}
                {
                    select === "Transaction" ? (<TransactionList />) : 
                    select === "TransactionHistory" ? (<h1>Transaction History</h1>) :
                    select === "profile" ? (<Profile />) : 
                    (<h1>Dashboard</h1>)
                }
            </div>
        </div>
        <Footer />
        </>
    )
}