// frontend/src/pages/RecommendationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Compass, Activity, Clock, Heart, Stethoscope, ClipboardCheck } from 'lucide-react';

export default function RecommendationsPage() {
  const { assessments, user } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('diet');

  useEffect(() => {
    const userAsms = assessments.filter(asm => asm.user_id === user?.id);
    if (userAsms.length > 0) {
      const sorted = [...userAsms].sort((a, b) => new Date(b.date) - new Date(a.date));
      setAssessment(sorted[0]); // default to latest
    }
  }, [assessments, user]);

  if (!assessment) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center space-y-6 animate-fadeIn">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-brand-pink-50 flex items-center justify-center text-brand-pink-500 shadow-md border border-brand-pink-100">
            <ClipboardCheck size={32} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">No Plan Available</h2>
          <p className="text-xs sm:text-sm text-slate-400">Please complete an initial health assessment to unlock personalized diet and fitness guides.</p>
        </div>
        <Link to="/assessment">
          <Button>Start Assessment</Button>
        </Link>
      </div>
    );
  }

  const { recommendations, prediction } = assessment;

  const tabs = [
    { id: 'diet', label: 'Diet Plan', icon: <Compass size={16} /> },
    { id: 'exercise', label: 'Exercise Plan', icon: <Activity size={16} /> },
    { id: 'lifestyle', label: 'Lifestyle Habits', icon: <Clock size={16} /> },
    { id: 'medical', label: 'Clinical Advice', icon: <Stethoscope size={16} /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">Lifestyle Recommendations</h1>
          <p className="text-slate-505 text-xs sm:text-sm">Personalized plan optimized for your hormonal screening profile.</p>
        </div>
        
        <span className={`inline-block px-3 py-1 text-xs font-extrabold rounded-lg border uppercase tracking-wider ${prediction.risk_level === 'High' ? 'text-red-600 bg-red-50 border-red-150' : prediction.risk_level === 'Moderate' ? 'text-amber-600 bg-amber-50 border-amber-150' : 'text-emerald-600 bg-emerald-50 border-emerald-150'}`}>
          {prediction.risk_level} Risk
        </span>
      </div>

      {/* Accordion Tabs selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center space-x-2 py-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === tab.id ? 'bg-brand-pink-50 border-brand-pink-300 text-brand-pink-600 shadow-sm font-extrabold' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Panel */}
      <div className="glass-card p-6 sm:p-8 animate-fadeIn">
        {activeTab === 'diet' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Diet & Nutrition Guidelines</h3>
            <div className="space-y-4">
              {recommendations.diet.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-brand-pink-500 shrink-0 mt-2"></span>
                  <span className="text-xs sm:text-sm text-slate-650 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Physical Fitness Adjustments</h3>
            <div className="space-y-4">
              {recommendations.exercise.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-brand-indigo-500 shrink-0 mt-2"></span>
                  <span className="text-xs sm:text-sm text-slate-650 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Lifestyle Habits & Stress Remedies</h3>
            <div className="space-y-4">
              {recommendations.lifestyle.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-brand-purple-500 shrink-0 mt-2"></span>
                  <span className="text-xs sm:text-sm text-slate-650 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800">Medical Advice Suggestions</h3>
              {recommendations.medical.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 border border-red-100 rounded-xl leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-2"></span>
                  <span className="text-xs sm:text-sm text-slate-650 font-bold">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Submit a query to clinical specialists?</h4>
                <p className="text-xs text-slate-450 mt-0.5">Write details directly to approved fertility experts and gynecologists.</p>
              </div>
              <Link to="/doctor" className="shrink-0 w-full sm:w-auto">
                <Button variant="secondary" className="w-full text-xs">Consult Doctor</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[10px] sm:text-xs text-center leading-relaxed">
        *Recommendations represent lifestyle metrics for metabolic recovery. They do not substitute clinical treatments.
      </div>
    </div>
  );
}
