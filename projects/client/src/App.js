import { Routes, Route, useNavigate, useLocation} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../src/css/App.css";
import React, { useEffect } from 'react';
import './css/style.css';
import './charts/ChartjsConfig.jsx';


// userside
import LandingPage from "./pages/user/landingPage";
import Register from "./pages/user/register";
import Activation from "./pages/user/activation";
import Login from "./pages/user/login";
import Profiling from "./pages/user/profiling";
import EditProfile from "./pages/user/editProfile";
import EditProfileForm from "./pages/user/editProfile";
import ResetPassword from "./pages/user/resetPassword";
import ForgotPassword from "./pages/user/forgotPassword";
import ChangePassword from "./pages/user/changePassword";
import ProductsPage from "./pages/user/productsPage";
import ProductsDetails from "./pages/user/productDetails";
import Cart from "./pages/user/cartPage";
import ShippingPage from "./pages/user/shippingPage";
import UploadPayment from "./pages/user/uploadPayment";
import DashboardUsers from "./pages/user/dashboardUser";

// adminside
import LoginAdmin from "./pages/admin/loginadmin";
import Dashboard from "./pages/admin/dashboard";
import BranchDashboard from "./pages/admin/branchDashboard";
import AdminManagement from "./pages/admin/adminList"
import CreateAdmin from "./pages/admin/createadmin"
import ProductStocks from "./pages/admin/productStocks";
import ProductList from "./pages/admin/productList"
import ProductHistory from "./pages/admin/productHistory"
import SalesReport from "./pages/admin/salesReport";
import Transactions from "./pages/admin/transactions"
import CustomerTransactions from "./pages/admin/customers"
import OrderTransactions from "./pages/admin/orders"
import InvoicesTransactions from "./pages/admin/invoices"
// static 404
import NotFound from "./pages/notfound";


export default function App() {
  const location = useLocation();

useEffect(() => {
  document.querySelector('html').style.scrollBehavior = 'auto'
  window.scroll({ top: 0 })
  document.querySelector('html').style.scrollBehavior = ''
}, [location.pathname]); // triggered on route change

  return (
    <div className="App">

      <Routes>
        {/* userside */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/editProfile" element={<EditProfile />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/activation/:id" element={<Activation />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/Profile" element={<Profiling />} />
        <Route path="/user/editProfile" element={<EditProfile />} />
        <Route path="/user/EditProfile" element={<EditProfileForm />} />
        <Route path="/user/resetPassword/:id" element={<ResetPassword />} />
        <Route path="/user/forgotPassword" element={<ForgotPassword />} />
        <Route path="/user/changePassword" element={<ChangePassword />} />
        <Route path="/user/dashboard" element={<DashboardUsers />} />
        <Route path="/user/Products" element={<ProductsPage />} />
        <Route path="/user/Details/:id" element={<ProductsDetails />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/shipping" element={<ShippingPage />} />
        <Route path="/user/uploadPayment/:id" element={<UploadPayment />} />
        
        {/* adminside */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/branch/dashboard" element={<BranchDashboard/>} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/newadmin" element={<CreateAdmin/>}/>
        <Route path="/admin/manager" element={<AdminManagement/>}/>
        <Route path="/admin/productStock" element={<ProductStocks/>}/>
        <Route path="/admin/productList" element={<ProductList/>}/>
        <Route path="/admin/productHistory" element={<ProductHistory/>}/>
        <Route path="/admin/salesReport" element={<SalesReport/>}/>
        <Route path="/admin/transactions" element={<Transactions/>}/>
        <Route path="/admin/customers" element={<CustomerTransactions/>}/>
        <Route path="/admin/orders" element={<OrderTransactions/>}/>
        <Route path="/admin/invoices" element={<InvoicesTransactions/>}/>

        <Route path="/notFound" element={<NotFound />} />

      </Routes>
      <Toaster/>
    </div>
  );
}
