import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

function HistoryTable({
  selectedItems
}) {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/admin/getBranchProducts');
        const data = response.data.data || [];
        setProducts(data);
        if (data.length) {
          setSelectedProduct(String(data[0].id));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load products');
      }
    };
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async (productId) => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/getStockHistory?product_id=${productId}`);
      setList(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(selectedProduct);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID');
  };

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-800">Stock History <span className="text-slate-400 font-medium">{list.length}</span></h2>
        <select
          className="form-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {products.length === 0 && <option value="">No products</option>}
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.products_name}</option>
          ))}
        </select>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full divide-y divide-slate-200">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-t border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Event</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Qty Changed</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-right">Remaining</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="4" className="px-2 py-8 text-center text-slate-400">Loading history...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan="4" className="px-2 py-8 text-center text-slate-400">No history found for this product</td></tr>
              ) : list.map((item) => (
                <tr key={item.id}>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <span className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-slate-100 text-slate-600">
                      {item.event_type}
                    </span>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div>{formatDate(item.event_date)}</div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="text-center font-medium">{item.quantity_changed}</div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="text-right font-medium text-slate-700">{item.remaining_quantity}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable;
