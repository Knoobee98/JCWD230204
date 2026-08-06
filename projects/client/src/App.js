import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../src/css/App.css";
import React, { useEffect } from 'react';
import './css/style.css';
import './charts/ChartjsConfig.jsx';
import RequireAuth from "./components/RequireAuth";


// userside
import LandingPage from "./pages/user/landingPage";
import Register from "./pages/user/register";
import Activation from "./pages/user/activation";
import Login from "./pages/user/login";
import Profiling from "./pages/user/profiling";
import EditProfile from "./pages/user/editProfile";
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
import Discount from "./pages/admin/discount";
// static 404
import NotFound from "./pages/notfound";
// maintenance
import UnderMaintenance from "./pages/underMaintenance";


export default function App() {
  const location = useLocation();

useEffect(() => {
  document.querySelector('html').style.scrollBehavior = 'auto'
  window.scroll({ top: 0 })
  document.querySelector('html').style.scrollBehavior = ''
}, [location.pathname]); // triggered on route change

  return (
    <div className="App">

      {process.env.REACT_APP_MAINTENANCE === 'true' ? (
        <UnderMaintenance />
      ) : (
      <Routes>
        {/* userside */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/activation/:id" element={<Activation />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/resetPassword/:id" element={<ResetPassword />} />
        <Route path="/user/forgotPassword" element={<ForgotPassword />} />
        <Route path="/user/Products" element={<ProductsPage />} />
        <Route path="/user/Details/:id" element={<ProductsDetails />} />
        <Route path="/user/Profile" element={<RequireAuth><Profiling /></RequireAuth>} />
        <Route path="/user/editProfile" element={<RequireAuth><EditProfile /></RequireAuth>} />
        <Route path="/user/changePassword" element={<RequireAuth><ChangePassword /></RequireAuth>} />
        <Route path="/user/dashboard" element={<RequireAuth><DashboardUsers /></RequireAuth>} />
        <Route path="/user/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/user/shipping" element={<RequireAuth><ShippingPage /></RequireAuth>} />
        <Route path="/user/uploadPayment/:id" element={<RequireAuth><UploadPayment /></RequireAuth>} />

        {/* adminside */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<RequireAuth admin><Dashboard /></RequireAuth>} />
        <Route path="/admin/branch/dashboard" element={<RequireAuth admin><BranchDashboard /></RequireAuth>} />
        <Route path="/admin/newadmin" element={<RequireAuth admin><CreateAdmin /></RequireAuth>} />
        <Route path="/admin/manager" element={<RequireAuth admin><AdminManagement /></RequireAuth>} />
        <Route path="/admin/productStock" element={<RequireAuth admin><ProductStocks /></RequireAuth>} />
        <Route path="/admin/productList" element={<RequireAuth admin><ProductList /></RequireAuth>} />
        <Route path="/admin/productHistory" element={<RequireAuth admin><ProductHistory /></RequireAuth>} />
        <Route path="/admin/salesReport" element={<RequireAuth admin><SalesReport /></RequireAuth>} />
        <Route path="/admin/transactions" element={<RequireAuth admin><Transactions /></RequireAuth>} />
        <Route path="/admin/customers" element={<RequireAuth admin><CustomerTransactions /></RequireAuth>} />
        <Route path="/admin/orders" element={<RequireAuth admin><OrderTransactions /></RequireAuth>} />
        <Route path="/admin/invoices" element={<RequireAuth admin><InvoicesTransactions /></RequireAuth>} />
        <Route path="/admin/discount" element={<RequireAuth admin><Discount /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />

      </Routes>
      )}
      <Toaster/>
    </div>
  );
}
