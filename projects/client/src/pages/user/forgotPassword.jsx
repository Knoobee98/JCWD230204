import axios from 'axios';
import { useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import LoadingSpin from "react-loading-spin";
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

export default function ForgotPassword(){
    const [disabled, setDisabled] = useState (false);
    const [data, setData] = useState ();

    const email = useRef();
	const Navigate = useNavigate();

	let onForgotPassword = async () => {
		try {
			setDisabled(true);
			let { data } = await axios.post("http://localhost:8000/users/forgot-password",
				{ email: email.current.value }
			);
			toast.success(data.message);
			email.current.value = "";
			setTimeout(() => {
				Navigate('/login');
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setDisabled(false);
		}
	};

    let ValidateEmail = (value) => {
		if (value === "") {
			setData("Please input your email");
		} else if (
			!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value)
		) {
			setData("Format Email Invalid");
		} else {
			setData("");
		}
	};

    return (
        <>
		 <NavbarUser/>
         <HomeMenu/>
            <div className=" container h-screen flex justify-center align-center items-center">
                <div className=" bg-zinc-300 rounded-lg p-10 w-[350px] flex flex-col gap-3 justify-center border border-zinc-500">
                    
                    <h2 className="font-semibold text-2x1 tracking-wide text-center">FORGOT PASSWORD</h2>

                        <form>
                        <label 
                            htmlFor="email"
                            className="text-sm font-medium cursor-pointer mr-5">
                            Email :
                        </label>

                        <input 
                            className=" text-zinc-600 outline-none px-5 h-10 border rounded-md border-sm w-full" 
                            ref={email}
                            type={"email"} 
                            onChange={(e) => ValidateEmail(e.target.value)} 
                            placeholder="enter your email address" 
                            id="email" 
                            name="email" 
                            required />{" "}
                        <br />
                        </form>

						<button
							onClick={() => onForgotPassword ()}
							disabled={disabled}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-red-600 text-black bg-green-500 rounded-lg h-[50px]"
						>
							{disabled ? (
								<LoadingSpin
									size={"30px"}
									primaryColor={"green"}
									secondaryColor={"red"}
								/>
							) : (
								"Submit"
							)}
						</button>
                        
                    </div>
             </div>
			 <Footer/>
        </>
      )
    }
