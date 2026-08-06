import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

function StocksTable({
  selectedItems
}) {

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const response = await api.get('/api/admin/getBranchProducts');
      setList(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(list.map(li => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  const totalStock = (product) => {
    if (!Array.isArray(product.branch_products)) return 0;
    return product.branch_products.reduce((sum, bp) => sum + (Number(bp.stock) || 0), 0);
  };

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">Product Stocks <span className="text-slate-400 font-medium">{list.length}</span></h2>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full divide-y divide-slate-200">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-t border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input className="form-checkbox" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Product</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Price</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Per-Branch Stock</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-right">Total</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="5" className="px-2 py-8 text-center text-slate-400">Loading stocks...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan="5" className="px-2 py-8 text-center text-slate-400">No products found</td></tr>
              ) : list.map((product) => (
                <tr key={product.id}>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                    <div className="flex items-center">
                      <label className="inline-flex">
                        <span className="sr-only">Select</span>
                        <input id={product.id} className="form-checkbox" type="checkbox" onChange={handleClick} checked={isCheck.includes(product.id)} />
                      </label>
                    </div>
                  </td>
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
                    <div>
                      {product.products_details && product.products_details[0]
                        ? `Rp.${Number(product.products_details[0].price).toLocaleString('id-ID')}`
                        : '-'}
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      {Array.isArray(product.branch_products) && product.branch_products.length
                        ? product.branch_products.map((bp, index) => (
                            <span key={index} className="inline-flex text-xs font-medium rounded-full px-2.5 py-1 bg-slate-100 text-slate-600">
                              {bp.stock}
                            </span>
                          ))
                        : '-'}
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="text-right font-medium text-slate-700">{totalStock(product)}</div>
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

export default StocksTable;
