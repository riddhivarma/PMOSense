// frontend/src/pages/AssessmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { Activity, ShieldAlert, RotateCcw, ClipboardCheck, Scale, Droplet } from 'lucide-react';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { user, addAssessment } = useAuth();

  // Form State
  const [age, setAge] = useState(user?.age || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'Not set');
  const [cycle, setCycle] = useState('0'); // 0 = Regular, 1 = Irregular
  const [cycleLength, setCycleLength] = useState('28');
  
  // Symptoms states (Yes = true, No = false)
  const [weightGain, setWeightGain] = useState(false);
  const [hairGrowth, setHairGrowth] = useState(false);
  const [hairLoss, setHairLoss] = useState(false);
  const [skinDarkening, setSkinDarkening] = useState(false);
  const [pimples, setPimples] = useState(false);
  const [fastFood, setFastFood] = useState(false);
  const [regExercise, setRegExercise] = useState(true);

  const [loading, setLoading] = useState(false);
  const [computedBmi, setComputedBmi] = useState(null);

  // Auto calculate BMI
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w && h && h > 0) {
      setComputedBmi((w / ((h / 100) ** 2)).toFixed(2));
    } else {
      setComputedBmi(null);
    }
  }, [weight, height]);

  const handleReset = () => {
    setAge(user?.age || '');
    setHeight('');
    setWeight('');
    setBloodGroup('Not set');
    setCycle('0');
    setCycleLength('28');
    setWeightGain(false);
    setHairGrowth(false);
    setHairLoss(false);
    setSkinDarkening(false);
    setPimples(false);
    setFastFood(false);
    setRegExercise(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!age || !height || !weight || !cycleLength) {
      Swal.fire({ icon: 'warning', title: 'Input Error', text: 'All demographic and vital fields are required.', confirmButtonColor: '#db2777' });
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const cycleLenNum = parseInt(cycleLength);

    if (isNaN(ageNum) || ageNum < 15 || ageNum > 55) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Age must be between 15 and 55 years.', confirmButtonColor: '#db2777' });
      return;
    }
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 220) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Height must be between 100 and 220 cm.', confirmButtonColor: '#db2777' });
      return;
    }
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 180) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Weight must be between 30 and 180 kg.', confirmButtonColor: '#db2777' });
      return;
    }
    if (isNaN(cycleLenNum) || cycleLenNum < 15 || cycleLenNum > 120) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Menstrual cycle length must be between 15 and 120 days.', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const result = await addAssessment({
          age: ageNum,
          height: heightNum,
          weight: weightNum,
          blood_group: bloodGroup,
          cycle: parseInt(cycle),
          cycle_length: cycleLenNum,
          weight_gain: weightGain,
          hair_growth: hairGrowth,
          hair_loss: hairLoss,
          skin_darkening: skinDarkening,
          pimples,
          fast_food: fastFood,
          reg_exercise: regExercise
        });

        Swal.fire({
          icon: 'success',
          title: 'Assessment Complete!',
          text: 'AI risk evaluation successfully computed.',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
          navigate(`/prediction?id=${result.id}`);
        });

      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to Process', text: err.message || 'Error processing inputs.', confirmButtonColor: '#db2777' });
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-pink-50 border border-brand-pink-100 text-brand-pink-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Activity size={14} />
          <span>Core Screening Module</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          PMOS Risk Screening Assessment
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Complete the clinical parameters below to evaluate early hormonal risk factors.
        </p>
      </div>

      {/* Warning Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3 shadow-xs">
        <ShieldAlert size={18} className="shrink-0 mt-0.5 text-amber-600" />
        <p className="leading-relaxed font-medium">
          <strong>MEDICAL DISCLAIMER:</strong> This assessment tool evaluates early statistical risk indicators for Polyendocrine Metabolic Ovarian Syndrome (PMOS). It is intended for early screening only and <strong>does not substitute clinical medical diagnosis</strong>. Always consult a qualified physician for clinical blood tests or pelvic ultrasounds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-8 shadow-md">
        
        {/* Section 1: Demographics & Physical Vitals */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-2">
            <ClipboardCheck size={16} className="text-brand-pink-500" />
            <span>1. Physical Vitals & Demographics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Age (Years)"
              name="age"
              type="number"
              placeholder="Calculated from DOB"
              value={age}
              disabled
              required
            />
            <Input
              label="Height (cm)"
              name="height"
              type="number"
              placeholder="e.g. 162"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              placeholder="e.g. 68"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <Dropdown
              label="Blood Group"
              name="bloodGroup"
              options={["Not set", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            />
          </div>

          {computedBmi && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex justify-between items-center text-xs sm:text-sm font-semibold">
              <span className="text-slate-650 flex items-center space-x-2">
                <Scale size={16} className="text-brand-indigo-500" />
                <span>Calculated Body Mass Index (BMI):</span>
              </span>
              <span className="text-sm font-extrabold text-brand-pink-600 bg-brand-pink-50 border border-brand-pink-100 px-3.5 py-1 rounded-xl">
                {computedBmi} ({computedBmi < 18.5 ? "Underweight" : computedBmi < 25.0 ? "Normal" : computedBmi < 30.0 ? "Overweight" : "Obese"})
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Menstrual Logs & Symptoms */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Activity size={16} className="text-brand-indigo-500" />
            <span>2. Menstrual Pattern & Symptoms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Dropdown
              label="Menstrual Cycle Regularity"
              name="cycle"
              options={[
                { value: '0', label: 'Regular (21-35 days window)' },
                { value: '1', label: 'Irregular / Infrequent / Absent' }
              ]}
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
            />
            <Input
              label="Average Cycle Length (Days)"
              name="cycleLength"
              type="number"
              placeholder="e.g. 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Observed Symptoms (Last 6 Months)
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Unexplained weight gain / difficulty shedding weight?", state: weightGain, setState: setWeightGain },
                { label: "Excess body or facial hair growth (Hirsutism)?", state: hairGrowth, setState: setHairGrowth },
                { label: "Hair thinning or scalp hair loss (Alopecia)?", state: hairLoss, setState: setHairLoss },
                { label: "Skin darkening patches (Acanthosis nigricans)?", state: skinDarkening, setState: setSkinDarkening },
                { label: "Persistent severe acne or pimples?", state: pimples, setState: setPimples }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-150 hover:bg-white hover:border-brand-pink-200 transition-colors">
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold pr-2">{item.label}</span>
                  
                  <div className="flex items-center space-x-4 shrink-0">
                    <label className="flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-700">
                      <input
                        type="radio"
                        checked={item.state === true}
                        onChange={() => item.setState(true)}
                        className="form-checkbox h-4 w-4 text-brand-pink-500"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-700">
                      <input
                        type="radio"
                        checked={item.state === false}
                        onChange={() => item.setState(false)}
                        className="form-checkbox h-4 w-4 text-slate-400"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Lifestyle Habits */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Activity size={16} className="text-brand-purple-500" />
            <span>3. Lifestyle & Diet Habits</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Regularly consume fast food, bakery items, or sugary carbonated drinks (3+ times/week)?", state: fastFood, setState: setFastFood },
              { label: "Perform at least 150 minutes of moderate exercise or physical activity weekly?", state: regExercise, setState: setRegExercise }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-150 hover:bg-white hover:border-brand-pink-200 transition-colors">
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold pr-2">{item.label}</span>
                
                <div className="flex items-center space-x-4 shrink-0">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-700">
                    <input
                      type="radio"
                      checked={item.state === true}
                      onChange={() => item.setState(true)}
                      className="form-checkbox h-4 w-4 text-brand-pink-500"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-700">
                    <input
                      type="radio"
                      checked={item.state === false}
                      onChange={() => item.setState(false)}
                      className="form-checkbox h-4 w-4 text-slate-400"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit / Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-100">
          <Button type="submit" loading={loading} className="w-full sm:w-auto px-8 py-3 text-base">
            Submit Assessment
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset} 
            icon={<RotateCcw size={15} />}
            disabled={loading}
            className="w-full sm:w-auto text-xs py-3 px-6"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
