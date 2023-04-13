import axios from 'axios'
import {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import NavBar from '../../components/navbaruser';
import HomeMenu from "../../components/homemenu";
import Footer from '../../components/footer';

export default function ProductDetails(){
    const [category, setCategory] = useState([])
    const [product, setProduct] = useState([])
    const [quantity, setQuantity] = useState(1)

    const {id} = useParams()

    const getProducts = async() => {
        try {
            const url = process.env.REACT_APP_API_GET_PRODUCTS_DETAIL.replace(":id", id)
            const response = await axios.get(url)
            console.log(response.data.data)
            setProduct(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getCategory = async() => {
        try{
            const response = await axios.get(process.env.REACT_APP_API_GET_CATEGORY)
            setCategory(response.data.data)
        } catch(error){
            console.log(error.message)
        }
    }

    const countPlusHandler = () => {
        setQuantity(quantity + 1)
    }

    const countMinHandler = () => {
        if(quantity > 1){
            setQuantity(quantity - 1)
        }
    }

    const addToCartHandler = async() => {
        try {
            console.log(quantity)
            const token = localStorage.getItem("token")
            const url = process.env.REACT_APP_API_ADD_TO_CART.replace(":id", id).replace(":quantity", parseInt(quantity));
            const response = await axios.get(url, {
                headers: { token }
            })
            // console.log(response.data)
            toast.success(response.response.data.message)
        } catch (response) {
            // console.log(response.data.message)
            // console.log(response.response.data.message)
            toast.error(response.response.data.message)
        }
        
        
    }

    useEffect(() => {
        getProducts()
        getCategory()
    },[])

    return(
        <>
        <div className='bg-[#1c1c1c]'>
            <NavBar />
            <HomeMenu />
        </div>
        <div className="flex justify-center gap-4 py-4 bg-[#1c1c1c]">
        
            {/* products details */}
            <div className="bg-[#6d6d6d] rounded-lg w-[1000px]">
                <div className='flex justify-around h-[700px]'>
                    <div className=' flex flex-col justify-center items-center w-[400px]'>
                        <div><img src={`${process.env.REACT_APP_API_BASE_URL}/Public/products/${product[0] ? product[0].products_images[0].url : null}`} alt="" className='rounded-lg'/></div>
                    </div>
                    <div className=' flex flex-col justify-center items-center gap-4 w-[400px] p-4 text-[#cfcfcf]'>
                        <div>
                            {/* {console.log(product[0].products_images[0].url)} */}
                            <h1 className='text-xl font-bold'>{product[0] ? product[0].products_name : null}</h1>
                            <p className='text-md'>{product[0] ? product[0].products_details[0].desc : null}</p>
                        </div>
                        <div>
                            <h1 className='text-xl font-bold'>Rp. {product[0] ? parseInt(product[0].products_details[0].price).toLocaleString() : null}</h1>
                        </div>
                        <div className='border p-2 flex bg-slate-200 gap-4 rounded-full text-black'>
                            <button onClick={countMinHandler}>-</button>
                            <div>{quantity}</div>
                            <button onClick={countPlusHandler}>+</button>
                        </div>
                        <div>
                            {localStorage.getItem("token") ? <button onClick={addToCartHandler} className='bg-[#db2b39] p-3 rounded-full text-white'>Add to cart</button> : <Link to='/login'><button className='bg-[#443C68] p-3 rounded-full text-white'>Add to cart</button></Link>}
                            {/* <button onClick={ addToCartHandler} className='bg-[#443C68] p-3 rounded-full text-white'>Add to Cart</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}