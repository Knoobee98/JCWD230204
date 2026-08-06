import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import api from '../../utils/api';

function Shop() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    product_name: '',
    product_desc: '',
    product_category: '',
    product_price: '',
    product_stock: '',
    branch_id: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/admin/getProducts');
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/createProduct', {
        product_name: form.product_name,
        product_desc: form.product_desc,
        product_category: form.product_category,
        product_price: form.product_price,
        product_stock: form.product_stock,
        branch_id: form.branch_id,
      });
      toast.success('Product created');
      setForm({ product_name: '', product_desc: '', product_category: '', product_price: '', product_stock: '', branch_id: '' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.post('/api/admin/deleteProduct', { product_id: productId });
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="mb-5">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Product Management</h1>
            </div>

            {/* Create product form */}
            <div className="mb-8 bg-white border border-slate-200 rounded-sm shadow-sm p-6">
              <h2 className="text-lg text-slate-800 font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleCreate} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
                  <input name="product_name" value={form.product_name} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                  <input name="product_category" value={form.product_category} onChange={handleChange} className="form-input w-full" placeholder="e.g. PlayStation 5" required />
                </div>
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                  <textarea name="product_desc" value={form.product_desc} onChange={handleChange} className="form-textarea w-full" rows="2" required />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Price</label>
                  <input name="product_price" type="number" value={form.product_price} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Stock</label>
                  <input name="product_stock" type="number" value={form.product_stock} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Branch ID</label>
                  <input name="branch_id" type="number" value={form.branch_id} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12">
                  <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Create Product</button>
                </div>
              </form>
            </div>

            {/* Product list */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Product</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Category</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">Price</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">Total Stock</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">Actions</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 border-b border-slate-200">
                    {loading ? (
                      <tr><td colSpan="5" className="px-2 py-8 text-center text-slate-400">Loading products...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan="5" className="px-2 py-8 text-center text-slate-400">No products found</td></tr>
                    ) : products.map((product) => {
                      const totalStock = Array.isArray(product.branch_products)
                        ? product.branch_products.reduce((sum, bp) => sum + (Number(bp.stock) || 0), 0)
                        : 0;
                      return (
                        <tr key={product.id}>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.products_images && product.products_images[0] && (
                                <img
                                  className="w-10 h-10 rounded object-cover mr-3"
                                  src={`${process.env.REACT_APP_API_BASE_URL}/Public/${product.products_images[0].url}`}
                                  alt={product.products_name}
                                />
                              )}
                              <div className="font-medium text-slate-800">{product.products_name}</div>
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="text-slate-600">{product.category?.category || '-'}</div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="text-right font-medium text-slate-700">
                              {product.products_details && product.products_details[0]
                                ? `Rp.${Number(product.products_details[0].price).toLocaleString('id-ID')}`
                                : '-'}
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="text-right text-slate-700">{totalStock}</div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="text-right">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-xs font-medium text-rose-600 hover:text-rose-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Shop;
