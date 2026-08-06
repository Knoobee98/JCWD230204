import React from 'react';

function TransactionsTableItem(props) {

  const statusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'Cancelled':
      case 'Canceled':
        return 'bg-rose-100 text-rose-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `Rp.${Number(amount).toLocaleString('id-ID')}`;
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input id={props.id} className="form-checkbox" type="checkbox" onChange={props.handleClick} checked={props.isChecked} />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-slate-800">{props.orderId || `#${props.id}`}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-slate-600">{props.user_id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{formatDate(props.date)}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(props.status)}`}>{props.status || 'Unknown'}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="text-right font-medium text-slate-700">{formatAmount(props.amount)}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => props.handleStatusChange(props.id, 'Confirm Payment')}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Confirm
          </button>
          <button
            onClick={() => props.handleStatusChange(props.id, 'delivery')}
            className="text-xs font-medium text-amber-600 hover:text-amber-800"
          >
            Delivery
          </button>
          <button
            onClick={() => props.handleStatusChange(props.id, 'cancel')}
            className="text-xs font-medium text-rose-600 hover:text-rose-800"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TransactionsTableItem;
