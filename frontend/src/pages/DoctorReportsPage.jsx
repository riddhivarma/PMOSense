import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Clock, CheckCircle, Send, AlertOctagon, Eye, Plus } from 'lucide-react';

export default function DoctorReportsPage() {
  const { user, reports, addReport } = useAuth();
  
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportImageFile, setReportImageFile] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTitle || !reportDescription) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please provide a title and description.', confirmButtonColor: '#db2777' });
      return;
    }
    
    setLoading(true);
    try {
      await addReport(reportTitle, reportDescription, reportImageFile, user?.id, user?.name);
      Swal.fire('Report Submitted!', 'Admin has been notified of the issue.', 'success');
      setReportModalOpen(false);
      setReportTitle('');
      setReportDescription('');
      setReportImageFile(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#db2777' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReportImageFile(e.target.files[0]);
    }
  };

  const myReports = reports.filter(r => r.doctor_id === user?.id);

  return (
    <div className="space-y-6 py-4 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900 leading-tight">Support & Incident Reports</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Report spam, harassment, or inappropriate queries directly to platform admins.</p>
        </div>
        <Button onClick={() => setReportModalOpen(true)} icon={<Plus size={16} />} className="text-sm">
          Report an Issue
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-4">
        <Table
          headers={["Report Title", "Submitted On", "Status", "Actions"]}
          data={myReports}
          emptyMessage="You haven't submitted any incident reports."
          renderRow={(r) => (
            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3.5 px-4 first:pl-6 font-bold text-slate-800 truncate max-w-xs">{r.title}</td>
              <td className="py-3.5 px-4 text-xs font-medium text-slate-500">{r.created_at}</td>
              <td className="py-3.5 px-4">
                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${r.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {r.status === 'RESOLVED' ? <CheckCircle size={11} /> : <Clock size={11} />}
                  <span>{r.status}</span>
                </span>
              </td>
              <td className="py-3.5 px-4 text-left last:pr-6">
                <button onClick={() => setViewingReport(r)} className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer" title="View Report">
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      {/* Report Issue Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report an Issue">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <Input label="Issue Title" placeholder="e.g. Inappropriate PDF uploaded by patient" value={reportTitle} onChange={e => setReportTitle(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="form-label">Description of Issue *</label>
            <textarea className="form-input text-xs sm:text-sm h-32 resize-none" placeholder="Provide details like patient name, consultation content, or why this is being reported..." value={reportDescription} onChange={e => setReportDescription(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="form-label">Proof Image (Optional)</label>
            <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink-50 file:text-brand-pink-700 hover:file:bg-brand-pink-100 cursor-pointer" />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={loading} icon={<Send size={14} />}>Submit Report</Button>
          </div>
        </form>
      </Modal>

      {/* View Report Modal */}
      <Modal isOpen={!!viewingReport} onClose={() => setViewingReport(null)} title="Incident Report Details">
        {viewingReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-400">Date: {viewingReport.created_at}</span>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${viewingReport.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{viewingReport.status}</span>
            </div>
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">{viewingReport.description}</div>
            {viewingReport.image_url && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-xs font-bold text-slate-500 uppercase">Attached Proof:</span>
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
                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/${viewingReport.image_url.replace('reports/', 'reports/image/')}`} alt="Proof" className="max-w-full rounded-lg border border-slate-200 shadow-sm" />
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewingReport(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
