// frontend/src/pages/DoctorConsultationPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import { Stethoscope, Send, HelpCircle, MessageSquare, Clock, CheckCircle, ChevronDown, Paperclip, Download } from 'lucide-react';

export default function DoctorConsultationPage() {
  const { user, doctors, consultations, addConsultation, replyConsultation } = useAuth();
  
  const [question, setQuestion] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeQuery, setActiveQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Approved doctors list
  const approvedDocs = doctors.filter(d => d.is_approved);

  // Queries depending on role
  const patientConsults = consultations.filter(con => con.user_id === user?.id);
  const doctorPendingConsults = consultations.filter(con => con.status === 'pending' && (con.doctor_id === user?.id || con.doctor_id === null));

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 10) {
      Swal.fire({ icon: 'warning', title: 'Details Required', text: 'Please type a detailed health query (min 10 characters).', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);
    try {
      await addConsultation(question, selectedDoctor, pdfFiles);
      Swal.fire({
        icon: 'success',
        title: 'Query Sent!',
        text: 'Your query has been queued. A medical specialist will reply soon.',
        confirmButtonColor: '#4f46e5'
      });
      setQuestion('');
      setSelectedDoctor('');
      setPdfFiles([]);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Error', text: err.message, confirmButtonColor: '#db2777' });
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 10) {
      Swal.fire({ icon: 'warning', title: 'Details Required', text: 'Write a comprehensive reply (min 10 characters).', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);
    try {
      await replyConsultation(activeQuery.id, replyText);
      Swal.fire({
        icon: 'success',
        title: 'Reply Sent!',
        text: 'Your consultation response has been sent to the patient.',
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

  // Render Patient View
  const renderPatientView = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Ask a Question Form */}
      <div className="md:col-span-5">
        <form onSubmit={handlePatientSubmit} className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
            <HelpCircle className="text-brand-pink-500" size={16} />
            <span>Consult a Specialist</span>
          </h3>

          <div className="space-y-1.5 relative">
            <label className="form-label">Preferred Doctor</label>
            <div 
              className="form-input text-sm flex items-center justify-between cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center space-x-2">
                {selectedDoctor ? (
                  <>
                    {approvedDocs.find(d => d.id === selectedDoctor)?.profile_picture ? (
                      <img src={approvedDocs.find(d => d.id === selectedDoctor).profile_picture} alt="Doctor" className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-brand-pink-50 text-brand-pink-650 flex items-center justify-center font-bold text-[10px]">
                        {approvedDocs.find(d => d.id === selectedDoctor)?.name.charAt(0)}
                      </div>
                    )}
                    <span>{approvedDocs.find(d => d.id === selectedDoctor)?.name} - {approvedDocs.find(d => d.id === selectedDoctor)?.specialization}</span>
                  </>
                ) : (
                  <span>General Medical Pool (Any Doctor)</span>
                )}
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                <div 
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                  onClick={() => { setSelectedDoctor(''); setIsDropdownOpen(false); }}
                >
                  General Medical Pool (Any Doctor)
                </div>
                {approvedDocs.map(d => (
                  <div 
                    key={d.id} 
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center space-x-3 border-t border-slate-50"
                    onClick={() => { setSelectedDoctor(d.id); setIsDropdownOpen(false); }}
                  >
                    {d.profile_picture ? (
                      <img src={d.profile_picture} alt="Doctor" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-brand-pink-50 text-brand-pink-650 flex items-center justify-center font-bold text-sm shrink-0">
                        {d.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-800">{d.name}</div>
                      <div className="text-xs text-slate-500">{d.specialization} ({d.experience_years} yrs exp)</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="form-label">Query Description <span className="text-red-500">*</span></label>
            <textarea
              className="form-input text-xs sm:text-sm h-32 resize-none"
              placeholder="Explain your screening probability, observed symptoms, cycles patterns, and health concerns in detail..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5 mt-4">
            <label className="form-label">Attach PDF Documents <span className="text-slate-400 font-normal">(Optional, Max 2 files, 1MB each)</span></label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="form-input text-xs sm:text-sm pt-2 pb-2 pl-9 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-pink-50 file:text-brand-pink-700 hover:file:bg-brand-pink-100"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  const totalFiles = [...pdfFiles, ...newFiles];
                  
                  if (totalFiles.length > 2) {
                    Swal.fire({ icon: 'error', title: 'Too many files', text: 'You can upload a maximum of 2 PDFs.', confirmButtonColor: '#db2777' });
                    e.target.value = null;
                    return;
                  }
                  
                  const validFiles = totalFiles.filter(f => f.size <= 1024 * 1024);
                  if (validFiles.length !== totalFiles.length) {
                    Swal.fire({ icon: 'error', title: 'File too large', text: 'Each PDF must be under 1MB.', confirmButtonColor: '#db2777' });
                    e.target.value = null;
                  } else {
                    setPdfFiles(validFiles);
                  }
                  e.target.value = null; // Clear input so same file can be selected again if needed
                }}
              />
              <Paperclip className="absolute left-3 top-[10px] text-slate-400" size={14} />
            </div>
            {pdfFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {pdfFiles.map((file, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-brand-pink-50 text-brand-pink-700 text-[10px] font-bold rounded-lg border border-brand-pink-200">
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setPdfFiles(pdfFiles.filter((_, i) => i !== idx))}
                      className="ml-1 text-brand-pink-500 hover:text-rose-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            loading={loading} 
            icon={<Send size={14} />} 
            className="w-full mt-4"
          >
            Submit Question
          </Button>
        </form>
      </div>

      {/* Query History */}
      <div className="md:col-span-7 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pl-1 flex items-center space-x-1.5">
          <MessageSquare className="text-brand-indigo-500" size={16} />
          <span>My Inquiries & Responses</span>
        </h3>

        {patientConsults.length > 0 ? (
          <div className="space-y-4">
            {patientConsults.map((c) => (
              <div key={c.id} className="glass-card p-5 space-y-3.5 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const doc = doctors.find(d => d.id === c.doctor_id);
                      if (doc?.profile_picture) {
                        return <img src={doc.profile_picture} alt="Doctor" className="h-7 w-7 rounded-full object-cover shrink-0" />;
                      }
                      return null;
                    })()}
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Consulting Specialist</span>
                      <span className="text-xs font-bold text-slate-700">{c.doctor_name}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${c.status === 'resolved' ? 'text-emerald-600 bg-emerald-50 border-emerald-150' : 'text-amber-600 bg-amber-50 border-amber-150'}`}>
                    {c.status === 'resolved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    <span className="capitalize">{c.status}</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1">My Inquiry ({c.created_at}):</span>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-wrap">{c.question}</p>
                  {(c.file_paths && c.file_paths.length > 0) || c.file_path ? (
                    <div className="mt-3 border-t border-slate-200 pt-3 flex flex-wrap gap-2">
                      {(c.file_paths?.length ? c.file_paths : [c.file_path]).map((path, idx) => (
                        <a 
                          key={idx}
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/consultation/${c.id}/file?index=${idx}&token=${localStorage.getItem('pmosense_token')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-brand-pink-650 hover:text-brand-pink-700 bg-brand-pink-50 hover:bg-brand-pink-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Download size={13} />
                          <span>Download PDF {c.file_paths?.length > 1 ? idx + 1 : ''}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>

                {c.status === 'resolved' ? (
                  <div className="p-3.5 bg-brand-pink-50/20 border border-brand-pink-100/50 rounded-xl">
                    <span className="block text-[8px] font-bold text-brand-pink-650 uppercase mb-1">Doctor's Feedback ({c.resolved_at}):</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{c.reply}</p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 pl-1 font-medium">
                    *Waiting for specialist response review.
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center text-slate-400 font-semibold border-dashed border-2 border-slate-200">
            No medical queries recorded. Ask a specialist on the left.
          </div>
        )}
      </div>
    </div>
  );

  // Render Doctor Response Console
  const renderDoctorView = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Pending list */}
      <div className="md:col-span-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pl-1">
          <Clock size={16} className="text-amber-505" />
          <span>Pending Patient Inquiries</span>
        </h3>

        {doctorPendingConsults.length > 0 ? (
          <div className="space-y-3">
            {doctorPendingConsults.map((c) => (
              <div 
                key={c.id}
                onClick={() => { setActiveQuery(c); setReplyText(''); }}
                className={`p-4 rounded-xl border bg-white cursor-pointer hover:border-brand-pink-300 transition-all ${activeQuery?.id === c.id ? 'border-brand-pink-400 ring-2 ring-brand-pink-50' : 'border-slate-150'}`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1 uppercase">
                  <span>Patient: {c.user_name}</span>
                  <span>{c.created_at}</span>
                </div>
                <p className="text-xs text-slate-650 font-bold line-clamp-2 leading-relaxed">{c.question}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-slate-450 font-semibold">
            No pending patient queries found.
          </div>
        )}
      </div>

      {/* Reply box */}
      <div className="md:col-span-7">
        {activeQuery ? (
          <form onSubmit={handleDoctorReply} className="glass-card p-6 space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Answering patient:</span>
              <h4 className="text-sm font-bold text-slate-800">{activeQuery.user_name}</h4>
              <span className="text-[10px] text-slate-400 block font-medium">Submitted on {activeQuery.created_at}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-wrap">
              {activeQuery.question}
              {(activeQuery.file_paths && activeQuery.file_paths.length > 0) || activeQuery.file_path ? (
                <div className="mt-3 border-t border-slate-200 pt-3 flex flex-wrap gap-2">
                  {(activeQuery.file_paths?.length ? activeQuery.file_paths : [activeQuery.file_path]).map((path, idx) => (
                    <a 
                      key={idx}
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/consultation/${activeQuery.id}/file?index=${idx}&token=${localStorage.getItem('pmosense_token')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-brand-pink-650 hover:text-brand-pink-700 bg-brand-pink-50 hover:bg-brand-pink-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <Download size={13} />
                      <span>Download PDF {activeQuery.file_paths?.length > 1 ? idx + 1 : ''}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="form-label">Medical Feedback Response</label>
              <textarea
                className="form-input text-xs sm:text-sm h-36 resize-none"
                placeholder="Formulate clinical guidelines and advice..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Button type="submit" loading={loading} icon={<Send size={14} />}>
                Post Response
              </Button>
              <Button variant="outline" onClick={() => setActiveQuery(null)} className="text-xs py-2.5 px-4">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="glass-card p-12 text-center text-slate-400 font-semibold border-dashed border-2 border-slate-200">
            Select a pending patient query on the left to write and submit feedback.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">Doctor Consultations</h1>
        <p className="text-slate-500 text-xs sm:text-sm">Patient-doctor interaction and query resolutions.</p>
      </div>

      {user?.role === 'doctor' ? renderDoctorView() : renderPatientView()}
    </div>
  );
}
