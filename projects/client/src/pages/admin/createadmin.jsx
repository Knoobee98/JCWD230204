import React from 'react';
import { Link } from 'react-router-dom';

import Applogo from "../../assets/img/gamepedia-logo-3.png"
import Background from "../../assets//img/background.jpg"

function Signup() {
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
              <h1 className="text-3xl text-slate-800 font-bold mb-6">New Branch Admin ✨</h1>
              {/* Form */}
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email  <span className="text-rose-500">*</span></label>
                    <input id="email" className="form-input w-full" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="role">Select the Branch <span className="text-rose-500">*</span></label>
                    <select id="role" className="form-select w-full">
                      <option>Jakarta</option>
                      <option>Tangerag Selatan</option>
                      <option>Bogor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input id="password" className="form-input w-full" type="password" autoComplete="on" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-sm ml-2">Email me about product news.</span>
                    </label>
                  </div>
                  <Link className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap" to="/">Sign Up</Link>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                <div className="text-sm">
                  Have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600" to="/signin">Sign In</Link>
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

export default Signup;