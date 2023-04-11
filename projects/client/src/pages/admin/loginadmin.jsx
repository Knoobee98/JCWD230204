import React from 'react';
import axios from "axios";

import { useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';
import Applogo from "../../assets/img/gamepedia-logo-4.png"
import Background from "../../assets//img/background.jpg"

function Signin() {
  const email = useRef();
	const password = useRef();
	const Navigate = useNavigate();

  // const [role, setRole] = useState('super admin')

	let onLogin = async () => {
		try {
      console.log(email.current.value, password.current.value);
			let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/login`, {
				email: email.current.value,
				password: password.current.value,
			});
      console.log(response.data)
      const token = response.data.data
			localStorage.setItem("token", token);
			toast.success("login success");
			email.current.value = "";
			password.current.value = "";

      setTimeout(() => {
        Navigate("/admin/dashboard")
      }, 2000);

		} catch (error) {
			toast.error(error.message);
		}
	};

  // const handleSelectRole = (event) => {
  //   setRole(event.target.value)
  //   console.log(role)
  // }

  return (
    <main className="bg-white">

      <div className="relative md:flex">

        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">

            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                <img src={Applogo} alt="logo" className="w-[125px]" />
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto px-4 py-8">
              <h1 className="text-3xl text-slate-800 font-bold mb-6">Welcome back, Min! ✨</h1>
              
              {/* Form */}
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input id="email" ref={email} className="form-input w-full" type="email" />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="role">Your Role <span className="text-rose-500">*</span></label>
                    <select id="role" onChange={handleSelectRole} className="form-select w-full">
                      <option value={"super admin"}>Super Admin</option>
                      <option value={"branch admin"}>Branch Admin</option>
                    </select>
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input id="password" ref={password} className="form-input w-full" type="password" autoComplete="on" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link className="text-sm underline hover:no-underline" to="/user/login">Not an admin?</Link>
                  </div>
                  <button onClick={() => onLogin()} className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Sign In</button>
                </div>
                <Toaster />
              </div>

              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                
                {/* Warning */}
                <div className="mt-5">
                  <div className="bg-amber-100 text-amber-600 px-3 py-2 rounded">
                    <svg className="inline w-3 h-3 shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                    </svg>
                    <span className="text-sm">
                      Kerja keras boleh, sakit keras jangan! Jangan lupa main~
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={Background} width="760" height="1024" alt="Authentication" />
          
        </div>

      </div>

    </main>
    
  );
}

export default Signin;