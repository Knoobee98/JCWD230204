import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/sidebaradmin'


export default function LoginAdmin(){
	
	const [email,setEmail] = useState();
	const [password,setPassword] = useState();
	const Navigate = useNavigate();

	let handleSubmit = async () => {
		try {
			
			let data = await axios.post("http://localhost:8000/admin/branchAdmin", {
				email: email,
				password: password,
			});
			toast.success("new branch admin registered");
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

                    <h2 className="font-semibold text-2x1 tracking-wide text-center">BRANCH ADMIN REGISTER</h2>

                        <div>
                        <label 
                            htmlFor="email"
                            className="text-sm font-medium cursor-pointer mr-5">
                            Email :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full" 
                            value={email} onChange={(e) => setEmail(e.target.value)}
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
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="enter your password" 
                            required/>
                        
                        <br />
                        </div>

						<button
							onClick={() =>handleSubmit()}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-red-600 text-black bg-green-500 rounded-lg h-[60px]"
						>
							register
						</button>
                        
							<Toaster />
                    </div>
             </div>
        </>
      )
    }
