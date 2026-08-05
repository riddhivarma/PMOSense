// frontend/src/components/Table.jsx
import React from 'react';
import Loader from './Loader';

export default function Table({
  headers = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  renderRow,
  className = ''
}) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {loading ? (
        <Loader text="Retrieving records..." />
      ) : data.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] sm:text-xs">
                {headers.map((header, idx) => (
                  <th key={idx} className="py-3 px-4 first:pl-6 last:pr-6">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-105 font-semibold text-slate-650">
              {data.map((item, idx) => renderRow(item, idx))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-450 font-semibold">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
