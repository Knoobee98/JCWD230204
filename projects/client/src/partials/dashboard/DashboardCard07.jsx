import React from 'react';

function DashboardCard07() {
  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Top Customer</h2>
      </header>
      <div className="p-3">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Username</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Total Visit</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Transactions</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Location</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Latest Payment</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-slate-800">Udinsedunia</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">52 times</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">Rp.78.000.000</div>
                </td>
                <td className="p-2">
                  <div className="text-center">Jakarta</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">April 4th</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-slate-800">Markonahcantik</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">48 times</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">Rp.50.000.000</div>
                </td>
                <td className="p-2">
                  <div className="text-center">Jakarta</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">April 1th</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-slate-800">SquidwardGG</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">40 times</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">Rp.45.000.000</div>
                </td>
                <td className="p-2">
                  <div className="text-center">Tangerang Selatan</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">April 4th</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-slate-800">KucingOren</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">45 times</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">Rp.41.000.000</div>
                </td>
                <td className="p-2">
                  <div className="text-center">Bogor</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">March 25th</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-slate-800">HelloDunia</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">100 times</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">Rp.30.000.000</div>
                </td>
                <td className="p-2">
                  <div className="text-center">Tangerang Selatan</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">April 2th</div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
