import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Check, Clock, AlertOctagon, Eye } from 'lucide-react';

export default function AdminReportsPage() {
  const { reports, resolveReport } = useAuth();
  
  const [viewingReport, setViewingReport] = useState(null);

  return (
    <div className="space-y-6 py-4 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900 leading-tight">Doctor Incident Reports</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Review and manage reports submitted by doctors regarding patient interactions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-4">
        {reports.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 font-semibold border border-slate-100">
            No incident reports submitted by doctors.
          </div>
        ) : (
          <Table
            headers={["Report Title", "Doctor", "Date", "Status", "Actions"]}
            data={reports}
            renderRow={(r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 first:pl-6 font-bold truncate max-w-xs">{r.title}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">{r.doctor_name}</td>
                <td className="py-3.5 px-4 text-xs text-slate-400">{r.created_at}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${r.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {r.status === 'RESOLVED' ? <Check size={11} /> : <Clock size={11} />}
                    <span>{r.status}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-left last:pr-6">
                  <button onClick={() => setViewingReport(r)} className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer" title="View Report Details">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </div>

      {/* View Report Modal (Admin) */}
      <Modal isOpen={!!viewingReport} onClose={() => setViewingReport(null)} title="Incident Report Details">
        {viewingReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Doctor: {viewingReport.doctor_name}</span>
              <span className="text-xs text-slate-400 border-l border-slate-200 pl-2">Date: {viewingReport.created_at}</span>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ml-auto ${viewingReport.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{viewingReport.status}</span>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
              <h4 className="font-bold text-slate-800 mb-1">{viewingReport.title}</h4>
              {viewingReport.description}
            </div>
            
            {viewingReport.image_url && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-xs font-bold text-slate-500 uppercase">Attached Evidence:</span>
                  <a 
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/${viewingReport.image_url.replace('reports/', 'reports/image/')}`} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-pink-600 hover:text-brand-pink-700 font-semibold"
                  >
                    View / Download
                  </a>
                </div>
                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/${viewingReport.image_url.replace('reports/', 'reports/image/')}`} alt="Evidence" className="max-w-full rounded-lg border border-slate-200 shadow-sm" />
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2 mt-4 border-t border-slate-100">
              {viewingReport.status === 'PENDING' ? (
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={async () => {
                    await resolveReport(viewingReport.id);
                    Swal.fire('Resolved', 'The report has been marked as resolved.', 'success');
                    setViewingReport(null);
                  }}
                >
                  Mark as Resolved
                </Button>
              ) : <div></div>}
              <Button variant="outline" size="sm" onClick={() => setViewingReport(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
