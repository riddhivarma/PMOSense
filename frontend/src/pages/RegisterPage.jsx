// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import { User, Mail, Lock, FileText, UserCheck, Stethoscope, Eye, EyeOff, ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [roleTab, setRoleTab] = useState('user'); // 'user', 'doctor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // DOB & approx year for patients
  const [dob, setDob] = useState('');
  const [dontKnowDob, setDontKnowDob] = useState(false);
  const [approxYear, setApproxYear] = useState('');

  // Doctor credentials
  const [specialization, setSpecialization] = useState('Gynecologist');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Core Field Validations
    if (!name || !email || !password) {
      Swal.fire({ icon: 'warning', title: 'Input Mismatch', text: 'All core fields are required.', confirmButtonColor: '#db2777' });
      return;
    }
    
    if (password.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.', confirmButtonColor: '#db2777' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Please enter a valid email structure.', confirmButtonColor: '#db2777' });
      return;
    }

    // Patient DOB Validation
    let finalDob = dob;
    if (roleTab === 'user') {
      if (dontKnowDob) {
        if (!approxYear) {
          Swal.fire({ icon: 'warning', title: 'Missing Birth Year', text: 'Please enter your approximate birth year.', confirmButtonColor: '#db2777' });
          return;
        }
        const year = parseInt(approxYear);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < currentYear - 100 || year > currentYear) {
          Swal.fire({ icon: 'warning', title: 'Invalid Birth Year', text: 'Please enter a valid approximate birth year.', confirmButtonColor: '#db2777' });
          return;
        }
        finalDob = `${approxYear}-01-01`;
      } else {
        if (!dob) {
          Swal.fire({ icon: 'warning', title: 'Missing Date of Birth', text: 'Please enter your Date of Birth.', confirmButtonColor: '#db2777' });
          return;
        }
      }
      
      // Validate age limit (15 to 55)
      const birthDate = new Date(finalDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      if (calculatedAge < 15 || calculatedAge > 55) {
        Swal.fire({ icon: 'warning', title: 'Age Restriction', text: 'Patient registration is restricted to ages between 15 and 55 years.', confirmButtonColor: '#db2777' });
        return;
      }
    }

    if (roleTab === 'doctor') {
      if (!licenseNumber) {
        Swal.fire({ icon: 'warning', title: 'Missing License', text: 'Medical license number is required for doctor accounts.', confirmButtonColor: '#db2777' });
        return;
      }
      if (!profilePicture) {
        Swal.fire({ icon: 'warning', title: 'Missing Profile Picture', text: 'A profile picture is required for doctor registration.', confirmButtonColor: '#db2777' });
        return;
      }
    }

    setLoading(true);

    try {
      await register(name, email, password, roleTab, {
        specialization,
        license_number: licenseNumber,
        experience_years: experience,
        dob: roleTab === 'user' ? finalDob : undefined,
        profile_picture: roleTab === 'doctor' ? profilePicture : undefined
      });

      if (roleTab === 'doctor') {
        Swal.fire({
          icon: 'success',
          title: 'Registration Submitted',
          text: 'Specialist account created successfully. Pending administrator credential approval.',
          confirmButtonColor: '#4f46e5'
        }).then(() => navigate('/login'));
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Account Activated!',
          text: 'Patient profile registered successfully. You can now log in.',
          confirmButtonColor: '#4f46e5'
        }).then(() => navigate('/login'));
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || 'Error processing details.',
        confirmButtonColor: '#db2777'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-8 px-4 animate-fadeIn">
      <div className="flex justify-start mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-brand-pink-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go to Home</span>
        </Link>
      </div>
      <div className="glass-card p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-400">Join the early-screening awareness system</p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRoleTab('user')}
            className={`flex items-center justify-center space-x-1.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${roleTab === 'user' ? 'bg-white text-brand-pink-600 shadow-sm' : 'text-slate-550 hover:text-slate-700'}`}
          >
            <User size={15} />
            <span>Patient Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('doctor')}
            className={`flex items-center justify-center space-x-1.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${roleTab === 'doctor' ? 'bg-white text-brand-indigo-600 shadow-sm' : 'text-slate-550 hover:text-slate-700'}`}
          >
            <Stethoscope size={15} />
            <span>Doctor Portal</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User size={16} />}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          {roleTab === 'user' && (
            <div className="space-y-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 animate-fadeIn">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Date of Birth Details</span>
              
              {!dontKnowDob ? (
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  icon={<Calendar size={16} />}
                  required={!dontKnowDob}
                />
              ) : (
                <Input
                  label="Approximate Birth Year"
                  name="approxYear"
                  type="number"
                  placeholder="e.g. 2002"
                  value={approxYear}
                  onChange={(e) => setApproxYear(e.target.value)}
                  min={new Date().getFullYear() - 100}
                  max={new Date().getFullYear() - 15}
                  icon={<Calendar size={16} />}
                  required={dontKnowDob}
                />
              )}

              <div className="flex items-center space-x-2 pl-1">
                <input
                  type="checkbox"
                  id="dontKnowDob"
                  checked={dontKnowDob}
                  disabled={!!dob}
                  onChange={(e) => {
                    if (dob) return;
                    setDontKnowDob(e.target.checked);
                    if (e.target.checked) setDob('');
                    else setApproxYear('');
                  }}
                  className={`form-checkbox h-4 w-4 text-brand-pink-500 rounded border-slate-350 focus:ring-brand-pink-400 ${!!dob ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                />
                <label htmlFor="dontKnowDob" className={`text-xs text-slate-550 font-bold select-none ${!!dob ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  I don't know my exact Date of Birth
                </label>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="form-label">Password <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input text-sm pl-10 pr-10"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Doctor Profile Specific Elements */}
          {roleTab === 'doctor' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Specialist Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown
                  label="Specialization"
                  name="specialization"
                  options={['Gynecologist', 'Endocrinologist', 'Obstetrician', 'General Practitioner']}
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <Input
                  label="Experience (Years)"
                  name="experience"
                  type="number"
                  placeholder="e.g. 5"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <Input
                label="Medical License Number"
                name="license"
                placeholder="MC-XXXXXX or equivalent"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                icon={<FileText size={16} />}
                required
              />

              <div className="space-y-1.5">
                <label className="form-label">Profile Picture <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <ImageIcon size={16} />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-input text-sm pl-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-pink-50 file:text-brand-pink-650 hover:file:bg-brand-pink-100"
                    required
                  />
                </div>
                {profilePicture && (
                  <div className="mt-2 flex justify-center">
                    <img src={profilePicture} alt="Profile Preview" className="h-16 w-16 object-cover rounded-full border-2 border-brand-pink-200" />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            icon={<UserCheck size={15} />}
            variant="primary"
            className="w-full mt-6"
          >
            Create Account
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-550">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-pink-600 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
