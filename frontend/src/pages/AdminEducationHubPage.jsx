// frontend/src/pages/AdminEducationHubPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import { 
  Plus, Edit2, Trash2, Check, BookOpen, ExternalLink, ShieldCheck, X, Eye
} from 'lucide-react';

export default function AdminEducationHubPage() {
  const { 
    user, articles, addArticle, updateArticle, deleteArticle, approveArticle, rejectArticle 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState('published'); // published, doctors, userview
  
  // Article Manager Forms State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [viewingDoctorArticle, setViewingDoctorArticle] = useState(null);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Platform news and updates');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

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
      setCategory('Platform news and updates');
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

  const handleApprove = (id) => {
    approveArticle(id);
    Swal.fire('Approved!', 'Article has been published.', 'success');
  };

  const handleReject = (id) => {
    rejectArticle(id);
    Swal.fire('Rejected!', 'Article has been rejected.', 'info');
  };

  function handleEditArticle(art) {
    handleArticleFormOpen(art);
  }

  // Filter articles
  const adminArticles = articles.filter(a => a.authorRole === 'admin' || !a.authorRole); // fallback to include existing initial data
  const pendingDoctorArticles = articles.filter(a => a.authorRole === 'doctor' && a.status === 'PENDING');
  const respondedDoctorArticles = articles.filter(a => a.authorRole === 'doctor' && (a.status === 'PUBLISHED' || a.status === 'REJECTED'));

  const openUserView = () => {
    window.open('/education-preview', '_blank');
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">Educational Hub</h1>
          <p className="text-slate-550 text-xs sm:text-sm">Manage educational resources, publish articles, and moderate doctor submissions.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'published', label: 'Published Articles', icon: <BookOpen size={14} /> },
          { id: 'doctors', label: 'Doctors\' Articles', icon: <ShieldCheck size={14} /> },
          { id: 'userview', label: 'User\'s View', icon: <ExternalLink size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'userview') {
                openUserView();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`flex items-center space-x-1.5 py-2.5 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === tab.id ? 'bg-brand-pink-50 border-brand-pink-300 text-brand-pink-600 shadow-sm font-extrabold' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Published Articles (Admin) */}
      {activeTab === 'published' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pl-1">My Published Articles</h3>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => handleArticleFormOpen(null)} className="bg-brand-pink-600 hover:bg-brand-pink-700">
              Publish Article
            </Button>
          </div>

          <div className="glass-card p-5 overflow-hidden">
            <Table
              headers={["Title", "Category", "Published Date", "Actions"]}
              data={adminArticles}
              renderRow={(art, i) => (
                <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 first:pl-6 max-w-xs truncate" title={art.title}>{art.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">{art.created_at}</td>
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

      {/* Doctors' Articles Moderation */}
      {activeTab === 'doctors' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Pending Applications */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pl-1">Pending Article Applications</h3>
             <div className="glass-card p-5 overflow-hidden">
                <Table
                  headers={["Title", "Category", "Submitted By", "Date", "Actions"]}
                  data={pendingDoctorArticles}
                  renderRow={(art, i) => (
                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 first:pl-6 max-w-xs truncate" title={art.title}>{art.title}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium">{art.created_by}</td>
                      <td className="py-3.5 px-4 text-xs">{art.created_at}</td>
                      <td className="py-3.5 px-4 text-left last:pr-6">
                        <div className="flex items-center justify-start space-x-2">
                          <button 
                            onClick={() => setViewingDoctorArticle(art)}
                            className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview Doctor's Article"
                          >
                            <Eye size={14} />
                          </button>
                          <Button size="sm" variant="primary" onClick={() => handleApprove(art.id)} className="text-[10px] py-1 px-2 h-auto">Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(art.id)} className="text-[10px] py-1 px-2 h-auto text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
             </div>
          </div>

          {/* Responded Articles */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pl-1">Responded Articles</h3>
             <div className="glass-card p-5 overflow-hidden">
                <Table
                  headers={["Title", "Category", "Author", "Status", "Date", "Actions"]}
                  data={respondedDoctorArticles}
                  renderRow={(art, i) => (
                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 first:pl-6 max-w-xs truncate" title={art.title}>{art.title}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium">{art.created_by}</td>
                      <td className="py-3.5 px-4 text-xs">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${art.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                           {art.status}
                         </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">{art.created_at}</td>
                      <td className="py-3.5 px-4 text-left last:pr-6">
                        <div className="flex items-center justify-start space-x-1">
                          <button 
                            onClick={() => setViewingDoctorArticle(art)}
                            className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview Doctor's Article"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteArt(art.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        </div>
      )}

      {/* Modal to Preview Doctor Submitted Article */}
      <Modal
        isOpen={!!viewingDoctorArticle}
        onClose={() => setViewingDoctorArticle(null)}
        title={viewingDoctorArticle?.title || "Doctor Submitted Article"}
      >
        {viewingDoctorArticle && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                {viewingDoctorArticle.category}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                By: {viewingDoctorArticle.created_by}
              </span>
              <span className="text-xs text-slate-400">
                Date: {viewingDoctorArticle.created_at}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                viewingDoctorArticle.status === 'PUBLISHED' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : viewingDoctorArticle.status === 'REJECTED' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {viewingDoctorArticle.status}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-72 overflow-y-auto">
              {viewingDoctorArticle.content}
            </div>

            {viewingDoctorArticle.video_url && (
              <a 
                href={viewingDoctorArticle.video_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-bold text-brand-pink-600 hover:underline block"
              >
                View Attached Video / Reference Link &rarr;
              </a>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              {viewingDoctorArticle.status === 'PENDING' ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => {
                      handleApprove(viewingDoctorArticle.id);
                      setViewingDoctorArticle(null);
                    }}
                    className="text-xs"
                  >
                    Approve & Publish
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      handleReject(viewingDoctorArticle.id);
                      setViewingDoctorArticle(null);
                    }}
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              ) : <div></div>}
              <Button variant="outline" size="sm" onClick={() => setViewingDoctorArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
              options={["Platform news and updates", "Latest News and trends"]}
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
}
