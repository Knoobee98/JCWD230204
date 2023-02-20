
import "./App.css";

import { Routes, Route} from "react-router-dom";

import LandingPage from "./pages/landingPage";


export default function App(){
  return(
    <>
    {/* navbar */}
    <div className="flex justify-around gap-4 bg-blue-400 items-center">
        <div className="flex gap-7 items-center">
          <div>Logo</div>
          <div className="py-3">
            <input type="text" className="border rounded-md text-center w-[500px] h-[50px]" placeholder="mau cari apa hari ini?" />
          </div>
        </div>
        <div className="">
          <button className="bg-blue-200 rounded-md w-[100px] h-[50px]" >register</button>
        </div>
      </div>

      {/* routes */}
      <Routes>
        <Route path="/" element={<LandingPage/>} />
      </Routes>
    </>
  )
};
