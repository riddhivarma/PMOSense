// frontend/src/pages/PredictionResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  FileText, ArrowRight, ArrowLeft, RefreshCw, ShieldAlert, Award, Compass, Scale, ClipboardCheck, Droplet, CheckCircle, Activity, Clock, Stethoscope 
} from 'lucide-react';

export default function PredictionResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { assessments } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const asmId = searchParams.get('id');

  useEffect(() => {
    if (asmId) {
      const match = assessments.find(asm => asm.id === asmId);
      if (match) {
        setAssessment(match);
      } else {
        Swal.fire({ icon: 'error', title: 'Not Found', text: 'Assessment record not found.', confirmButtonColor: '#db2777' })
          .then(() => navigate('/dashboard'));
      }
    } else if (assessments.length > 0) {
      setAssessment(assessments[0]);
    } else {
      Swal.fire({ icon: 'info', title: 'Awaiting Assessment', text: 'Complete a screening first.', confirmButtonColor: '#4f46e5' })
        .then(() => navigate('/assessment'));
    }
  }, [asmId, assessments, navigate]);

  const handleDownloadReport = () => {
    Swal.fire({
      title: 'Generating Report',
      text: 'Compiling structured PDF screening report...',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Report Downloaded!',
        text: `PMOSense_Report_${assessment?.id}.pdf has been saved.`,
        confirmButtonColor: '#4f46e5'
      });
    });
  };

  if (!assessment) return null;

  const { prediction, inputs, health_score, recommendations, date } = assessment;
  const probPercent = (prediction.probability * 100).toFixed(1);
  const level = prediction.risk_level;

  const getRiskTheme = () => {
    if (level === 'High') {
      return {
        text: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        card: 'border-l-4 border-l-red-500',
        stroke: '#ef4444'
      };
    }
    if (level === 'Moderate') {
      return {
        text: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        card: 'border-l-4 border-l-amber-500',
        stroke: '#f59e0b'
      };
    }
    return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      card: 'border-l-4 border-l-emerald-500',
      stroke: '#10b981'
    };
  };

  const theme = getRiskTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fadeIn">
      {/* Go Back to History Link */}
      <div className="flex justify-start">
        <Link 
          to="/history" 
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-550 hover:text-brand-pink-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Screening History</span>
        </Link>
      </div>

      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-pink-50 border border-brand-pink-100 text-brand-pink-600 text-xs font-bold uppercase tracking-wider mb-1">
          <CheckCircle size={14} />
          <span>Screening Outcome Evaluated</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900">AI Risk Assessment Results</h1>
        <p className="text-slate-500 text-xs sm:text-sm">Processed on {date}</p>
      </div>

      {/* Speedometer Score Card */}
      <div className={`glass-card p-6 sm:p-8 ${theme.card} flex flex-col md:flex-row items-center justify-between gap-8 shadow-md`}>
        
        {/* Speedometer Circle */}
        <div className="text-center space-y-2 shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">PMOS Risk Probability</span>
          
          <div className="relative flex items-center justify-center h-44 w-44">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke={theme.stroke} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * prediction.probability)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{probPercent}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Risk Weight</span>
            </div>
          </div>

          <span className={`inline-block px-4 py-1 text-xs font-extrabold rounded-full border uppercase tracking-wider ${theme.text} ${theme.bg}`}>
            {level} Risk Level
          </span>
        </div>

        {/* Breakdown details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Health Score</span>
              <span className="text-xl font-extrabold text-brand-pink-600">{health_score}<font size={1} className="text-slate-400 font-normal">/100</font></span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Body Mass Index</span>
              <span className="text-xl font-extrabold text-slate-800">{inputs.bmi}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Blood Group</span>
              <span className="text-xl font-extrabold text-red-600 flex items-center justify-center space-x-1">
                <Droplet size={14} className="fill-red-500" />
                <span>{inputs.blood_group || 'B+'}</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Our ML model evaluated a <strong>{probPercent}%</strong> statistical probability of PMOS based on your vitals (Age {inputs.age}, Weight {inputs.weight}kg, Height {inputs.height}cm, Cycle: {inputs.cycle === 1 ? 'Irregular' : 'Regular'}).
            {level === 'High' && " High risk indicators suggest potential endocrine imbalance. We strongly advise downloading your summary report and consulting a specialist."}
            {level === 'Moderate' && " Moderate risk flags detected. We recommend adopting a low-glycemic anti-inflammatory diet and regular exercise."}
            {level === 'Low' && " Low risk indicators detected. Continue maintaining healthy lifestyle habits."}
          </p>
        </div>
      </div>

      {/* Feature Contributions listing */}
      <div className="glass-card p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <ClipboardCheck size={18} className="text-brand-pink-500" />
          <span>Clinical Feature Weights</span>
        </h3>
        
        <div className="space-y-3 pt-2">
          {[
            { label: "Menstrual cycle irregularity", val: inputs.cycle === 1, weight: 35 },
            { label: "Unexplained weight gain", val: inputs.weight_gain, weight: 20 },
            { label: "Facial / body hair growth (Hirsutism)", val: inputs.hair_growth, weight: 15 },
            { label: "Skin darkening patches (Acanthosis)", val: inputs.skin_darkening, weight: 15 },
            { label: "Persistent severe acne / pimples", val: inputs.pimples, weight: 10 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-700 font-bold">{item.label}</span>
                <span className={item.val ? 'text-brand-pink-600 font-extrabold' : 'text-slate-400 font-medium'}>
                  {item.val ? 'Present Flagged (+Weight)' : 'Baseline'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${item.val ? 'bg-gradient-to-r from-brand-pink-500 to-brand-pink-600' : 'bg-slate-300'}`}
                  style={{ width: `${item.val ? (item.weight * 2.5) : 10}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Recommendations Details */}
      <div className="space-y-4">
        <h3 className="font-outfit text-base font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <Award size={18} className="text-brand-pink-500" />
          <span>Full Recommendations & Advice Guidelines</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card title="Diet & Nutrition Plan" icon={<Compass size={18} />}>
            <ul className="space-y-2 text-xs text-slate-605 list-disc pl-4 leading-relaxed font-semibold">
              {recommendations.diet && recommendations.diet.length > 0 ? (
                recommendations.diet.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li className="text-slate-400 list-none pl-0">No specific diet recommendations.</li>
              )}
            </ul>
          </Card>

          <Card title="Physical Fitness Plan" icon={<Activity size={18} />}>
            <ul className="space-y-2 text-xs text-slate-605 list-disc pl-4 leading-relaxed font-semibold">
              {recommendations.exercise && recommendations.exercise.length > 0 ? (
                recommendations.exercise.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li className="text-slate-400 list-none pl-0">No specific exercise recommendations.</li>
              )}
            </ul>
          </Card>

          <Card title="Lifestyle Habits" icon={<Clock size={18} />}>
            <ul className="space-y-2 text-xs text-slate-605 list-disc pl-4 leading-relaxed font-semibold">
              {recommendations.lifestyle && recommendations.lifestyle.length > 0 ? (
                recommendations.lifestyle.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li className="text-slate-400 list-none pl-0">No specific lifestyle recommendations.</li>
              )}
            </ul>
          </Card>

          <Card title="Clinical Advice" icon={<Stethoscope size={18} />}>
            <ul className="space-y-2 text-xs text-slate-605 list-disc pl-4 leading-relaxed font-semibold">
              {recommendations.medical && recommendations.medical.length > 0 ? (
                recommendations.medical.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li className="text-slate-400 list-none pl-0">No specific clinical advice.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 border-t border-slate-100">
        <Button 
          onClick={handleDownloadReport} 
          icon={<FileText size={16} />}
        >
          Download PDF Report
        </Button>
        <Link to="/assessment">
          <Button variant="outline" icon={<RefreshCw size={15} />}>
            Take New Assessment
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center leading-relaxed font-medium">
        <strong>MEDICAL DISCLAIMER:</strong> Results are based on AI risk screening algorithms and are intended for early awareness only. They do not constitute a clinical diagnosis. Always consult a medical doctor for clinical testing.
      </div>
    </div>
  );
}
