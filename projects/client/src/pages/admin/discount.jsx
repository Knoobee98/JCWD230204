import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import api from '../../utils/api';

function Discount() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [form, setForm] = useState({
    discount_name: '',
    discount_type: 'percent',
    discount_value: '',
    days: '',
    product_id: [],
  });

  const fetchData = async () => {
    try {
      const [productsRes, discountsRes] = await Promise.all([
        api.get('/api/admin/getBranchProducts'),
        api.get('/api/admin/getDiscounts'),
      ]);
      setProducts(productsRes.data.data || []);
      setDiscounts(discountsRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (id) => {
    setForm((prev) => {
      const selected = prev.product_id.includes(id)
        ? prev.product_id.filter((pid) => pid !== id)
        : [...prev.product_id, id];
      return { ...prev, product_id: selected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.discount_name || !form.discount_value || !form.days || form.product_id.length === 0) {
      toast.error('All fields are required');
      return;
    }
    try {
      await api.post('/api/admin/createDiscount/me', form);
      toast.success('Discount created successfully');
      setForm({
        discount_name: '',
        discount_type: 'percent',
        discount_value: '',
        days: '',
        product_id: [],
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create discount');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Discounts ✨</h1>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">

              {/* Create discount form */}
              <div className="bg-white shadow-lg rounded-sm border border-slate-200">
                <header className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Create Discount</h2>
                </header>
                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Name</label>
                    <input
                      type="text"
                      name="discount_name"
                      value={form.discount_name}
                      onChange={handleChange}
                      className="form-input w-full"
                      placeholder="e.g. Weekend Sale"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select
                        name="discount_type"
                        value={form.discount_type}
                        onChange={handleChange}
                        className="form-select w-full"
                      >
                        <option value="percent">Percent</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                      <input
                        type="number"
                        min="0"
                        name="discount_value"
                        value={form.discount_value}
                        onChange={handleChange}
                        className="form-input w-full"
                        placeholder={form.discount_type === 'percent' ? 'e.g. 10' : 'e.g. 50000'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (days)</label>
                    <input
                      type="number"
                      min="1"
                      name="days"
                      value={form.days}
                      onChange={handleChange}
                      className="form-input w-full"
                      placeholder="e.g. 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Products</label>
                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-56 overflow-y-auto">
                      {products.length === 0 && (
                        <div className="px-4 py-3 text-sm text-slate-400">No products found</div>
                      )}
                      {products.map((product) => (
                        <label key={product.id} className="flex items-center px-4 py-2.5 text-sm hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={form.product_id.includes(product.id)}
                            onChange={() => handleProductToggle(product.id)}
                          />
                          <span className="ml-3 text-slate-700">{product.products_name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full">
                    Create Discount
                  </button>
                </form>
              </div>

              {/* Existing discounts */}
              <div className="bg-white shadow-lg rounded-sm border border-slate-200">
                <header className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Existing Discounts <span className="text-slate-400 font-medium">{discounts.length}</span></h2>
                </header>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full divide-y divide-slate-200">
                    <thead className="text-xs uppercase text-slate-500 bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Name</div></th>
                        <th className="px-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Value</div></th>
                        <th className="px-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Type</div></th>
                        <th className="px-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Expiry</div></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-200">
                      {discounts.length === 0 && (
                        <tr><td colSpan="4" className="px-5 py-8 text-center text-slate-400">No discounts yet</td></tr>
                      )}
                      {discounts.map((discount) => (
                        <tr key={discount.id}>
                          <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-800">{discount.name}</td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            {discount.type === 'percent' ? `${discount.voucher_value}%` : `Rp.${Number(discount.voucher_value).toLocaleString('id-ID')}`}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-indigo-100 text-indigo-600">
                              {discount.type}
                            </span>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-slate-600">{formatDate(discount.expiry_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Discount;
