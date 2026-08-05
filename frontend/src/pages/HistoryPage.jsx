// frontend/src/pages/HistoryPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { History, Search, Filter, Trash2, Eye, Calendar, Award, Droplet } from 'lucide-react';

export default function HistoryPage() {
  const { assessments, user, deleteAssessment } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const userAsms = assessments.filter(asm => asm.user_id === user?.id);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete screening entry?',
      text: "This record will be permanently deleted from your profile history log.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAssessment(id);
        Swal.fire('Deleted!', 'Assessment entry has been deleted.', 'success');
      }
    });
  };

  const getRiskColor = (level) => {
    if (level === 'High') return 'text-red-650 bg-red-50 border-red-150';
    if (level === 'Moderate') return 'text-amber-650 bg-amber-50 border-amber-150';
    return 'text-emerald-600 bg-emerald-50 border-emerald-150';
  };

  const filteredAssessments = userAsms.filter(asm => {
    const matchesSearch = asm.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = riskFilter === 'All' || asm.prediction.risk_level === riskFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">Assessment History</h1>
        <p className="text-slate-500 text-xs sm:text-sm">Audit previous hormonal screenings and risk progression logs.</p>
      </div>

      {/* Filter panel */}
      <div className="glass-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center shadow-xs">
        
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search by date (e.g. Jul 2026)..."
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={15} />}
            className="w-full"
          />
        </div>

        {/* Filter Dropdown */}
        <Dropdown
          options={[
            { value: 'All', label: 'All Risk Levels' },
            { value: 'High', label: 'High Risk' },
            { value: 'Moderate', label: 'Moderate Risk' },
            { value: 'Low', label: 'Low Risk' }
          ]}
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        />
      </div>

      {/* Timeline List of Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="relative pl-6 border-l-2 border-slate-200/60 space-y-6 ml-2 pt-2 pb-2">
          {filteredAssessments.map((asm) => (
            <div key={asm.id} className="relative">
              {/* Timeline bubble */}
              <span className="absolute -left-[31px] top-4 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink-500 ring-4 ring-white shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
              </span>

              <div className="glass-card p-5 hover:shadow-md transition-shadow relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Info block */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                    <Calendar size={13} />
                    <span>{asm.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${getRiskColor(asm.prediction.risk_level)}`}>
                      {asm.prediction.risk_level} Risk
                    </span>
                    <span className="text-xs text-slate-600 font-bold">
                      Health Index: <font className="text-brand-pink-600">{asm.health_score}/100</font>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Parameters: Age {asm.inputs.age}, Weight {asm.inputs.weight}kg, BMI {asm.inputs.bmi}, Blood Group: <strong className="text-slate-700">{asm.inputs.blood_group || 'B+'}</strong>, Cycle: {asm.inputs.cycle === 1 ? 'Irregular' : 'Regular'}.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t border-slate-100/50 pt-3 sm:pt-0 sm:border-t-0 shrink-0">
                  <Button 
                    size="sm" 
                    icon={<Eye size={13} />} 
                    onClick={() => navigate(`/prediction?id=${asm.id}`)}
                    className="w-full sm:w-auto text-xs"
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Trash2 size={13} />} 
                    onClick={() => handleDelete(asm.id)}
                    className="w-full sm:w-auto text-xs py-2 px-3 text-red-550 border-slate-200 hover:border-red-300 hover:text-red-650 hover:bg-red-50/50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-400 font-semibold border-dashed border-2 border-slate-200">
          <History size={24} className="mx-auto text-slate-350 mb-2" />
          <span>No matching screening assessment records found.</span>
        </div>
      )}
    </div>
  );
}
