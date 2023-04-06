import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

import ConfirmationModal from '../../components/confirmationModal';
import NavBar from '../../components/navbaruser';
import HomeMenu from "../../components/homemenu";
import Footer from '../../components/footer';

export default function CheckoutPage(){
    const [city, setCity] = useState([])
    const [state, setState] = useState([])
    const [province, setProvince] = useState([])
    const [destination, setDestination] = useState([])
    const [service, setService] = useState([])
    const [courier, setCourier] = useState([])
    const [ongkir, setOngkir] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const { id } = useParams()

    const inputAddress = useRef('')
    const inputZip = useRef('')
    const inputCountry = useRef('')

    const Navigate = useNavigate()

    const getCart = async() => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_GET_CART)
            console.log(response.data.data)
            setSubtotal(response.data.totalBeforeDiscount)
            console.log(subtotal)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const PlaceOrder = async() => {
        const token = localStorage.getItem('token')
        try{
            const response = await axios.post(process.env.REACT_APP_API_PLACE_ORDER, {
                cartItem: id,
                address: inputAddress.current.value,
                city: destination,
                state: province,
                zip: inputZip.current.value,
                country: inputCountry.current.value,
                shipping: courier,
                total: total,
                latitude: latitude,
                longitude: longitude
            }, {
                headers: {token}
            })
            console.log(response.data.data)
            toast("Order Placed")
            Navigate(`/user/uploadPayment/${response.data.data.id}`)
        }
        catch(error){
            console.log(error.message)
        }

    }

    const getCity = async() => {
        try {
            const response =await axios.get(process.env.REACT_APP_API_RAJAONGKIR_CITY)
            console.log(response.data.data)
            setCity(response.data.data)

        } catch (error) {
            console.log(error.message)
        }
    }

    const getProvince = async() => {
        try {
            const response =await axios.get(process.env.REACT_APP_API_RAJAONGKIR_STATE)
            console.log(response.data.data)
            setState(response.data.data)

        } catch (error) {
            console.log(error.message)

        }
    }

    const getOngkir = async() => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_RAJAONGKIR_COST, {
                origin: 501,
                destination: destination,
                weight: 1700,
                courier: courier
            })
            console.log(response.data.data[0].costs)
            setService(response.data.data[0].costs)
            
        } catch (error) {
            console.log(error.message)
        }

    }

    const getLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude)
                setLongitude(position.coords.longitude)
                console.log(latitude)
                console.log(longitude)
            })
        }else{
            alert('Geolocation is not supported by this browser')
        }
    }

    useEffect(() => {
        getCart()
        getCity()
        getProvince()
        getLocation()
    }, [latitude, longitude])

    const handleDestinationChange = (event) => {
        setDestination(event.target.value)
       
    }

    const handleCourierChange = (event) => {
        setCourier(event.target.value)
       
    }

    const handleServicesChange = (event) => {
        setOngkir(event.target.value)

    }

    const handleProvinceChange = (event) => {
        setProvince(event.target.value)
    }

    return(
        <>
<<<<<<< HEAD
        <div className='bg-[#1c1c1c]'>
          <NavBar />
          <HomeMenu />
        </div>
        <div className="flex justify-center bg-[#1c1c1c] p-4">
=======
        <NavbarUser/>
        <HomeMenu/>
        {ongkir}
        <div className="flex justify-center bg-[#261C2C] p-4">
>>>>>>> main
            <div className="flex gap-10 justify-center p-5 bg-white w-[1200px] m-12 rounded-lg">
                <div className="flex flex-col gap-4">
                    <h1>Shipping</h1>
                    <input ref={inputAddress} type='text' placeholder='address'/>
                    {/* show city and select destination */}
                    <select onChange={handleDestinationChange}>
                        <option value=''>Select City</option>
                        {
                            city.map((value, index) => {
                                return(
                                    <option key={index} value={value.city_id}>{value.city_name}</option>
                                )
                            })
                        }
                    </select>
                    {/* show state and select state */}
                    <select onChange={handleProvinceChange}>
                        <option value=''>Select State/province</option>
                        {
                            state.map((value, index) => {
                                return(
                                    <option key={index} value={value.province_id}>{value.province}</option>
                                )
                            })
                        }
                    </select>
                    <input ref={inputZip} type='text' placeholder='zip code'/>
                    <input ref={inputCountry} type='text' placeholder='country'/>
                    {/* show courier and select courier */}
                    <select onChange={handleCourierChange}>
                        <option value=''>Select Shipping Method</option>
                        <option value='jne'>JNE</option>
                        <option value='pos'>POS Indonesia</option>
                        <option value='tiki'>TIKI</option>
                    </select>
                    {/* show service and select service */}
                    <select onChange={handleServicesChange}>
                        <option value=''>Select Service</option>
                        {
                            service.map((value, index) => {
                                return(
                                    <option key={index} value={value.cost[0].value}>{value.service}  Rp.{value.cost[0].value.toLocaleString()}</option>
                                )
                            })
                        }
                    </select>
                    <button onClick={getOngkir} className="p-5 bg-green-300 rounded-lg">Get Ongkir</button>
                </div>
                <div className='flex flex-col gap-4'>
                    <h1>Payment</h1>
                    <p>Bank Mandiri a/n Fauzan 4000388388747475849</p>
                    <p>Bank BCA a/n Putri 299300039940934343</p>
                </div>
                <div className='flex flex-col gap-4'>
                    <h1>Order Summary</h1>
                    <p>Subtotal : Rp.{parseInt(subtotal).toLocaleString()}</p>
                    <p>Shipping : Rp.{parseInt(ongkir).toLocaleString()}</p>
                    <p>Total    : Rp.{parseInt(total).toLocaleString()}</p>
                    <button onClick={() => {setShowConfirmationModal(true)}} className="p-5 bg-green-300 rounded-lg">Checkout</button>
                </div>
            </div>
            {showConfirmationModal && (
                <ConfirmationModal
                message="are you sure you want to perform this transaction?"
                onConfirm={() => {
                    PlaceOrder()
                    setShowConfirmationModal(false)
                }}
                onCancel={() => {
                    setShowConfirmationModal(false)
                    setTimeout(() => {
                        Navigate('/user/cart')
                    }, 1000)
                    
                }}
                />
            )
            }
            <Toaster/>
        </div>
<<<<<<< HEAD
        <Footer />
=======
        <Footer/>
>>>>>>> main
        </>
    )
}