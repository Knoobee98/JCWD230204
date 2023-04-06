import { useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
<<<<<<< HEAD
import NavBar from '../../components/navbaruser';
import HomeMenu from "../../components/homemenu";
import Footer from '../../components/footer';
=======
import NavbarUser from "../../components/navbaruser";
import HomeMenu from "../../components/homemenu";
import Footer from "../../components/footer";

// import imgprod from './../assets/img/assets_products/ps4.jpg'
// import BannerVertical from './../assets/img/banner-vert-1.png'

>>>>>>> main

export default function ProductPage(){
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [filter, setFilter] = useState('productsName')
    const [sort, setSort] = useState('name')
    const [sortType, setSortType] = useState('asc')
    
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)

    const search = useRef()

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
    const totalPage = Math.ceil(products.length / itemsPerPage)
    const paginate = (pageNumber) => setPage(pageNumber)

    const Navigate = useNavigate()

    let getProducts = async() => {
        try {
            const url = process.env.REACT_APP_API_GET_PRODUCTS_PAGE.replace(':page', page).replace(':sort', sort).replace(':sortType', sortType).replace(':filter', filter)
            const response = await axios.get(url)
            setProducts(response.data.data)
            
        } catch (error) {
            console.log(error)
        }
    }

    let getCategory = async() => {
        try{
            const response = await axios.get(process.env.REACT_APP_API_GET_CATEGORY)
            setCategory(response.data.data)
        } catch(error){
            console.log(error.message)
        }
    }

    useEffect(() => {
        getProducts()
        getCategory()
        handleSort()
    }, [ sort, sortType])

    const handleFilter = async() => {
        const inputSearch = search.current.value;
        console.log(filter, inputSearch)
        try{
            const url = process.env.REACT_APP_API_PRODUCTS_FILTER.replace(':filter', filter).replace(':inputSearch', inputSearch)
            const response = await axios.get(url);
            console.log(response.data.data)
            setProducts(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleSort = async () => {
        try {
            const url = process.env.REACT_APP_API_PRODUCTS_SORT.replace(':sort', sort).replace(':sortType', sortType)
            const response = await axios.get(url);
            console.log(response.data.data)
            setProducts(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    return(
        <>
<<<<<<< HEAD
        <div className='bg-[#1c1c1c]'>
            <NavBar />
            <HomeMenu />
        </div>
=======
        <NavbarUser/>
        <HomeMenu/>
>>>>>>> main
        <div className="flex gap-4 bg-[#1c1c1c] py-4">
            {/* sidebar nav */}
            <div className="w-[300px] p-4 flex flex-col gap-4 text-white ">
                <div>
                    <h1 className="text-xl font-bold ">Category</h1>
                    <ul>
                        {
                            category.map((cat, index) => {
                                return(
                                    <li key={index}>{cat.category}</li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className='flex flex-col gap-4'>
                    <div>
                        <h1 className='text-xl font-bold'>Sort by</h1>
                    </div>
                    <div className='flex flex-col align-center gap-4 text-black'>
                        <select value={sort} onChange={(event) => setSort(event.target.value)}>
                            <option value={'options'}>options</option>
                            <option value={'name'}>Name</option>
                            <option value={'price'}>Price</option>
                        </select>
                    </div>
                    <div className='flex flex-col align-center gap-4 text-black'>
                        <select value={sortType} onChange={(event) => setSortType(event.target.value)}>
                            <option value={'asc'}>ascending</option>
                            <option value={'desc'}>descending</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div>
                        <h1 className='text-xl font-bold'>Filter By</h1>
                    </div>
                    <div className='flex flex-col gap-3 text-black'>
                        <input type='text' ref={search} placeholder='filter...' className='rounded-lg h-[30px] pl-3'/>
                        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                            <option value={'ProductsName'}>Product Name</option>
                            <option value={'category'}>Category</option>
                        </select>
                        <button onClick={handleFilter} className="text-white">filter</button>
                    </div>
                </div>
                
            </div>
            {/* main content */}
            <div className=" w-[1000px] p-5 flex flex-col gap-4 mb-4 bg-[#6d6d6d] rounded-lg">
                <div>
                    <h1 className="text-xl text-white font-bold">Products</h1>
                </div>
                <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-3 relative z-0">
                   {
                        currentItems.length ? currentItems.map((product) => {
                            console.log(product)
                            return(
                                <div key={product.id} onClick={() => Navigate(`/user/Details/${product.id}`)}>
                                    
                                    <div className="h-[350px] w-[200px] flex flex-col gap-3 border rounded-lg drop-shadow-lg">
                                        <div className="bg-slate-300 rounded-t-lg">
                                            <img key={product.id} src={`${process.env.REACT_APP_API_BASE_URL}/Public/products/${product.products_images[0].url}`} alt="" className="h-[200px] w-[200px] object-cover rounded-t-lg"/>
                                        </div>
                                        <div className="flex flex-col gap-4 justify-around text-white px-2">
                                            <h2 className="text-sm " key={product.id}>{product.products_name}</h2>
                                            {
                                                product.products_details.map((product, index) => {
                                                    return(
                                                        <h2 className="text-sm" key={index}>Rp.{parseInt(product.price).toLocaleString()}</h2>
                                                    )
                                                 })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <h1>loading...</h1>
                    }
                </div>
                {/* pagination */}
                <div>
                    <div className="flex gap-4 p-2 border bg-slate-200 rounded-md">
                        {
                            Array.from({length: totalPage}, (_, index) => index + 1).map((page) => {
                                return(
                                    <button key={page} className="" onClick={() => paginate(page)}>{page}</button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>  
        </div>
<<<<<<< HEAD
        <Footer />
=======
        <Footer/>
>>>>>>> main
        </>
    )
}