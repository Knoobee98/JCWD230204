import axios from 'axios'
import { useRef } from 'react'
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

export default function EditProfileForm(){
    const email = useRef();
    const name = useRef();
    const gender = useRef();
    const birthdate = useRef();

    let onSubmit = async() => {
        try{
            let inputEmail = email.current.value
            let inputName = name.current.value
            let inputGender = gender.current.value
            let inputBirthdate = birthdate.current.value
            let result = await axios.patch('localhost:8000/users/editProfiles', {email: inputEmail, name: inputName, gender: inputGender, birthdate: inputBirthdate})
        }catch (error){
            console.log(error)
        }
    }

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    // };
    const updateProfile = () => {
        let contoh = axios.put('localhost:8000/users/update')
    };
    return(
        <>
         <NavbarUser/>
         <HomeMenu/>
            <div className="bg-stone-200 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-slate-50 rounded-lg flex flex-col justify-center gap-5 items-center p-4 m-4 border">
                        <div className='font-serif text-3xl'>Edit Profile</div>
                        <div className="flex flex-col gap-5">
                            <div>
                                <h2>Email</h2>
                                <input 
                                type="text"
                                ref={email} 
                                className="h-10 px-6 font-semibold rounded-full border border-slate-200 text-slate-900"
                                />
                            </div>
                            <div>
                                <h2>Name</h2>
                                <input 
                                type="text"
                                ref={name} 
                                className="h-10 px-6 font-semibold rounded-full border border-slate-200 text-slate-900"
                                />
                            </div>
                            <div>
                                <h3>Birthdate</h3>
                                <input 
                                type="text" 
                                ref={birthdate} 
                                className="h-10 px-6 font-semibold rounded-full border border-slate-200 text-slate-900"
                                />
                            </div>
                            <div>
                                <h3>Gender</h3>
                                <select type="text"
                                ref={gender} 
                                className="h-10 px-6 font-semibold rounded-full border border-slate-200 text-slate-900">
                                <option> Male </option>
                                <option> Female </option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button className="p-3 border rounded-lg bg-green-300 w-[150px]" onClick={onSubmit}>submit</button>
                        </div>
                    </div>
                </div>
            </div>  
            <Footer/>               
        </>
    )
}