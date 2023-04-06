import React, { useState, useEffect } from 'react';
import Customer from './CustomersTableItem';

import Image01 from '../../../images/woman.png'
import Image02 from '../../../images/woman.png'
import Image03 from '../../../images/woman.png'
import Image04 from '../../../images/man.png'
import Image05 from '../../../images/man.png'
import Image06 from '../../../images/man.png'
import Image07 from '../../../images/fauzan.png'
import Image08 from '../../../images/fauzan.png'
import Image09 from '../../../images/mutia.png'
import Image10 from '../../../images/mutia.png'

function CustomersTable({
  selectedItems
}) {

  const customers = [
    {
      id: '0',
      image: Image01,
      name: 'Patricia Semklo',
      email: 'patricia.semklo@app.com',
      location: 'Jakarta',
      orders: '24',
      lastOrder: '#123567',
      spent: 'Rp.2,890.660',
      refunds: '-',
      fav: true
    },
    {
      id: '1',
      image: Image02,
      name: 'Dominik Lamakani',
      email: 'dominik.lamakani@gmail.com',
      location: 'Jakarta',
      orders: '77',
      lastOrder: '#779912',
      spent: 'Rp.14,767.040',
      refunds: '4',
      fav: false
    },
    {
      id: '2',
      image: Image03,
      name: 'Ivan Mesaros',
      email: 'imivanmes@gmail.com',
      location: 'Jakarta',
      orders: '44',
      lastOrder: '#889924',
      spent: 'Rp.4,996.000',
      refunds: '1',
      fav: true
    },
    {
      id: '3',
      image: Image04,
      name: 'Maria Martinez',
      email: 'martinezhome@gmail.com',
      location: 'Bogor',
      orders: '29',
      lastOrder: '#897726',
      spent: 'Rp.3,220.660',
      refunds: '2',
      fav: false
    },
    {
      id: '4',
      image: Image05,
      name: 'Vicky Jung',
      email: 'itsvicky@contact.com',
      location: 'Bogor',
      orders: '22',
      lastOrder: '#123567',
      spent: 'Rp.2,890.660',
      refunds: '-',
      fav: true
    },
    {
      id: '5',
      image: Image06,
      name: 'Tisho Yanchev',
      email: 'tisho.y@kurlytech.com',
      location: 'Bogor',
      orders: '14',
      lastOrder: '#896644',
      spent: 'Rp.1,649.990',
      refunds: '1',
      fav: true
    },
    {
      id: '6',
      image: Image07,
      name: 'James Cameron',
      email: 'james.ceo@james.tech',
      location: 'Tangerang Selatan',
      orders: '34',
      lastOrder: '#136988',
      spent: 'Rp.3,569.870',
      refunds: '2',
      fav: true
    },
    {
      id: '7',
      image: Image08,
      name: 'Haruki Masuno',
      email: 'haruki@supermail.jp',
      location: 'Tangerang Selatan',
      orders: '112',
      lastOrder: '#442206',
      spent: 'Rp.19,246.070',
      refunds: '6',
      fav: false
    },
    {
      id: '8',
      image: Image09,
      name: 'Joe Huang',
      email: 'joehuang@hotmail.com',
      location: 'Jakarta',
      orders: '64',
      lastOrder: '#764321',
      spent: 'Rp.12,276.920',
      refunds: '-',
      fav: true
    },
    {
      id: '9',
      image: Image10,
      name: 'Carolyn McNeail',
      email: 'carolynlove@gmail.com',
      location: 'Tangerang Selatan',
      orders: '19',
      lastOrder: '#908764',
      spent: 'Rp.1,289.970',
      refunds: '2',
      fav: false
    }
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(customers);
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
        <h2 className="font-semibold text-slate-800">All Customers <span className="text-slate-400 font-medium">248</span></h2>
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
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <span className="sr-only">Favourite</span>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Order</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Location</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Orders</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Last order</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total spent</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Refunds</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200">
              {
                list.map(customer => {
                  return (
                    <Customer
                      key={customer.id}
                      id={customer.id}
                      image={customer.image}
                      name={customer.name}
                      email={customer.email}
                      location={customer.location}
                      orders={customer.orders}
                      lastOrder={customer.lastOrder}
                      spent={customer.spent}
                      refunds={customer.refunds}
                      fav={customer.fav}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(customer.id)}
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

export default CustomersTable;
