import ProfilePict from './../assets/img/user.png'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Profile() {

    const [profile, setProfile] = useState([])

    const getProfile = async() => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_GET_PROFILES ,{
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            console.log(response.data.data[0])
            setProfile(response.data.data[0])
        } catch (error) {
            console.log(error.message)
        }
    }

    const editProfile = async() => {

    }

    useEffect(() => {
        getProfile()
    }, [])

    return(
        <>
        {profile && Object.keys(profile).length !== 0 &&
        <div className="flex flex-col gap-5">
        <h1>Profile</h1>
        <div className="flex gap-6">
            <div className="flex flex-col gap-4 items-center justify-center p-4">
            {
                profile.profile_pic_url ? (
                    <>
                    <img src={profile.profile_pic_url} alt="" className="w-[100px] h-[100px] rounded-full"/>
                    </>
                ) : (
                    <>
                    <img src={ProfilePict} alt="profile" className="w-[100px] h-[100px] rounded-full"/>
                    </>
                )
            }
                <div>{profile ? profile.user.username : "username"}</div>
            </div>
            <div className='p-4'>
                <div>name : {profile ? profile.name : "john doe"}</div>
                <div>gender: {profile? profile.gender: "male"}</div>
                <div>birthdate : {profile && profile.birthdate ? profile.birthdate.slice(0, 10) : "1992-02-11"}</div>
                <div>email : {profile ? profile.user.email : "john.doe@gmail.com"}</div>
                <div>phone : {profile ? profile.user.phone_number : "1234567890"}</div>
                <div>address</div>
            </div>
        </div>
        <div>

        </div>
        
    </div>
        }
        
        </>
    )
}