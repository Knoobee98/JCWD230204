import axios from "axios";
import { useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/sidebaradmin'

export default function LoginAdmin(){
	
	const email = useRef();
	const password = useRef();
	const Navigate = useNavigate();

	let onLogin = async () => {
		try {
			
			let data = await axios.post("http://localhost:8000/admin/login", {
				email: email.current.value,
				password: password.current.value,
			});
			localStorage.setItem("token", `${data.data.data.token}`);
			toast.success("login success");
			email.current.value = "";
			password.current.value = "";
			setTimeout(() => {
				Navigate("/admin/dashboard");
			}, 2000);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

    return (
        <>
            <div className=" container h-screen flex justify-center align-center items-center">
                <div className=" bg-zinc-300 rounded-lg p-10 w-[350px] flex flex-col gap-3 justify-center border border-zinc-500">

                    <h2 className="font-semibold text-2x1 tracking-wide text-center">LOGIN ADMIN</h2>

                        <div>
                        <label 
                            htmlFor="email"
                            className="text-sm font-medium cursor-pointer mr-5">
                            Email :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full" 
                            ref={email}
                            type="email" 
                            placeholder="enter your email address" 
                            required />{" "}
                            	<div>
							</div>
                        <br />

                        <label
                        htmlFor="password"
                        className="text-sm font-medium cursor-pointer mr-5">
                            Password :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full"
                            ref={password}
                            type="password"
                            placeholder="enter your password" 
                            required/>
                        
                        <br />
                        </div>

						<button
							onClick={() => onLogin()}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-red-600 text-black bg-green-500 rounded-lg h-[60px]"
						>
							login
						</button>
                        
                        <a
							className=" text-red-500 flex justify-end content-end mt-[10px] "
							href="/forgotPassword">
							Forgot Password?
						</a>

                        <a
							className=" justify-center underline text-[14px] text-red-500 flex mt-[12px] "
							href="/login">
							Not an admin? Log in Now
						</a>

						<div className=" mt-[15px] flex items-center justify-center text-slate-400 text-[12px] ">
							<p>Don't have an account? </p>
							<a href="/register" className=" text-red-500 underline">
								Register Now
							</a>
							<Toaster />
						</div>
                    </div>
             </div>
        </>
      )
    }
