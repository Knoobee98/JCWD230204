import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate} from 'react-router-dom';
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

export default function Profiling (){

    const navigate = useNavigate();

    const [dataProfile, setDataProfile] = useState([])

    const getProfile = async () => {
      try {
        const response = await api.get(process.env.REACT_APP_API_GET_PROFILES, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        console.log(response.data.data)
        setDataProfile(response.data.data || [])
      } catch (error) {
        console.log(error.message)
      }
    }

    useEffect(() => {
        getProfile();
    }, [])

    const handleButtonClick = () => {
        // Navigate to PageB
        navigate('/user/editProfile');
    };

    return(
      <>
      <NavbarUser/>
      <HomeMenu/>
      <div className='flex gap-5 justify-center p-10 bg-stone-800 '>
        <div className='border rounded-lg p-7 h-[300px] w-[400px] '>
          <div>
            img
          </div>
          <h1>username</h1>
          <div>
            <button className="p-5 bg-red-500" onClick={handleButtonClick}>Edit Profile</button>
          </div>
        </div>
        <div className='border rounded-lg w-[700px] h-[600px] p-7'>
          {
            dataProfile.map((value, index) => {
              return(
                <>
                <p>name : {value.name}</p>
                <p>birthdate : {value.birthdate} </p>
                <p>gender : {value.gender} </p>
                <p>address : </p>
                </>
              )
            })
          }
        </div>
      </div>
      <Footer/>
      </>
    )
}
        


