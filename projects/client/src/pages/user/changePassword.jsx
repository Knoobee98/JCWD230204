import axios from "axios";
import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpin from "react-loading-spin";
import toast, { Toaster } from "react-hot-toast";
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";


export default function ChangePassword (){

    const password = useRef();
    const newPassword = useRef();
    const confirmPassword = useRef();


    const [oldPassword, setOldPassword] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [viewPassword, setviewPassword] = useState(false);
    const [name, setname] = useState();
    const [data, setData] = useState();


    const Navigate = useNavigate();
    const location = useLocation();

    
	let onChangePassword = async () => {
		try {

			setDisabled(true);

			let data = await axios.patch(
				"http://localhost:8000/users/change-password/",
				{ id: location.pathname.slice(16), password: password.current.value, newPassword: newPassword.current.value, confirmPassword: confirmPassword.current.value },
                { headers: {
                    token: localStorage.getItem("token"),
                }}
			);
            console.log(data)
			toast.success(data.message);
			newPassword.current.value = ''
			confirmPassword.current.value = ''
			setTimeout(() => {
				Navigate("/login");
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setDisabled(false);
		}
	};

    return (
        <>
        <NavbarUser/>
        <HomeMenu/>
            <div className=" container h-screen flex justify-center align-center items-center">
                <div className=" bg-zinc-300 rounded-lg p-10 w-[350px] flex flex-col gap-3 justify-center border border-zinc-500">

                    <h2 className="font-semibold text-2x1 tracking-wide text-center">CHANGE PASSWORD</h2>

                        <form>
                        <label 
                            htmlFor="password"
                            className="text-sm font-medium cursor-pointer mr-5">
                            Old Password :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full" 
                            ref={password}
                            placeholder="enter your old password" 
                            required />
                            	<div>
							</div>

                        <br/>

                        <label 
                            htmlFor="password"
                            className="text-sm font-medium cursor-pointer mr-5">
                            New Password :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full"
                            ref={newPassword} 
                            placeholder="enter your new password"  
                            required/>
                        <br />

                        <label
                        htmlFor="password"
                        className="text-sm font-medium cursor-pointer mr-5">
                            Confirm New Password :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full"
                            ref={confirmPassword}
                            placeholder="enter your new password"  
                            required/>
                        <br />
                        </form>

						<button
							onClick={() => onChangePassword ()}
							disabled={disabled}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-red-600 text-black bg-green-500 rounded-lg h-[60px]"
						>
							{disabled ? (
								<LoadingSpin
									size={"30px"}
									primaryColor={"green"}
									secondaryColor={"red"}
								/>
							) : (
								"submit"
							)}
						</button>
							<Toaster />
						</div>
            </div>
        <Footer/>
        </>
      )
    }