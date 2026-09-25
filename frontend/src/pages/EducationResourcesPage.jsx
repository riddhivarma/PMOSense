// frontend/src/pages/EducationResourcesPage.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import { 
  BookOpen, ArrowLeft, Calendar, User, Tag, Plus, CheckCircle, 
  XCircle, Clock, Eye, Send, Check
} from 'lucide-react';

export default function EducationResourcesPage() {
  const { user, articles, addArticle, doctors } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('ALL');

  // Modal states for doctor
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states for new article request
  const [reqTitle, setReqTitle] = useState('');
  const [reqContent, setReqContent] = useState('');
  const [reqVideoUrl, setReqVideoUrl] = useState('');

  const isDoctor = user?.role === 'doctor';

  const sortedPublished = articles.filter(a => a.status === 'PUBLISHED' || !a.status);



  const filteredArticles = sortedPublished.filter(art => {
    if (activeTab === 'ALL') return true;
    const cat = art.category ? art.category.toLowerCase() : '';
    if (activeTab === 'news') return cat === 'latest news and trends';
    if (activeTab === 'medical') {
      return (
        ['medical and research', 'symptoms', 'causes', 'prevention', 'healthy diet', 'exercise', 'faqs', 'what is pmos'].includes(cat) ||
        art.authorRole === 'doctor'
      );
    }
    if (activeTab === 'platform') return cat === 'platform news and updates';
    return true;
  });

  // Doctor's personal articles matching helper
  const isMyDoctorArticle = (art) => {
    if (art.authorRole !== 'doctor') return false;
    if (art.authorId && user?.id && art.authorId === user.id) return true;
    if (user?.name) {
      const uName = user.name.replace(/^Dr\.\s*/i, '').trim().toLowerCase();
      const aName = (art.created_by || '').replace(/^Dr\.\s*/i, '').trim().toLowerCase();
      if (uName && aName && (aName === uName || aName.includes(uName) || uName.includes(aName))) {
        return true;
      }
    }
    return false;
  };

  const pendingArticles = articles.filter(art => isMyDoctorArticle(art) && art.status === 'PENDING');
  const respondedArticles = articles.filter(art => isMyDoctorArticle(art) && (art.status === 'PUBLISHED' || art.status === 'REJECTED'));

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqContent.trim()) return;

    addArticle(reqTitle.trim(), 'Medical and Research', reqContent.trim(), reqVideoUrl.trim());
    
    setReqTitle('');
    setReqContent('');
    setReqVideoUrl('');
    setRequestModalOpen(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 py-6 animate-fadeIn">
      
      {/* Go Back Link for non-logged in users (or admin previewing) */}
      {location.pathname !== '/education-preview' && (!user || user.role === 'admin') && (
        <div className="flex justify-start">
          <Link 
            to={user?.role === 'admin' ? '/admin-education' : '/'} 
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-brand-pink-650 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{user?.role === 'admin' ? 'Go back to Admin Console' : 'Go back to Homepage'}</span>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-pink-50 border border-brand-pink-100 text-brand-pink-650 text-xs font-extrabold uppercase tracking-wider">
          <BookOpen size={14} />
          <span>PMOS Educational Hub</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          Knowledge & Resources
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Explore the latest medical research, platform updates, and comprehensive guides for managing your health.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'ALL', label: 'ALL Articles' },
          { id: 'news', label: 'Latest News & Trends' },
          { id: 'medical', label: 'Medical & Research' },
          { id: 'platform', label: 'Platform News & Updates' },
          ...(isDoctor ? [{ id: 'my_articles', label: 'My Articles' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-brand-pink-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success Notification Banner for Doctor's Article Request */}
      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center space-x-2 font-semibold">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>Your article request has been successfully sent to the Admin Console for review!</span>
          </div>
          <button onClick={() => setSubmitSuccess(false)} className="text-xs text-emerald-600 hover:underline font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* DOCTOR VIEW: My Articles Tab */}
      {activeTab === 'my_articles' && isDoctor ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h2 className="font-outfit text-xl font-bold text-slate-800">
                My Clinical Publications & Research
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Draft and submit clinical research, trials, or PMOS awareness articles for Admin moderation and publication.
              </p>
            </div>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex items-center space-x-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-pink-500 to-brand-pink-600 hover:from-brand-pink-600 hover:to-brand-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span>Request Article Publish</span>
            </button>
          </div>

          {/* 1. Above Table: Pending Response Articles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <h3 className="font-outfit text-base font-bold text-slate-800">
                  Pending response articles
                </h3>
                <span className="text-xs bg-amber-50 text-amber-700 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingArticles.length}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Articles you have submitted to Admin that haven't been accepted or rejected yet.
            </p>

            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-2 sm:p-4">
              <Table
                headers={["Article Title", "Category", "Submitted Date", "Status", "Actions"]}
                data={pendingArticles}
                emptyMessage="No pending response articles found. Click 'Request Article Publish' to submit new research."
                renderRow={(art) => (
                  <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 first:pl-6 max-w-xs font-bold text-slate-800 truncate" title={art.title}>
                      {art.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {art.created_at}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                        <Clock size={11} className="text-amber-600" />
                        <span>Pending Approval</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-left last:pr-6">
                      <button
                        onClick={() => setViewingArticle(art)}
                        className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer"
                        title="View Submitted Content"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>

          {/* 2. Below Table: Responded Articles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
                <h3 className="font-outfit text-base font-bold text-slate-800">
                  Responded articles
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
                  {respondedArticles.length}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Articles you sent to Admin that have been responded to (tagged with 'Published' or 'Rejected'). Published articles appear in the Medical & Research section.
            </p>

            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-2 sm:p-4">
              <Table
                headers={["Article Title", "Category", "Date", "Status", "Actions"]}
                data={respondedArticles}
                emptyMessage="No responded articles found yet."
                renderRow={(art) => (
                  <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 first:pl-6 max-w-xs font-bold text-slate-800 truncate" title={art.title}>
                      {art.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {art.created_at}
                    </td>
                    <td className="py-3.5 px-4">
                      {art.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          <CheckCircle size={12} className="text-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          <XCircle size={12} className="text-rose-600" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-left last:pr-6">
                      <button
                        onClick={() => setViewingArticle(art)}
                        className="p-1.5 text-slate-400 hover:text-brand-pink-600 hover:bg-brand-pink-50 rounded-lg transition-colors cursor-pointer"
                        title="View Article Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD VIEW: Article Grid */
        filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-medium">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(art => (
              <Card key={art.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-slate-150">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    {activeTab === 'ALL' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        <Tag size={10} />
                        <span>{art.category}</span>
                      </span>
                    ) : <div />}
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
                        <Calendar size={10} />
                        <span>{art.created_at}</span>
                      </span>
                    </div>
                  </div>
                  
                  <h3 
                    onClick={() => setViewingArticle(art)}
                    className="font-outfit text-lg font-bold text-slate-800 leading-snug cursor-pointer hover:text-brand-pink-600 transition-colors"
                  >
                    {art.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {art.content && art.content.length > 170 ? (
                      <>
                        {art.content.slice(0, 170).trim()}...{' '}
                        <button
                          type="button"
                          onClick={() => setViewingArticle(art)}
                          className="text-brand-pink-600 hover:text-brand-pink-700 hover:underline font-bold cursor-pointer inline ml-0.5"
                        >
                          read more
                        </button>
                      </>
                    ) : (
                      <>
                        {art.content}{' '}
                        <button
                          type="button"
                          onClick={() => setViewingArticle(art)}
                          className="text-brand-pink-600 hover:text-brand-pink-700 hover:underline font-bold cursor-pointer inline ml-1"
                        >
                          read more
                        </button>
                      </>
                    )}
                  </p>
                  
                  {art.video_url && (
                    <a href={art.video_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-pink-600 hover:underline block pt-2">
                      Watch Video Resource &rarr;
                    </a>
                  )}
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-brand-indigo-50 flex items-center justify-center text-brand-indigo-600 overflow-hidden">
                    {(() => {
                      const docImg = art.authorRole === 'doctor' ? doctors.find(d => d.id === art.authorId)?.profile_picture : null;
                      return docImg ? <img src={docImg} alt="Doctor" className="h-full w-full object-cover" /> : <User size={12} />;
                    })()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    By <span className="font-bold text-slate-800">{art.created_by}</span>
                    {art.authorRole === 'doctor' && <span className="text-emerald-600 ml-1 font-bold">(Verified Doctor)</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Medical Disclaimer */}
      <div className="mt-12 p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-850 text-xs text-center leading-relaxed font-semibold">
        <strong>MEDICAL DISCLAIMER:</strong> This educational resource is for informational and awareness purposes only and does not replace medical diagnosis, advice, or clinical checkups. Always consult a gynecologist or medical doctor for diagnostics and hormone treatment panels.
      </div>

      {/* Modal 1: Request Article Publish Form */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Article Publish"
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 flex items-center space-x-3 text-xs text-slate-700">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-brand-pink-600 shadow-sm shrink-0 font-bold">
              Dr
            </div>
            <div>
              <p className="font-bold text-slate-800">
                Author: {user?.name?.startsWith('Dr.') ? user?.name : `Dr. ${user?.name || 'Doctor'}`}
              </p>
              <p className="text-[11px] text-slate-500">
                Submitted articles will be reviewed by Platform Admin and published in <strong className="text-brand-pink-600 font-bold">Medical & Research</strong>.
              </p>
            </div>
          </div>

          <Input
            label="Article Title"
            name="title"
            placeholder="e.g. Clinical Insights on Myo-Inositol & Vitamin D3 in PMOS Ovulatory Restoration"
            value={reqTitle}
            onChange={(e) => setReqTitle(e.target.value)}
            required
          />

          <Input
            label="Demonstration / Reference URL (Optional)"
            name="videoUrl"
            placeholder="e.g. https://youtube.com/... or medical journal reference"
            value={reqVideoUrl}
            onChange={(e) => setReqVideoUrl(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="form-label">Article / Research Content *</label>
            <textarea
              className="form-input text-xs sm:text-sm h-40 resize-none font-normal"
              placeholder="Write your clinical observations, trial analysis, symptoms checks, or patient guidelines..."
              value={reqContent}
              onChange={(e) => setReqContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-3 pt-2 justify-end">
            <Button variant="outline" onClick={() => setRequestModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" icon={<Send size={14} />} className="text-xs">
              Send to Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Submitted Article Details */}
      <Modal
        isOpen={!!viewingArticle}
        onClose={() => setViewingArticle(null)}
        title={viewingArticle?.title || "Article Details"}
      >
        {viewingArticle && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                {viewingArticle.category}
              </span>
              <span className="text-xs text-slate-400">
                {user?.role === 'admin' ? `Submitted: ${viewingArticle.created_at}` : viewingArticle.created_at}
              </span>
              {((user?.role === 'admin') || (activeTab === 'my_articles' && viewingArticle.status !== 'PUBLISHED')) && viewingArticle.status && (
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  viewingArticle.status === 'PUBLISHED' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : viewingArticle.status === 'REJECTED' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {viewingArticle.status}
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-72 overflow-y-auto">
              {viewingArticle.content}
            </div>

            {viewingArticle.video_url && (
              <a 
                href={viewingArticle.video_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-bold text-brand-pink-600 hover:underline block"
              >
                View Reference Resource &rarr;
              </a>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewingArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
