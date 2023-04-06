<<<<<<< HEAD
import UploadComponent from '../../components/uploadPayment';
import NavBar from '../../components/navbaruser';
import HomeMenu from "../../components/homemenu";
import Footer from '../../components/footer';
=======
import axios from 'axios';
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import {toast, Toaster } from 'react-hot-toast';
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";
>>>>>>> main

export default function UploadPayment() {

    return(
        <>
<<<<<<< HEAD
        <div className='bg-[#1c1c1c]'>
          <NavBar />
          <HomeMenu />
        </div>
=======
        <NavbarUser/>
        <HomeMenu/>
>>>>>>> main
        <div className="flex flex-row justify-center bg-[#1c1c1c] ">
            <div className="flex flex-col gap-4 justify-center items-center rounded-xl text-black bg-[#e6e6e6] w-[500px] h-[500px] p-4 m-5">
                <div>
                    <h1>Upload Payment</h1>
                </div>
                <div>
                    <UploadComponent/>
                </div>
            </div>
        </div>
<<<<<<< HEAD
        <Footer />
=======
        <Footer/>
>>>>>>> main
        </>
    )
}