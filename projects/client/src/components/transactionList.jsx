import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';


export default function TransactionList() {

    const [transactionList, setTransactionList] = useState([])
    const [sortBy, setSortBy] = useState('date')
    const [sortType, setSortType] = useState('asc')
    const [filterBy, setFilterBy] = useState('date')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // const [search, setSearch] = useState('')

    const Navigate = useNavigate()
    const search = useRef()

    const getTransactionList = async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transaction/get?sortBy=${sortBy}sortType=${sortType}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            console.log(response.data.data)
            setTransactionList(response.data.data)
            //paginations
            
        } catch (error) {
            console.log(error.message)
        }
        
    }

    const uploadPaymentHandler = async(id) => {
        try {
            Navigate(`/user/uploadPayment/${id}`)
        } catch (error) {
            console.log(error.message)
        }
    }

    const confirmOrder = async(id) => {
        try {
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transaction/confirmOrder?id=${id}`, {}, {
                headers: {token: localStorage.getItem('token')}
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    

    useEffect(() => {
        getTransactionList()
        sortByHandler()
    },[sortBy, sortType])

    const sortByHandler = async(e) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transaction/get?sortBy=${sortBy}&sortType=${sortType}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            setTransactionList(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const filterHandler = async() => {
        const searchInput = search.current.value
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transaction/get?filterBy=${filterBy}&search=${searchInput}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            setTransactionList(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const filterHandlerByDate = async() => {
        try {
            console.log(startDate, endDate)
            moment(startDate).format('YYYY-MM-DD')
            moment(endDate).format('YYYY-MM-DD')
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transaction/get?filterBy=${filterBy}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            setTransactionList(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    return(
        <>
        {console.log(startDate, endDate)}
        <div className='flex flex-col gap-5'>
            <h1>Transaction List</h1>
            <div className='flex gap-2'>
                <div>Sort By:</div>
                <div>
                    <select onChange={(e) => {setSortBy(e.target.value)}}>
                        <option value="date">Date</option>
                        <option value="invoice No.">Status</option>
                    </select>
                </div>
                <div>
                    <select onChange={(e) => {setSortType(e.target.value)}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className='flex gap-4'>
                    <div>Filter By:</div>
                    <div>
                        <select onChange={(e) => {setFilterBy(e.target.value)}}>
                            <option value="date">Date</option>
                            <option value="invoice">Invoice</option>
                            <option value="orderStatus">Order Status</option>
                        </select>
                    </div>
                    {
                        filterBy === 'date' ? (
                            <>
                            <div>
                            <input type="date" onChange={(e) => {setStartDate(e.target.value)}} value={startDate} />
                            </div>
                            <div>
                            <input type="date" onChange={(e) => {setEndDate(e.target.value)}} value={endDate}/>
                            </div>
                            <div>
                                <button onClick={() => filterHandlerByDate()}>Search</button>
                            </div>
                            </>
                        
                        ) : (
                            <>
                            <div>
                                <input ref={search} type="text" placeholder='search'/>
                            </div>
                            <div>
                                <button onClick={() => filterHandler()}>Search</button>
                            </div>
                            </>
                        )
                        
                    }
                </div>
            </div>
            
            
            <table className='border-collapse border table-auto border-slate-200'>
                <thead className='border border-slate-100 bg-slate-100 p-4'>
                    <tr>
                        <td>Transaction Id</td>
                        <td>Transaction Date</td>
                        <td>status</td>
                        
                    </tr>
                </thead>
                <tbody className='border border-slate-100 p-4'>
                    {
                        transactionList.map((transaction, index) => {
                            return(
                                <tr>
                                    <td key={index}>{transaction.id}</td>
                                    <td key={index}>{transaction.date.slice(0, 10)}</td>
                                    {
                                        transaction.transactions_status.status_name === "Waiting for Payment" ?
                                        (<td className='flex gap-4' key={index}>{transaction.transactions_status.status_name} <button onClick={() => uploadPaymentHandler(transaction.id)}>upload Payment</button> </td>) :
                                        transaction.transactions_status.status_name === "Delivery" ? 
                                        (<td className='flex gap-4' key={index}>{transaction.transactions_status.status_name} <button onClick={() => confirmOrder}>Confirm Order</button> </td>) :
                                        (<td>{transaction.transactions_status.status_name}</td>)
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <div className='flex gap-4 justify-center items-center border rounded-xl p-4 m-2'>
                <h1>Transaction Detail No. 11223456739382</h1>
                <div>
                    <div>product name</div>
                    <div>product price</div>
                    <div>product quantity</div>
                </div>
            </div>
        </div>
        </>
    )
}