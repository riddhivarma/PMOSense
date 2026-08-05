// frontend/src/pages/DoctorDashboardPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import Table from '../components/Table';
import { Stethoscope, Clock, CheckCircle, Send, MessageSquare, Award, ArrowRight } from 'lucide-react';

export default function DoctorDashboardPage() {
  const { user, consultations, replyConsultation } = useAuth();
  
  const [activeQuery, setActiveQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  // Queries matching doctor ID (or General Medical pool)
  const doctorConsults = consultations.filter(con => con.doctor_id === user?.id || con.doctor_id === null || con.status === 'resolved');
  
  const pending = doctorConsults.filter(c => c.status === 'pending');
  const completed = doctorConsults.filter(c => c.status === 'resolved' && c.doctor_id === user?.id);
  const totalHelpedCount = completed.length;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 10) {
      Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Please type a detailed reply (min 10 characters).', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);
    try {
      await replyConsultation(activeQuery.id, replyText);
      Swal.fire({
        icon: 'success',
        title: 'Reply Submitted!',
        text: 'Consultation response successfully shared with patient.',
        confirmButtonColor: '#4f46e5'
      });
      setReplyText('');
      setActiveQuery(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Error', text: err.message, confirmButtonColor: '#db2777' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">Welcome back, Dr. {user?.name}!</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Ready to review today's patient queries?</p>
        </div>
        
        <span className="text-xs uppercase bg-brand-indigo-50 border border-brand-indigo-150 px-3 py-1 rounded-xl text-brand-indigo-600 font-extrabold flex items-center space-x-1.5 shadow-xs">
          <Stethoscope size={14} />
          <span>Verified Medical Expert</span>
        </span>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard
          title="Pending Queries"
          value={pending.length}
          subtitle="Pending Patient Queries"
          icon={<Clock size={18} />}
          color="amber"
        />

        <DashboardCard
          title="Completed Queries"
          value={completed.length}
          subtitle="Patient inquiries resolved by you"
          icon={<CheckCircle size={18} />}
          color="green"
        />

        <DashboardCard
          title="Care Reach Index"
          value={totalHelpedCount}
          subtitle="Patients guided this month"
          icon={<Award size={18} />}
          color="indigo"
        />
      </div>

      {/* Reply Form / Select Hint split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Table Panel */}
        <div className="lg:col-span-7">
          <div className="glass-card p-5 h-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
              <MessageSquare className="text-brand-indigo-500" size={16} />
              <span>Patient Query Table</span>
            </h3>

            <Table
              headers={["Patient", "Inquiry Date", "Status", "Actions"]}
              data={doctorConsults}
              renderRow={(row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 first:pl-6">{row.user_name}</td>
                  <td className="py-3.5 px-4 text-xs">{row.created_at}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold border ${row.status === 'resolved' ? 'text-emerald-600 bg-emerald-50 border-emerald-150' : 'text-amber-600 bg-amber-50 border-amber-150'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-left last:pr-6">
                    {row.status === 'pending' ? (
                      <Button 
                        size="sm" 
                        onClick={() => { setActiveQuery(row); setReplyText(''); }}
                        className="text-xs"
                      >
                        Formulate Reply
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold italic">Resolved</span>
                    )}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>

        {/* Reply Form Panel */}
        <div className="lg:col-span-5">
          {activeQuery ? (
            <form onSubmit={handleReplySubmit} className="glass-card p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Consulting query for:</span>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{activeQuery.user_name}</h4>
                  </div>
                  <button type="button" onClick={() => setActiveQuery(null)} className="text-slate-400 hover:text-slate-600 focus:outline-none">Cancel</button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl max-h-32 overflow-y-auto text-xs leading-relaxed text-slate-650 font-medium">
                  {activeQuery.question}
                </div>

                <div className="space-y-1.5">
                  <label className="form-label">Write Professional Feedback</label>
                  <textarea
                    className="form-input text-xs h-32 resize-none"
                    placeholder="Provide medical parameters review, advice on cycles tracking, exercise changes, or dietary tips..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                icon={<Send size={14} />} 
                className="w-full mt-4"
              >
                Send Response
              </Button>
            </form>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400 font-semibold border-dashed border-2 border-slate-200 h-full flex flex-col items-center justify-center">
              <Stethoscope size={24} className="text-slate-300 mb-2" />
              <span>Select a pending query from the table to formulate and publish your clinical response.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
