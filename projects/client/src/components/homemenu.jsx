import { useNavigate } from "react-router-dom";

export default function HomeMenu(){
    const Navigate = useNavigate();

  let onProducts = () => {
    Navigate("/user/products");
  };

  const onHome = () => {
    Navigate("/");
  };

    return(
        <div>
        <ul className="flex gap-5 items-center pl-5 bg-[#6d6d6d] h-[50px]">
          <li className="hover:border-b-2 text-white" onClick={onHome}>
            Home
          </li>
          <li className="hover:border-b-2 text-white">Delivery</li>
          <li className="hover:border-b-2 text-white" onClick={onProducts}>
            All Products
          </li>
        </ul>
      </div>
    )
}