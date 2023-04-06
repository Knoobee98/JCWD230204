

// export default function AdminApp() {
//     const location = useLocation();

//   useEffect(() => {
//     document.querySelector('html').style.scrollBehavior = 'auto'
//     window.scroll({ top: 0 })
//     document.querySelector('html').style.scrollBehavior = ''
//   }, [location.pathname]); // triggered on route change

//   return (
//     <>
//         <Routes>
//             <Route path="/admin/dashboard" element={<Dashboard />} />
//             <Route path="/admin/login" element={<LoginAdmin />} />
//             <Route path="/admin/branchregister" element={<BranchRegister/>}/>
//             <Route path="/admin/manager" element={<AdminManagement/>}/>
//             <Route path="/admin/discount" element={<Discount/>}/>
//             <Route path="/admin/productStock" element={<ProductStocks/>}/>
//             <Route path="/admin/salesReport" element={<SalesReport/>}/>
//             <Route path="/admin/transactions" element={<Transactions/>}/>
//             <Route path="/admin/customers" element={<CustomerTransactions/>}/>
//             <Route path="/admin/orders" element={<OrderTransactions/>}/>
//             <Route path="/admin/invoices" element={<InvoicesTransactions/>}/>
//         </Routes>
//     </>
//   )
// }