// frontend/src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { User, Mail, Phone, Scale, RefreshCw, Edit2, X, ClipboardCheck, Droplet, Calendar, Stethoscope, FileText, Image as ImageIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [height, setHeight] = useState(user?.height || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'Not set');
  const [loading, setLoading] = useState(false);

  // Doctor credentials
  const [specialization, setSpecialization] = useState(user?.specialization || 'Gynecologist');
  const [experience, setExperience] = useState(user?.experience_years || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.license_number || '');
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name) {
      Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Name is required.', confirmButtonColor: '#db2777' });
      return;
    }

    if (user?.role === 'doctor') {
      if (!specialization) {
        Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Specialization is required.', confirmButtonColor: '#4f46e5' });
        return;
      }
      if (experience === '' || isNaN(parseInt(experience)) || parseInt(experience) < 0) {
        Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Please enter a valid positive number for experience.', confirmButtonColor: '#4f46e5' });
        return;
      }
      if (!licenseNumber) {
        Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Medical license number is required.', confirmButtonColor: '#4f46e5' });
        return;
      }
    } else {
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        
        if (calculatedAge < 15 || calculatedAge > 55) {
          Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Date of Birth must calculate to an age between 15 and 55 years.', confirmButtonColor: '#db2777' });
          return;
        }
      } else if (user?.role === 'user') {
        Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Date of Birth is required.', confirmButtonColor: '#db2777' });
        return;
      }

      if (height && (parseFloat(height) < 100 || parseFloat(height) > 220)) {
        Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Height must be between 100 and 220 cm.', confirmButtonColor: '#db2777' });
        return;
      }

      if (weight && (parseFloat(weight) < 30 || parseFloat(weight) > 180)) {
        Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Weight must be between 30 and 180 kg.', confirmButtonColor: '#db2777' });
        return;
      }
    }

    setLoading(true);

    try {
      if (user?.role === 'doctor') {
        await updateProfile(name, null, null, null, phone, null, specialization, experience, licenseNumber, profilePicture);
        
        if (licenseNumber !== user?.license_number || profilePicture) {
          Swal.fire({
            icon: 'info',
            title: 'Request Submitted!',
            text: 'Specialization and experience have been saved. Your request to change license/profile picture has been sent for admin verification.',
            confirmButtonColor: '#4f46e5'
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated!',
            text: 'Doctor profile changes have been successfully saved.',
            confirmButtonColor: '#4f46e5'
          });
        }
      } else {
        await updateProfile(name, dob, weight, height, phone, bloodGroup);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Personal vitals have been successfully saved.',
          confirmButtonColor: '#4f46e5'
        });
      }
      
      setIsEditing(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: err.message || 'Error saving changes.',
        confirmButtonColor: '#db2777'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setDob(user?.dob || '');
    setWeight(user?.weight || '');
    setHeight(user?.height || '');
    setBloodGroup(user?.blood_group || 'Not set');
    setSpecialization(user?.specialization || 'Gynecologist');
    setExperience(user?.experience_years || '');
    setLicenseNumber(user?.license_number || '');
    setProfilePicture('');
    setIsEditing(false);
  };

  const computedBmi = (weight && height) ? parseFloat((weight / ((height / 100) ** 2)).toFixed(2)) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-tight">My Profile Settings</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {user?.role === 'admin' 
              ? "Keep your personal information and profile settings up to date."
              : user?.role === 'user'
              ? "Manage personal vitals and your profile details"
              : "Keep your personal information, medical credentials, and profile settings up to date."}
          </p>
        </div>
        
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            icon={<Edit2 size={14} />}
            variant="outline"
            className="text-xs py-2 px-4"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-4">
          <div className="glass-card p-6 text-center space-y-4 shadow-sm">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-brand-pink-400 to-brand-purple-500 flex items-center justify-center text-white font-outfit text-2xl font-bold shadow-md overflow-hidden border-2 border-brand-pink-200">
              {user?.role === 'doctor' && user?.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            
            <div>
              <span className="block font-bold text-slate-800 text-base leading-snug">{user?.name}</span>
              <span className="text-xs text-brand-pink-600 font-bold uppercase tracking-wider block mt-0.5">{user?.role} Account</span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col items-center space-y-2 text-xs text-slate-500 font-semibold">
              <span className="flex items-center space-x-2 truncate max-w-full">
                <Mail size={14} className="shrink-0 text-brand-pink-500" />
                <span className="truncate">{user?.email}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Details View / Form Editor */}
        <div className="md:col-span-8">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="glass-card p-6 sm:p-8 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <User className="text-brand-pink-500" size={16} />
                <span>Modify Profile Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                />
              </div>

              {user?.role === 'user' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      icon={<Calendar size={16} />}
                      required
                    />
                    <Dropdown
                      label="Blood Group"
                      name="bloodGroup"
                      options={["Not set", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Height (cm)"
                      name="height"
                      type="number"
                      placeholder="e.g. 162"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                    <Input
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      placeholder="e.g. 68"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  {computedBmi && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-sm font-semibold">
                      <span className="text-slate-650 flex items-center space-x-2">
                        <Scale size={16} className="text-brand-indigo-500" />
                        <span>Calculated Body Mass Index (BMI):</span>
                      </span>
                      <span className="text-base font-extrabold text-brand-pink-600 bg-brand-pink-50 border border-brand-pink-100 px-3.5 py-0.5 rounded-xl">
                        {computedBmi}
                      </span>
                    </div>
                  )}
                </>
              )}

              {user?.role === 'doctor' && (
                <>
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
                      required
                    />
                  </div>
                  <Input
                    label="Medical License Number"
                    name="licenseNumber"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    icon={<FileText size={16} />}
                    required
                  />
                  <div className="space-y-1.5 mt-2">
                    <label className="form-label">Update Profile Picture</label>
                    <div className="relative flex items-center">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <ImageIcon size={16} />
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-input text-sm pl-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-pink-50 file:text-brand-pink-650 hover:file:bg-brand-pink-100"
                      />
                    </div>
                    {profilePicture && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img src={profilePicture} alt="New Preview" className="h-10 w-10 object-cover rounded-full border-2 border-brand-pink-200" />
                        <span className="text-xs text-brand-pink-600 font-bold">New picture selected for upload</span>
                      </div>
                    )}
                  </div>
                  {user?.pending_license_number && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-semibold text-amber-800 leading-relaxed pl-4">
                      ⚠️ You have a pending request to update your license number to: <strong>{user.pending_license_number}</strong>. This is awaiting administrator verification.
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  icon={<RefreshCw size={14} />}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  icon={<X size={14} />}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="glass-card p-6 sm:p-8 space-y-6 shadow-md">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <ClipboardCheck className="text-brand-indigo-500" size={16} />
                <span>Your Profile Details</span>
              </h3>

              {user?.role === 'user' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Date of Birth</span>
                    <span className="text-slate-800 font-extrabold text-base">{user?.dob || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Demographic Age</span>
                    <span className="text-slate-800 font-extrabold text-base">{user?.age ? `${user.age} yrs` : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Blood Group</span>
                    <span className="text-red-600 font-extrabold text-base flex items-center space-x-1">
                      <Droplet size={14} className="fill-red-500" />
                      <span>{user?.blood_group || 'Not set'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Body Mass Index</span>
                    <span className="text-brand-pink-600 font-extrabold text-base">{user?.bmi ? user.bmi : 'Not computed'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Height</span>
                    <span className="text-slate-800 font-bold">{user?.height ? `${user.height} cm` : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Weight</span>
                    <span className="text-slate-800 font-bold">{user?.weight ? `${user.weight} kg` : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Phone Contact</span>
                    <span className="text-slate-800 font-bold">{user?.phone || 'Not set'}</span>
                  </div>
                </div>
              ) : user?.role === 'doctor' ? (
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Specialization</span>
                    <span className="text-slate-800 font-extrabold text-base">{user?.specialization}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Experience</span>
                    <span className="text-slate-800 font-extrabold text-base">{user?.experience_years} years</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Medical License Number</span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-0.5">
                      <span className="text-brand-indigo-650 font-extrabold text-base">{user?.license_number}</span>
                      {user?.pending_license_number && (
                        <span className="inline-block bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1 sm:mt-0">
                          Pending Verification: {user.pending_license_number}
                        </span>
                      )}
                    </div>
                  </div>
                  {user?.pending_profile_picture && (
                    <div className="col-span-2">
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center space-x-3 mt-2">
                        <img src={user.pending_profile_picture} alt="Pending PFP" className="h-10 w-10 object-cover rounded-full border border-amber-200 shrink-0" />
                        <div className="text-[11px] font-semibold text-amber-800 leading-relaxed">
                          ⚠️ You have a pending request to update your profile picture. Awaiting administrator verification.
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Phone Contact</span>
                    <span className="text-slate-800 font-bold">{user?.phone || 'Not set'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Account Role</span>
                    <span className="text-brand-pink-650 font-extrabold text-base capitalize">{user?.role}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Phone Contact</span>
                    <span className="text-slate-800 font-bold">{user?.phone || 'Not set'}</span>
                  </div>
                </div>
              )}

              {user?.role === 'user' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  *Physical vitals and blood group parameters are stored to personalize your screening reports and diet recommendations.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
