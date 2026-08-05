// frontend/src/pages/UserDashboardPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  Activity, Scale, ShieldAlert, Award, Calendar, PlusCircle, ArrowRight, BookOpen, Stethoscope, User, History
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, assessments } = useAuth();
  const navigate = useNavigate();

  const userAssessments = assessments.filter(asm => asm.user_id === user.id);
  const latestAssessment = userAssessments[0];
  const hasHistory = userAssessments.length > 0;

  // Compile trend coordinates for charts
  const compiledTrends = [...userAssessments].reverse().map(asm => ({
    date: asm.date.split(',')[0],
    probability: Math.round(asm.prediction.probability * 100),
    bmi: asm.inputs.bmi
  }));

  const getRiskColor = (level) => {
    if (level === 'High') return 'red';
    if (level === 'Moderate') return 'amber';
    return 'green';
  };

  const getBMIStatus = (val) => {
    if (!val) return 'No Vitals';
    if (val < 18.5) return 'Underweight';
    if (val < 25.0) return 'Normal Weight';
    if (val < 30.0) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome Card Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">Track your cycle, monitor key indicators, and keep up with your hormonal milestones.</p>
        </div>
        <Link to="/assessment">
          <Button icon={<PlusCircle size={16} />} className="w-full sm:w-auto">New Assessment</Button>
        </Link>
      </div>

      {/* 2. Metrics Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Latest Risk Level"
          value={hasHistory ? latestAssessment.prediction.risk_level : "No Data"}
          subtitle={hasHistory ? `Confidence: ${latestAssessment.prediction.confidence_score}%` : "No assessments taken yet"}
          icon={<ShieldAlert size={20} />}
          color={hasHistory ? getRiskColor(latestAssessment.prediction.risk_level) : "pink"}
        />

        <DashboardCard
          title="Current BMI"
          value={user?.bmi ? user.bmi : "No Data"}
          subtitle={user?.bmi ? getBMIStatus(user.bmi) : "Weight & Height details required"}
          icon={<Scale size={20} />}
          color="indigo"
        />

        <DashboardCard
          title="Hormonal Health Score"
          value={hasHistory ? `${latestAssessment.health_score}/100` : "No Data"}
          subtitle={hasHistory ? "Higher score represents lower risks" : "Complete assessment to update"}
          icon={<Award size={20} />}
          color="purple"
        />

        <DashboardCard
          title="Assessment Date"
          value={hasHistory ? latestAssessment.date.split(',')[0] : "No Data"}
          subtitle={hasHistory ? "Last screening log" : "Awaiting first assessment"}
          icon={<Calendar size={20} />}
          color="amber"
          onClick={hasHistory ? () => navigate(`/prediction?id=${latestAssessment.id}`) : null}
        />
      </div>

      {/* 3. Quick Actions Panel */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pl-1">Quick Console Navigation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "PMOS Assessment", desc: "Start screening", path: "/assessment", icon: <Activity size={18} className="text-brand-pink-500" /> },
            { label: "Screening History", desc: "Past assessments", path: "/history", icon: <History size={18} className="text-brand-indigo-500" /> },
            { label: "Lifestyle Guidelines", desc: "Custom recovery advice", path: "/recommendations", icon: <Award size={18} className="text-brand-purple-500" /> },
            { label: "Consult Doctor", desc: "Ask medical queries", path: "/doctor", icon: <Stethoscope size={18} className="text-brand-indigo-500" /> },
            { label: "Edit your profile", desc: "manage your details", path: "/profile", icon: <User size={18} className="text-brand-pink-500" /> }
          ].map((item, i) => (
            <Link 
              key={i} 
              to={item.path}
              className="p-4 rounded-xl bg-white border border-slate-150 hover:border-brand-pink-300 hover:shadow-sm hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[110px]"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mb-3 shadow-xs">
                {item.icon}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800 leading-tight mb-0.5">{item.label}</span>
                <span className="block text-[10px] text-slate-400 font-semibold">{item.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Trends Analytics Section */}
      {hasHistory && compiledTrends.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Risk Probability area graph */}
          <Card title="Hormonal Risk Log (%)" icon={<Activity size={16} />}>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compiledTrends}>
                  <defs>
                    <linearGradient id="riskGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#db2777" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="probability" name="Risk %" stroke="#db2777" strokeWidth={2} fillOpacity={1} fill="url(#riskGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* BMI Log progression */}
          <Card title="BMI Progression Log" icon={<Scale size={16} />}>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={compiledTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bmi" name="BMI" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Awaiting initial assessment view */}
      {!hasHistory && (
        <Card title="Complete Your Initial Screening" icon={<ShieldAlert className="text-brand-pink-500" />}>
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
            <h4 className="text-sm font-bold text-slate-800">You haven't completed any assessments yet</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              PMOSense requires vitals (age, height, weight) and clinical signs (menstrual cycles, acne levels, hirsutism indicators) to evaluate your profile risk.
            </p>
            <Link to="/assessment">
              <Button>Start Assessment Wizard</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
