import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionsTableItem';

import Image01 from '../../../images/mutia.png'
import Image02 from '../../../images/mutia.png'
import Image03 from '../../../images/mutia.png'
import Image04 from '../../../images/mutia.png'
import Image05 from '../../../images/mutia.png'
import Image06 from '../../../images/mutia.png'
import Image07 from '../../../images/mutia.png'
import Image08 from '../../../images/mutia.png'
import Image09 from '../../../images/mutia.png'

function TransactionsTable({
  selectedItems
}) {

  const transactions = [
    {
      id: '0',
      image: Image01,
      name: 'lalalasicantekmaneez',
      date: '22/01/2022',
      status: 'Pending',
      amount: '-Rp.1,299.22',
    },
    {
      id: '1',
      image: Image02,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.1,029.77',
    },
    {
      id: '2',
      image: Image03,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Pending',
      amount: '+Rp.499.99',
    },
    {
      id: '3',
      image: Image04,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.1,029.77',
    },
    {
      id: '4',
      image: Image05,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Pending',
      amount: '+Rp.2,179.36',
    },
    {
      id: '5',
      image: Image04,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Canceled',
      amount: '-Rp.1,029.77',
    },
    {
      id: '6',
      image: Image06,
      name: 'lalalasicantekmaneez',
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.272.88',
    },
    {
      id: '7',
      image: Image07,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.199.87',
    },
    {
      id: '8',
      image: Image08,
      name: 'lalalasicantekmaneez' ,
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.42.87',
    },
    {
      id: '9',
      image: Image09,
      name: 'lalalasicantekmaneez',
      date: '22/01/2022',
      status: 'Completed',
      amount: '-Rp.112.44',
    },
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(transactions);
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
    <div className="bg-white">
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
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
                  <div className="font-semibold text-left">Username</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Payment Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-right">Total</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200 border-b border-slate-200">
              {list.map((transaction) => {
                return (
                  <TransactionItem
                    key={transaction.id}
                    id={transaction.id}
                    image={transaction.image}
                    name={transaction.name}
                    date={transaction.date}
                    status={transaction.status}
                    amount={transaction.amount}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(transaction.id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionsTable;
