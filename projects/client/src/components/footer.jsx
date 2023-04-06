
import { useNavigate } from "react-router-dom";
import { toast} from "react-hot-toast";

export default function Footer(){
    const Navigate = useNavigate();

  let onProducts = () => {
    Navigate("/products");
  };

  const onHome = () => {
    Navigate("/");
  };

  const onLogout = () => {
    localStorage.removeItem("token")
    toast("Logged out successfully")
    setTimeout(() => {
      window.location.reload()
    },1000)
  }
    return(
        <div className="h-[300px] bg-[#1c1c1c] flex flex-col p-5">
        <div className=" flex justify-around p-5 border-b-2 border-white">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Gamepedia</h1>
            <p className="text-lg">One stop service for all gaming stuff</p>
          </div>
          <div className="flex flex-col gap-3 text-white">
            <div>
              <p className="text-lg">Quick Menu</p>
              <ul className="text-md">
                <li onClick={onProducts}>Categories</li>
                <li>Delivery</li>
                <li>Accounts</li>
              </ul>
            </div>
            <div>
              <p className="text-lg">Categories</p>
              <ul className="text-md">
                <li>Consoles</li>
                <li>Games</li>
                <li>Accesories</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-white">
            <div>
              <p className="text-lg">Pages</p>
              <ul className="text-md">
                <li>Term and Condition</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <p className="text-lg">Contact</p>
              <ul className="text-md">
                <li>Email: Support@gamepedia.com</li>
                <li>Whatsapp</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-[100px] flex justify-center items-center text-white">
          <h1>© 𝟤𝟢𝟤𝟥 Gamepedia. 𝘈𝘭𝘭 𝘙𝘪𝘨𝘩𝘵 𝘙𝘦𝘴𝘦𝘳𝘷𝘦𝘥</h1>
        </div>
      </div>
    )
}