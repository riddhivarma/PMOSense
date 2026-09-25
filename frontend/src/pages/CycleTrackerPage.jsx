// frontend/src/pages/CycleTrackerPage.jsx
import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import { 
  Calendar, CalendarDays, Droplet, Activity, ShieldAlert, 
  Download, PlusCircle, Trash2, Info, ChevronLeft, ChevronRight,
  Heart, Sparkles, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Severe Cramps', 'Fever', 'Vomiting', 'Nausea', 
  'Headache', 'Bloating', 'Mood Swings', 'Fatigue', 
  'Acne Flare-up', 'Lower Back Pain'
];

const getEffectiveEndDate = (c) => {
  if (!c) return '';
  if (c.end_date && c.end_date !== 'Ongoing') return c.end_date;
  if (!c.start_date) return '';
  try {
    const d = new Date(c.start_date);
    const dur = parseInt(c.period_duration) || 5;
    d.setDate(d.getDate() + (dur - 1));
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export default function CycleTrackerPage() {
  const { user, cycles, cycleStats, addCycle, deleteCycle } = useAuth();

  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState('Medium');
  const [painLevel, setPainLevel] = useState(2);
  const [padsPerDay, setPadsPerDay] = useState(3);
  const [additionalIssues, setAdditionalIssues] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Calendar View State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedCycleDetails, setSelectedCycleDetails] = useState(null);

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (val) {
      // Auto-set 5 days default duration (start date + 4 days) using UTC to prevent timezone offsets
      const d = new Date(val);
      d.setUTCDate(d.getUTCDate() + 4);
      setEndDate(d.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  };

  // Derived Month Name for Form
  const formMonthName = useMemo(() => {
    if (!startDate) {
      return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const d = new Date(startDate);
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [startDate]);

  // Toggle symptom tag
  const handleToggleSymptom = (symptom) => {
    let updated;
    if (selectedSymptoms.includes(symptom)) {
      updated = selectedSymptoms.filter(s => s !== symptom);
    } else {
      updated = [...selectedSymptoms, symptom];
    }
    setSelectedSymptoms(updated);

    // Merge with text
    const customText = additionalIssues
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !COMMON_SYMPTOMS.includes(s))
      .join(', ');

    const combined = updated.length > 0 
      ? (customText ? `${updated.join(', ')}, ${customText}` : updated.join(', '))
      : customText;

    setAdditionalIssues(combined);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Start Date Required',
        text: 'Please select the date your period started this month.',
        confirmButtonColor: '#db2777'
      });
      return;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date Range',
        text: 'Period end date cannot be earlier than start date.',
        confirmButtonColor: '#db2777'
      });
      return;
    }

    // Auto-calculate end_date using 5-day rule (start date + 4 days) if left blank
    let finalEndDate = endDate;
    if (!finalEndDate && startDate) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + 4);
      finalEndDate = d.toISOString().split('T')[0];
    }

    setLoading(true);

    try {
      await addCycle({
        start_date: startDate,
        end_date: finalEndDate,
        flow,
        pain_level: parseInt(painLevel),
        pads_per_day: parseInt(padsPerDay),
        additional_issues: additionalIssues.trim()
      });

      Swal.fire({
        icon: 'success',
        title: 'Cycle Details Logged!',
        text: 'Your menstrual cycle records have been updated successfully.',
        confirmButtonColor: '#db2777'
      });

      // Reset form
      setStartDate('');
      setEndDate('');
      setFlow('Medium');
      setPainLevel(2);
      setPadsPerDay(3);
      setAdditionalIssues('');
      setSelectedSymptoms([]);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Logging Cycle',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#db2777'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a logged cycle
  const handleDeleteCycle = (cycleId) => {
    Swal.fire({
      title: 'Delete this cycle record?',
      text: 'This will remove the entry from your monthly history and update your cycle metrics.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCycle(cycleId);
        if (selectedCycleDetails?.cycle_id === cycleId) {
          setSelectedCycleDetails(null);
        }
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Cycle entry has been removed.',
          confirmButtonColor: '#db2777'
        });
      }
    });
  };

  // Download PDF Report
  const handleDownloadPdf = () => {
    if (!cycles || cycles.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Cycle Records Found',
        text: 'Please log at least one cycle entry to generate a downloadable PDF report.',
        confirmButtonColor: '#db2777'
      });
      return;
    }

    setDownloadingPdf(true);
    const token = localStorage.getItem('pmosense_token');
    const baseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
    const downloadUrl = `${baseUrl}/cycle/pdf?token=${token}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.setAttribute('download', `PMOSense_Cycle_History_${user?.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingPdf(false);
      Swal.fire({
        icon: 'success',
        title: 'Download Initialized',
        text: 'Your 6-month Menstrual Cycle History PDF report has been generated.',
        confirmButtonColor: '#db2777',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  };

  // Calendar Helpers
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthName = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentCalendarDate(new Date());
  };

  // Generate calendar grid dates
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty lead slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ key: `blank-${i}`, isBlank: true });
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cellDate = new Date(year, month, d);

      // Check if this date falls inside any logged cycle
      const matchingCycle = cycles.find(c => {
        if (!c.start_date) return false;
        const start = new Date(c.start_date);
        const effEnd = getEffectiveEndDate(c);
        const end = effEnd ? new Date(effEnd) : new Date(start);
        return cellDate >= start && cellDate <= end;
      });

      // Check if this date is part of predicted next cycle window
      let isPredicted = false;
      if (cycleStats.next_predicted_period) {
        const predStart = new Date(cycleStats.next_predicted_period);
        const predEnd = new Date(predStart);
        predEnd.setDate(predEnd.getDate() + (cycleStats.avg_duration ? Math.round(cycleStats.avg_duration) - 1 : 4));
        isPredicted = cellDate >= predStart && cellDate <= predEnd;
      }

      const isToday = new Date().toDateString() === cellDate.toDateString();

      days.push({
        key: `day-${d}`,
        dayNum: d,
        dateStr,
        isPeriod: !!matchingCycle,
        cycleData: matchingCycle || null,
        isPredicted,
        isToday,
        isBlank: false
      });
    }

    return days;
  }, [year, month, cycles, cycleStats]);

  const painLabels = {
    1: 'Mild / None',
    2: 'Mild Discomfort',
    3: 'Moderate Cramps',
    4: 'Severe Pain',
    5: 'Debilitating / Bedrest'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="p-2 rounded-xl bg-brand-pink-50 text-brand-pink-600 border border-brand-pink-100">
              <CalendarHeartIcon size={24} />
            </span>
            <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Track My Cycles
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            Log monthly periods, track pain intensity & flow, and monitor regularity metrics for accurate PMOS screening.
          </p>
        </div>

        <Button
          onClick={handleDownloadPdf}
          loading={downloadingPdf}
          variant="outline"
          className="border-brand-pink-300 text-brand-pink-600 hover:bg-brand-pink-50 hover:border-brand-pink-400 font-bold self-start md:self-auto shadow-sm"
          icon={<Download size={16} />}
        >
          Download Cycle History (PDF)
        </Button>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Average Cycle Length */}
        <div className="glass-card p-5 border-l-4 border-l-brand-pink-500 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Cycle Length</span>
            <span className="p-1.5 rounded-lg bg-brand-pink-50 text-brand-pink-600">
              <Clock size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-outfit text-3xl font-black text-slate-800">
              {cycleStats.avg_cycle_length ? `${cycleStats.avg_cycle_length}` : '--'}
            </span>
            <span className="text-sm font-semibold text-slate-500">Days</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {cycles.length >= 2 
              ? `Computed over ${cycles.length} recorded cycles` 
              : 'Log at least 2 cycles to calculate variance'}
          </p>
        </div>

        {/* KPI 2: Cycle Regularity */}
        <div className="glass-card p-5 border-l-4 border-l-brand-indigo-500 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cycle Regularity</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Activity size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              cycleStats.cycle_regularity?.includes('Regular')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : cycleStats.cycle_regularity?.includes('Irregular')
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {cycleStats.cycle_regularity || 'Baseline'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Rotterdam Marker: Intervals &gt; 35 days indicate oligomenorrhea.
          </p>
        </div>

        {/* KPI 3: Next Predicted Period */}
        <div className="glass-card p-5 border-l-4 border-l-purple-500 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Predicted Period</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-outfit text-xl font-bold text-slate-800">
              {cycleStats.next_predicted_period 
                ? new Date(cycleStats.next_predicted_period).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Insufficient history'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Estimated from your historical cycle intervals
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Entry Form (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <div>
              <h2 className="font-outfit text-lg font-bold text-slate-800">Log Period Details</h2>
              <p className="text-xs text-slate-400">Enter menstruation start and symptom logs</p>
            </div>
            {formMonthName && (
              <span className="px-2.5 py-1 rounded-lg bg-brand-pink-50 border border-brand-pink-100 text-[11px] font-bold text-brand-pink-600">
                {formMonthName}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start & End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  End Date <span className="text-slate-400 font-normal">(Auto-calculated)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500 bg-white"
                />
                <span className="text-[10px] text-brand-pink-600 font-medium block mt-0.5">
                  Defaults to 5-day duration (editable)
                </span>
              </div>
            </div>

            {/* Flow Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Menstrual Flow Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Light', 'Medium', 'Heavy'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFlow(item)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      flow === item
                        ? 'bg-brand-pink-50 border-brand-pink-400 text-brand-pink-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-brand-pink-500">
                      {item === 'Light' ? '💧' : item === 'Medium' ? '💧💧' : '💧💧💧'}
                    </span>
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pain Level Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Pain / Cramps Level: <span className="text-brand-pink-600 font-bold">{painLevel} / 5</span>
                </label>
                <span className="text-xs font-bold text-slate-500">{painLabels[painLevel]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={painLevel}
                onChange={(e) => setPainLevel(e.target.value)}
                className="w-full accent-brand-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-0.5">
                <span>1 - Mild</span>
                <span>3 - Moderate</span>
                <span>5 - Severe</span>
              </div>
            </div>

            {/* Avg Pads Per Day */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Avg. Pads / Tampons Used Per Day
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={padsPerDay}
                onChange={(e) => setPadsPerDay(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500 bg-white"
              />
            </div>

            {/* Additional Symptoms & Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Additional Symptoms Experienced
              </label>
              
              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_SYMPTOMS.map((symp) => {
                  const isSelected = selectedSymptoms.includes(symp);
                  return (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => handleToggleSymptom(symp)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{symp}
                    </button>
                  );
                })}
              </div>

              {/* Freeform notes textarea */}
              <textarea
                rows={2}
                placeholder="Type any other symptoms (fever, vomiting, severe bloating, migraines...)"
                value={additionalIssues}
                onChange={(e) => setAdditionalIssues(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500 bg-white"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full font-bold shadow-md shadow-brand-pink-550/20"
              icon={<PlusCircle size={16} />}
            >
              Save Cycle Entry
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN: Interactive Calendar & Inspection Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Calendar Card */}
          <div className="glass-card p-6 shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-brand-pink-50 text-brand-pink-600">
                  <CalendarDays size={18} />
                </span>
                <h3 className="font-outfit text-base font-bold text-slate-800">
                  {monthName}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={jumpToToday}
                  className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-brand-pink-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarGrid.map((item) => {
                if (item.isBlank) {
                  return <div key={item.key} className="h-10 sm:h-12 rounded-xl bg-transparent" />;
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (item.isPeriod && item.cycleData) {
                        setSelectedCycleDetails(item.cycleData);
                      }
                    }}
                    className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer ${
                      item.isPeriod
                        ? 'bg-gradient-to-tr from-brand-pink-500 to-rose-500 text-white font-black shadow-sm shadow-brand-pink-500/30 hover:scale-105 active:scale-95'
                        : item.isPredicted
                        ? 'border-2 border-dashed border-brand-pink-400 bg-pink-50/70 text-brand-pink-700 font-bold hover:bg-pink-100'
                        : item.isToday
                        ? 'border border-brand-pink-400 bg-slate-50 text-brand-pink-600 font-bold'
                        : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{item.dayNum}</span>
                    {item.isPeriod && (
                      <span className="h-1 w-1 rounded-full bg-white mt-0.5 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-md bg-brand-pink-500 inline-block shrink-0" />
                <span>Menstruation Days</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-md border-2 border-dashed border-brand-pink-400 bg-pink-50 inline-block shrink-0" />
                <span>Predicted Upcoming Cycle</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-md border border-brand-pink-400 bg-white inline-block shrink-0" />
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Inspected Day Details Card */}
          {selectedCycleDetails ? (
            <div className="glass-card p-5 border border-brand-pink-200 bg-gradient-to-br from-pink-50/40 to-white shadow-sm animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-pink-100 text-brand-pink-700 uppercase tracking-wider">
                    Logged Cycle Record
                  </span>
                  <h4 className="font-outfit text-base font-extrabold text-slate-800 mt-1">
                    {new Date(selectedCycleDetails.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' - '}
                    {new Date(getEffectiveEndDate(selectedCycleDetails)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bleeding Duration: <span className="font-bold text-slate-700">{selectedCycleDetails.period_duration || 5} Days</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCycle(selectedCycleDetails.cycle_id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete this cycle entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Flow Intensity</span>
                  <span className="text-xs font-bold text-slate-800">{selectedCycleDetails.flow || 'Medium'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Pain Level</span>
                  <span className="text-xs font-bold text-brand-pink-600">{selectedCycleDetails.pain_level || 2} / 5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Pads / Day</span>
                  <span className="text-xs font-bold text-slate-800">{selectedCycleDetails.pads_per_day || 3}</span>
                </div>
              </div>

              {/* Symptoms / Notes */}
              {selectedCycleDetails.additional_issues && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Symptoms & Issues Reported</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedCycleDetails.additional_issues}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              💡 Tip: Click on any pink menstruation day on the calendar to view its logged symptoms and flow details.
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Full History Table */}
      <div className="glass-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-800">Recent Cycle Logs</h3>
            <p className="text-xs text-slate-400">Chronological audit of logged menstrual entries</p>
          </div>
          <span className="text-xs font-bold text-brand-pink-600 bg-brand-pink-50 px-2.5 py-1 rounded-lg">
            {cycles.length} Entries Recorded
          </span>
        </div>

        {cycles.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No cycle records logged yet. Use the form above to log your first menstruation date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Start Date</th>
                  <th className="py-2.5 px-3">End Date</th>
                  <th className="py-2.5 px-3">Bleeding Days</th>
                  <th className="py-2.5 px-3">Flow</th>
                  <th className="py-2.5 px-3">Pain Rating</th>
                  <th className="py-2.5 px-3">Pads / Day</th>
                  <th className="py-2.5 px-3">Symptoms Logged</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cycles.map((c) => (
                  <tr key={c.cycle_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{c.start_date}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{getEffectiveEndDate(c)}</td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">{c.period_duration || 5} days</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold text-[10px]">
                        {c.flow || 'Medium'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{c.pain_level || 2} / 5</td>
                    <td className="py-3 px-3 text-slate-600">{c.pads_per_day || 3}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={c.additional_issues}>
                      {c.additional_issues || 'None'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCycle(c.cycle_id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icon component
function CalendarHeartIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
      <path d="M12 14.5c-.8-1-2.2-1.3-3.1-.4-.9.9-.9 2.4 0 3.3l3.1 3.1 3.1-3.1c.9-.9.9-2.4 0-3.3-.9-.9-2.3-.6-3.1.4z"/>
    </svg>
  );
}
