import React, { useState, useEffect } from 'react';
import Invoices from './InvoicesTableItem';

function InvoicesTable({
  selectedItems
}) {

  const invoices = [
    {
      id: '0',
      invoice: '#123567',
      total: 'Rp.129.000',
      status: 'Overdue',
      customer: 'Dominik Lamakani',
      issueddate: '22/07/2021',
      paiddate: '-',
      type: 'Subscription',
    },
    {
      id: '1',
      invoice: '#779912',
      total: 'Rp.59.000',
      status: 'Paid',
      customer: 'Mark Cameron',
      issueddate: '19/07/2021',
      paiddate: '20/07/2021',
      type: 'Subscription',
    },
    {
      id: '2',
      invoice: '#889924',
      total: 'Rp.89.000',
      status: 'Paid',
      customer: 'Sergio Gonnelli',
      issueddate: '17/07/2021',
      paiddate: '19/07/2021',
      type: 'One-time',
    },
    {
      id: '3',
      invoice: '#897726',
      total: 'Rp.129.000',
      status: 'Due',
      customer: 'Manuel Garbaya',
      issueddate: '04/07/2021',
      paiddate: '-',
      type: 'Subscription',
    },
    {
      id: '4',
      invoice: '#123567',
      total: 'Rp.129.000',
      status: 'Due',
      customer: 'Cool Robot',
      issueddate: '04/07/2021',
      paiddate: '-',
      type: 'Subscription',
    },
    {
      id: '5',
      invoice: '#896644',
      total: 'Rp.129.000',
      status: 'Paid',
      customer: 'Mark Cameron',
      issueddate: '04/07/2021',
      paiddate: '09/07/2021',
      type: 'One-time',
    },
    {
      id: '6',
      invoice: '#136988',
      total: 'Rp.69.000',
      status: 'Paid',
      customer: 'Glenn Thomas',
      issueddate: '01/07/2021',
      paiddate: '01/07/2021',
      type: 'One-time',
    },
    {
      id: '7',
      invoice: '#442206',
      total: 'Rp.129.000',
      status: 'Overdue',
      customer: 'Dominik Lamakani',
      issueddate: '22/06/2021',
      paiddate: '-',
      type: 'Subscription',
    },
    {
      id: '8',
      invoice: '#764321',
      total: 'Rp.89.000',
      status: 'Paid',
      customer: 'Brian Halligan',
      issueddate: '21/06/2021',
      paiddate: '29/06/2021',
      type: 'One-time',
    },
    {
      id: '9',
      invoice: '#908764',
      total: 'Rp.129.000',
      status: 'Due',
      customer: 'Carolyn McNeail',
      issueddate: '17/06/2021',
      paiddate: '-',
      type: 'Subscription',
    }
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(invoices);
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

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">Invoices <span className="text-slate-400 font-medium">67</span></h2>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
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
                  <div className="font-semibold text-left">Invoice</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Customer</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Issued on</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Paid on</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Type</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200">
              {
                list.map(invoice => {
                  return (
                    <Invoices
                      key={invoice.id}
                      id={invoice.id}
                      invoice={invoice.invoice}
                      total={invoice.total}
                      status={invoice.status}
                      customer={invoice.customer}
                      issueddate={invoice.issueddate}
                      paiddate={invoice.paiddate}
                      type={invoice.type}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(invoice.id)}
                    />
                  )
                })
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default InvoicesTable;
