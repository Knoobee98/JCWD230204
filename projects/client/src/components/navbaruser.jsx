import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Applogo from "./../assets/img/gamepedia-logo-4.png"
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdLogin, MdLogout, MdSpaceDashboard } from "react-icons/md";

export default function NavbarUser(){
    const Navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token")
    toast("Logged out successfully")
    setTimeout(() => {
      Navigate('/')
    },1000)
  }
    return(
    <div className="flex justify-center gap-10 h-[90px] items-center drop-shadow-lg bg-[#1c1c1c] sticky top-0 z-50">
    <div onClick={() => Navigate("/")} className="">
      <img src={Applogo} alt="logo" className="lg:w-[200px] md:object-scale-down" />
    </div>
    <div>
      <input
        type="text"
        placeholder="Search"
        className="border rounded-full text-center h-[40px] lg:w-[900px] md:w-[200px]"
      />
    </div>
    
    <div className="flex gap-4 items-center">
      {localStorage.getItem("token") ? (
        <AiOutlineShoppingCart
        onClick={() => Navigate("/user/cart")}
        className="text-2xl text-white"
      />
      ) : (
        <AiOutlineShoppingCart
        onClick={() => toast("Please login to continue")}
        className="text-2xl text-white"
      />
      )}
      {localStorage.getItem("token") ? (
        <>
        <div className="flex gap-4 text-white">
        <button
          onClick={() => {
            Navigate("/user/dashboard");
          }}
          className="bg-[#db2b39] flex items-center justify-center gap-4 rounded-full w-[150px] h-[40px] p-2 text-white"
        >
          <MdSpaceDashboard className="text-lg" />
          Dashboard
        </button>
        <button className="flex gap-4 items-center justify-center" onClick={onLogout}>logout <MdLogout className="text-lg"/></button>
        </div>
        </>
        
      ) : (
        <>
        <button
          onClick={() => {
            Navigate("/user/login");
          }}
          className="bg-[#db2b39] flex items-center justify-center gap-4 rounded-full w-[100px] h-[40px] p-3 text-white"
        >
          
          Login
          <MdLogin className="text-lg" />
        </button>
        </>
        
      )}
    </div>
  </div>
    )
}