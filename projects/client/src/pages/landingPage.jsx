import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Banner from '../assets/img/banner2.jpg';

export default function LandingPage(){
    const [products, setProducts] = useState([]);
    const [promo, setPromo] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const Navigate = useNavigate()

    let getProducts = async() => {
        let response = await axios.get(`http://localhost:8000/products/get`);
        console.log(response.data.data);
        setProducts(response.data.data);
    }

    let getPromo = async() => {
        let response = await axios.get('http://localhost:8000/products/getPromo');
        console.log(response.data.data);
        setPromo(response.data.data);
    }

    let getRecommended = async() => {
        let response = await axios.get('http://localhost:5000/recomendedProducts/');
        console.log(response.data);
        setRecommended(response.data);
    }

    let getNewProducts = async() => {
        let response = await axios.get('http://localhost:8000/products/getNewProduct/');
        console.log(response.data.data);
        setNewProducts(response.data.data);
    }

    useEffect(() => {
        getProducts();
        getPromo();
        getRecommended();
        getNewProducts();
    }, [])

    return(
        <>
        <div className='flex flex-col justify-center gap-3 px-6 pb-4 pt-4 bg-[#1c1c1c]'>
            {/* banner */}
            <div className="h-[400px] flex justify-center px-7">
                <img src={Banner} alt="" className="h-[400px] object-scale-down"/>
            </div>
            
            {/* new products */}
            <div className="p-5 mx-20 flex flex-col gap-4 text-white rounded-lg ">
                <h1 className="text-xl font-bold">What's New</h1>
                <div className="grid xl:grid-cols-6 md:grid-cols-3 gap-4">
                    {
                        newProducts.length ?
                        newProducts.map((value,index) => {
                            return(
                                <>
                                <div key={value.id} onClick={() => Navigate(`/Details/${value.id}`)}>
                                <div className="h-[350px] w-[200px] flex flex-col gap-3 border rounded-lg drop-shadow-lg">
                                    <div className="bg-slate-300 rounded-t-lg">
                                        <img src="https://images.unsplash.com/photo-1626121496372-8e1b2e1b2b1f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" className="h-[250px] w-[200px] rounded-t-lg"/>
                                    </div>
                                    <div className="flex gap-4 justify-center px-2">
                                        <h2 className="text-sm " key={index}>{value.products_name}</h2>
                                    </div>
                                </div>
                                </div>
                                
                                </>
                            )
                        }) : <h1>No Product Found!</h1>
                    }
                    {/* cards */}
                    
                    
                </div>
            </div>
            {/* promo */}
            <div className="p-5 mx-20 flex flex-col gap-4 text-white rounded-lg ">
                <h1 className="text-xl font-bold ">Promo</h1>
                <div className="grid xl:grid-cols-6 md:grid-cols-3 gap-4">
                    {
                        promo.length ?
                        promo.map((value, index) => {
                            return(
                                <>
                                <div className="h-[350px] w-[200px] flex flex-col gap-3 border rounded-lg drop-shadow-lg">
                                    <div className="bg-slate-300 rounded-t-lg">
                                        <img src="https://images.unsplash.com/photo-1626121496372-8e1b2e1b2b1f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" className="h-[200px] w-[200px] rounded-t-lg"/>
                                    </div>
                                    <div className="flex gap-4 justify-around px-2">
                                        <h2 className="text-sm " key={index}>{value.discount_name}</h2>
                                        {/* <h2 className="text-sm" key={index}>Rp.{}</h2> */}
                                    </div>
                                    <div className="flex justify-center" key={index}>
                                        {/* {value.store_location} */}
                                    </div>
                                </div>
                                </>
                            )
                        }) : <h1>promo not found</h1>
                    }
                    {/* cards */}
                    
                    
                </div>
            </div>
            {/* all products */}
            <div className=" rounded-lg p-5 mx-20 text-white flex flex-col gap-4">
                <h1 className="text-xl font-bold">All Products</h1>
                    <div className="grid xl:grid-cols-6 md:grid-cols-3 gap-4">
                            {
                                products.length ? products.map((value, index) => {
                                    return(
                                        <>
                                        <div key={value.id} onClick={() => Navigate(`/Details/${value.id}`)}>
                                        <div className="h-[350px] w-[200px] flex flex-col gap-3 border rounded-lg drop-shadow-lg">
                                            <div className="bg-slate-300 rounded-t-lg">
                                                <img src={value.products_image} alt="" className="h-[250px] w-[200px] rounded-t-lg"/>
                                            </div>
                                            <div className="flex  justify-center px-2">
                                                <h2 className="text-sm " key={index}>{value.products_name}</h2>
                                            </div>
                                        </div>
                                        </div>
                                        </>
                                    )
                                }) : <h1>No Product Found!</h1>
                            }
                    </div>
            </div>
        </div>
        </>
    )
}