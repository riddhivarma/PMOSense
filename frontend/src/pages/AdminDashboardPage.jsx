// frontend/src/pages/AdminDashboardPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import { 
  Users, Stethoscope, FileText, ShieldAlert, Plus, Edit2, Trash2, ShieldCheck, 
  Settings, BookOpen, Clock, Activity, X, Check 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    users, doctors, articles, assessments, 
    toggleUserVerify, approveDoctor, addArticle, updateArticle, deleteArticle,
    verifyProfileChange, rejectProfileChange
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState('stats'); // stats, patients, specialists, content
  
  // Article Manager Forms State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Symptoms');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Platform Metrics
  const totalUsers = users.length;
  const totalDoctors = doctors.length;
  const totalAssessments = assessments.length;
  const highRiskAssessments = assessments.filter(asm => asm.prediction.risk_level === 'High').length;

  const handleToggleVerify = (id) => {
    toggleUserVerify(id);
    Swal.fire('Vitals Synced', 'Patient verification status has been toggled.', 'success');
  };

  const handleApproveDoc = (id) => {
    approveDoctor(id);
    Swal.fire('Credential Updated', 'Doctor credentials verification toggled successfully.', 'success');
  };

  const handleVerifyProfile = (id) => {
    verifyProfileChange(id);
    Swal.fire('Changes Verified', 'Doctor profile changes verified successfully.', 'success');
  };

  const handleRejectProfile = (id) => {
    rejectProfileChange(id);
    Swal.fire('Request Rejected', 'Profile change request was dismissed.', 'info');
  };

  const handleArticleFormOpen = (art = null) => {
    if (art) {
      setEditingArticleId(art.id);
      setTitle(art.title);
      setCategory(art.category);
      setContent(art.content);
      setVideoUrl(art.video_url || '');
    } else {
      setEditingArticleId(null);
      setTitle('');
      setCategory('Symptoms');
      setContent('');
      setVideoUrl('');
    }
    setArticleModalOpen(true);
  };

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      Swal.fire({ icon: 'warning', title: 'Details Mismatch', text: 'Please fill in Title, Category, and Content fields.', confirmButtonColor: '#db2777' });
      return;
    }

    if (editingArticleId) {
      updateArticle(editingArticleId, title, category, content, videoUrl);
      Swal.fire('Article Updated!', 'Educational article updated successfully.', 'success');
    } else {
      addArticle(title, category, content, videoUrl);
      Swal.fire('Article Published!', 'Educational article published successfully.', 'success');
    }

    setArticleModalOpen(false);
  };

  const handleDeleteArt = (id) => {
    Swal.fire({
      title: 'Delete this article?',
      text: "This resource will be permanently removed from the Educational Hub.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteArticle(id);
        Swal.fire('Removed!', 'Article has been removed.', 'success');
      }
    });
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">Admin Console</h1>
          <p className="text-slate-550 text-xs sm:text-sm">Overview platform metrics, authorize doctors, and write resources.</p>
        </div>
        
        <span className="text-xs uppercase bg-brand-pink-50 border border-brand-pink-100 px-3 py-1 rounded-xl text-brand-pink-600 font-extrabold flex items-center space-x-1.5 shadow-xs">
          <Settings size={14} />
          <span>Platform Administrator</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'stats', label: 'Overview Metrics', icon: <Activity size={14} /> },
          { id: 'patients', label: 'Manage Patients', icon: <Users size={14} /> },
          { id: 'specialists', label: 'Manage Doctors', icon: <Stethoscope size={14} /> },
          { id: 'content', label: 'Articles Manager', icon: <BookOpen size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 py-2.5 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === tab.id ? 'bg-brand-pink-50 border-brand-pink-300 text-brand-pink-600 shadow-sm font-extrabold' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview stats panel */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Patients" value={totalUsers} icon={<Users size={18} />} color="pink" />
            <DashboardCard title="Total Doctors" value={totalDoctors} icon={<Stethoscope size={18} />} color="indigo" />
            <DashboardCard title="Assessments Conducted" value={totalAssessments} icon={<FileText size={18} />} color="purple" />
            <DashboardCard title="High Risk Flags" value={highRiskAssessments} icon={<ShieldAlert size={18} />} color="red" />
          </div>

          {/* Recent activities mock card list */}
          <Card title="Recent Administrative Actions" icon={<Clock size={16} />}>
            <div className="space-y-4 mt-2 text-xs">
              {[
                { time: "10 mins ago", action: "System checked: XGBoost classification scaling operational." },
                { time: "1 hour ago", action: "Admin verification: Dr. Jenkins specialized account approved." },
                { time: "Yesterday", action: "Article published: 'Strength Training vs Cardio for PMOS Recovery' posted by Wellness Team." }
              ].map((act, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0 leading-relaxed font-semibold">
                  <span className="text-slate-650">{act.action}</span>
                  <span className="text-slate-400 shrink-0 pl-4">{act.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Patients management */}
      {activeTab === 'patients' && (
        <div className="glass-card p-5 overflow-hidden animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Registered Patient Directory</h3>
          <Table
            headers={["Name", "Email Address", "Registered Vitals", "Actions"]}
            data={users}
            renderRow={(u, i) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 first:pl-6">{u.name}</td>
                <td className="py-3.5 px-4 text-xs font-bold text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                  {u.bmi ? `BMI: ${u.bmi} (Age: ${u.age})` : 'No logs compiled'}
                </td>
                <td className="py-3.5 px-4 text-left last:pr-6">
                  <Button 
                    variant={u.is_verified ? 'outline' : 'primary'} 
                    size="sm" 
                    onClick={() => handleToggleVerify(u.id)}
                    className="text-xs py-1.5 px-3"
                  >
                    {u.is_verified ? 'Revoke Approval' : 'Approve Patient'}
                  </Button>
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* Doctors verification management */}
      {activeTab === 'specialists' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-card p-5 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Medical Specialist Registry</h3>
            <Table
              headers={["Doctor", "Email Address", "Specialization (Exp)", "License Number", "Status", "Actions"]}
              data={doctors}
              renderRow={(d, i) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 first:pl-6">
                    <div className="flex items-center space-x-3">
                      {d.profile_picture ? (
                        <img src={d.profile_picture} alt="Avatar" className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-pink-50 text-brand-pink-650 flex items-center justify-center font-bold text-sm shrink-0">
                          {d.name.charAt(0)}
                        </div>
                      )}
                      <span>{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-650">{d.email}</td>
                  <td className="py-3.5 px-4 text-xs">{d.specialization} ({d.experience_years} years)</td>
                  <td className="py-3.5 px-4 text-xs font-extrabold text-brand-indigo-650">{d.license_number || 'No License'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold border ${d.is_approved ? 'text-emerald-650 bg-emerald-50 border-emerald-150' : 'text-red-650 bg-red-50 border-red-150'}`}>
                      {d.is_approved ? 'APPROVED' : 'PENDING/BLOCKED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-left last:pr-6">
                    <Button 
                      variant={d.is_approved ? 'outline' : 'primary'} 
                      size="sm" 
                      onClick={() => handleApproveDoc(d.id)}
                      className="text-xs py-1.5 px-3"
                    >
                      {d.is_approved ? 'Revoke Approval' : 'Grant Approval'}
                    </Button>
                  </td>
                </tr>
              )}
            />
          </div>

          <div className="glass-card p-5 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Clock size={16} className="text-brand-indigo-500" />
              <span>Manage Doctor Profile Changes</span>
            </h3>
            {doctors.filter(d => d.pending_license_number || d.pending_profile_picture).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 font-semibold border border-slate-100">
                No pending profile or license change requests.
              </div>
            ) : (
              <Table
                headers={["Doctor Name", "Current Details", "Requested Changes", "Actions"]}
                data={doctors.filter(d => d.pending_license_number || d.pending_profile_picture)}
                renderRow={(d, i) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 first:pl-6 font-bold">{d.name}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 space-y-2">
                      {d.pending_license_number && <div>Lic: {d.license_number}</div>}
                      {d.pending_profile_picture && (
                        <div className="flex items-center space-x-2">
                          <span>PFP:</span>
                          {d.profile_picture ? <img src={d.profile_picture} alt="Current" className="h-6 w-6 rounded-full object-cover" /> : <span>None</span>}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-extrabold text-brand-indigo-650 space-y-2">
                      {d.pending_license_number && (
                        <div className="bg-brand-indigo-50/50 px-2 py-0.5 rounded border border-brand-indigo-150 inline-block">Lic: {d.pending_license_number}</div>
                      )}
                      {d.pending_profile_picture && (
                        <div className="flex items-center space-x-2 bg-brand-indigo-50/50 px-2 py-0.5 rounded border border-brand-indigo-150 inline-flex">
                          <span>PFP:</span>
                          <img src={d.pending_profile_picture} alt="Requested" className="h-6 w-6 rounded-full object-cover" />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-left last:pr-6 space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerifyProfile(d.id)}
                        className="text-xs py-1.5 px-3"
                      >
                        Verify
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectProfile(d.id)}
                        className="text-xs py-1.5 px-3 text-red-650 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-750"
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>
      )}

      {/* Articles publisher manager */}
      {activeTab === 'content' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pl-1">Article Inventory</h3>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => handleArticleFormOpen(null)}>
              Publish Article
            </Button>
          </div>

          <div className="glass-card p-5 overflow-hidden">
            <Table
              headers={["Title", "Category", "Published Date", "Author", "Actions"]}
              data={articles}
              renderRow={(art, i) => (
                <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 first:pl-6 max-w-xs truncate" title={art.title}>{art.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">{art.created_at}</td>
                  <td className="py-3.5 px-4 text-xs">{art.created_by || "Administrator"}</td>
                  <td className="py-3.5 px-4 text-left last:pr-6">
                    <div className="flex items-center justify-start space-x-1">
                      <button 
                        onClick={() => handleEditArticle(art)}
                        className="p-2 text-slate-400 hover:text-brand-indigo-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit article"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDeleteArt(art.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* Article Publication Modal */}
      <Modal
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        title={editingArticleId ? "Modify Resource Article" : "Publish Resource Article"}
      >
        <form onSubmit={handleArticleSubmit} className="space-y-4">
          <Input
            label="Article Title"
            name="title"
            placeholder="e.g. Recognizing early symptoms of insulin spikes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Article Category"
              name="category"
              options={["Symptoms", "Causes", "Prevention", "Healthy Diet", "Exercise", "FAQs"]}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="Video demonstration URL (Optional)"
              name="videoUrl"
              placeholder="e.g. https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="form-label">Article Text Content</label>
            <textarea
              className="form-input text-xs sm:text-sm h-40 resize-none"
              placeholder="Compose detailed clinical summaries, symptoms checks, or diet recipes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-3 pt-2 justify-end">
            <Button variant="outline" onClick={() => setArticleModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" icon={<Check size={14} />} className="text-xs">
              {editingArticleId ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  function handleEditArticle(art) {
    handleArticleFormOpen(art);
  }
}
