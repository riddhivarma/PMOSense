// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || `${API_BASE}`;

const AuthContext = createContext(null);

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Mock Initial Educational Articles matching all categories
const initialArticles = [
  {
    id: "art-1",
    title: "What is PMOS? Understanding the Endocrine Disorder",
    category: "What is PMOS",
    content: "Polyendocrine Metabolic Ovarian Syndrome (PMOS) is a multi-system hormonal disorder characterized by reproductive, metabolic, and psychological features. It affects 8% to 13% of women of reproductive age. Diagnostic criteria (Rotterdam consensus) require at least two of the following: 1) Irregular or absent ovulatory cycles, 2) Elevated androgen hormone levels (hyperandrogenism), and 3) Polycystic ovaries visible on pelvic ultrasound.",
    video_url: "https://www.youtube.com/watch?v=N4d94A3D0B4",
    created_by: "Dr. Sarah Jenkins",
    created_at: "Jul 15, 2026"
  },
  {
    id: "art-2",
    title: "Common Symptoms: From Menstrual Irregularity to Hirsutism",
    category: "Symptoms",
    content: "PMOS manifests differently in every individual. Key clinical symptoms include oligomenorrhea (cycles > 35 days), amenorrhea, persistent facial and abdominal hair growth (hirsutism), androgenic hair thinning, acanthosis nigricans (dark velvety skin patches around neck folds), cystic acne, and metabolic insulin resistance leading to weight management challenges.",
    video_url: "https://www.youtube.com/watch?v=V3W94S3D0C6",
    created_by: "Dr. Elena Rostova",
    created_at: "Jul 18, 2026"
  },
  {
    id: "art-3",
    title: "Root Causes: Insulin Resistance and Hyperandrogenism",
    category: "Causes",
    content: "While the exact etiology remains complex, insulin resistance plays a primary role. Excess insulin signals the ovaries to produce excess testosterone, impairing egg follicle maturation. Genetic predisposition, low-grade systemic inflammation, and environmental endocrine disruptors also contribute significantly to the onset of symptoms.",
    video_url: "",
    created_by: "EndoResearch Team",
    created_at: "Jul 19, 2026"
  },
  {
    id: "art-4",
    title: "Prevention & Lifestyle Strategies",
    category: "Prevention",
    content: "Early lifestyle intervention can mitigate long-term complications such as Type 2 diabetes, dyslipidemia, and cardiovascular risks. Key strategies include maintaining a stable low-glycemic index diet, regular physical exercise to increase muscle GLUT-4 glucose transporters, stress management, and consistent sleep hygiene.",
    video_url: "",
    created_by: "Dr. Amanda Ross",
    created_at: "Jul 20, 2026"
  },
  {
    id: "art-5",
    title: "PMOS Healthy Diet Guide: Glycemic Control and Nutrition",
    category: "Healthy Diet",
    content: "Dietary management is essential for regulating insulin sensitivity. Focus on complex carbohydrates (quinoa, legumes, steel-cut oats), high-fiber dark leafy greens, lean proteins, and omega-3 fatty acids (salmon, walnuts, flaxseeds). Minimize refined sugars, white flour, processed foods, and sugary drinks.",
    video_url: "",
    created_by: "NutriWellness Team",
    created_at: "Jul 21, 2026"
  },
  {
    id: "art-6",
    title: "Frequently Asked Questions (FAQs) About PMOS",
    category: "FAQs",
    content: "Q: Can PMOS be cured?\nA: PMOS is a chronic condition, but symptoms can be effectively managed and reversed through targeted diet, exercise, and clinical guidance.\n\nQ: Is PMOSense a diagnostic tool?\nA: No, PMOSense provides early risk screening only. A formal diagnosis requires clinical evaluation by a physician.",
    video_url: "",
    created_by: "Medical Review Board",
    created_at: "Jul 22, 2026"
  }
];

// Mock Approved Doctors
const initialDoctors = [
  { id: "doc-1", name: "Dr. Sarah Jenkins", email: "doctor@pmosense.com", specialization: "Reproductive Endocrinologist", qualification: "MD, Fellowship in Endocrinology", experience_years: 12, is_approved: true },
  { id: "doc-2", name: "Dr. Amanda Ross", email: "amanda.ross@pmosense.com", specialization: "Gynecologist & Obstetrician", qualification: "MBBS, MS (Obstetrics & Gynecology)", experience_years: 8, is_approved: true },
  { id: "doc-3", name: "Dr. Elena Rostova", email: "elena.rostova@pmosense.com", specialization: "Endocrinology Specialist", qualification: "MD, Ph.D. Reproductive Biology", experience_years: 15, is_approved: false }
];

// Mock Registered Patients/Users
const initialUsers = [
  { id: "usr-1", name: "Jane Doe", email: "patient@pmosense.com", is_verified: true, phone: "+1 (555) 019-2834", age: 24, height: 162, weight: 68, bmi: 25.91, blood_group: "Not set" },
  { id: "usr-2", name: "Sarah Connor", email: "sarah.connor@example.com", is_verified: true, phone: "+1 (555) 392-[0192]", age: 29, height: 168, weight: 60, bmi: 21.26, blood_group: "O+" }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pmosense_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('pmosense_users_db');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('pmosense_doctors_db');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('pmosense_articles_db');
    return saved ? JSON.parse(saved) : initialArticles;
  });

  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('pmosense_assessments_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    localStorage.setItem('pmosense_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pmosense_doctors_db', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('pmosense_articles_db', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('pmosense_assessments_db', JSON.stringify(assessments));
  }, [assessments]);



  // Sync with backend
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.role === 'admin') {
        try {
          const token = localStorage.getItem('pmosense_token');
          const headers = { 'Authorization': `Bearer ${token}` };
          
          // Fetch users
          const usersRes = await fetch(`${API_BASE}/admin/users`, { headers });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData.map(u => ({ ...u, id: u.user_id })));
          }
          
          // Fetch doctors
          const docsRes = await fetch(`${API_BASE}/admin/doctors`, { headers });
          if (docsRes.ok) {
            const docsData = await docsRes.json();
            setDoctors(docsData.map(d => ({ ...d, id: d.doctor_id })));
          }
          
          // Fetch articles
          const artRes = await fetch(`${API_BASE}/admin/articles`, { headers });
          if (artRes.ok) {
            const artData = await artRes.json();
            setArticles(artData.map(a => ({ ...a, id: a.article_id })));
          }
        } catch (e) {
          console.error("Error syncing admin data from backend:", e);
        }
      } else {
        try {
          const publicDocsRes = await fetch(`${API_BASE}/doctors`);
          if (publicDocsRes.ok) {
            const docsData = await publicDocsRes.json();
            setDoctors(docsData.map(d => ({ ...d, id: d.doctor_id })));
          }
          
          // Fetch user's assessment history if logged in as patient
          if (user && user.role === 'user') {
            const token = localStorage.getItem('pmosense_token');
            const historyRes = await fetch(`${API_BASE}/assessment/history`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (historyRes.ok) {
              const historyData = await historyRes.json();
              setAssessments(historyData.map(asm => {
                if (asm.date) {
                  const d = new Date(asm.date);
                  if (!isNaN(d)) {
                    asm.date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  }
                }
                return asm;
              }));
            }

            // Fetch user's consultations
            const consultsRes = await fetch(`${API_BASE}/consultation/user`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (consultsRes.ok) {
              const consultsData = await consultsRes.json();
              setConsultations(consultsData.map(c => ({
                ...c,
                id: c.consultation_id,
                created_at: c.consultation_date ? new Date(c.consultation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null,
                resolved_at: c.resolved_at ? new Date(c.resolved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null
              })));
            }
          } else if (user && user.role === 'doctor') {
            const token = localStorage.getItem('pmosense_token');
            const consultsRes = await fetch(`${API_BASE}/consultation/doctor`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (consultsRes.ok) {
              const consultsData = await consultsRes.json();
              setConsultations(consultsData.map(c => ({
                ...c,
                id: c.consultation_id,
                created_at: c.consultation_date ? new Date(c.consultation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null,
                resolved_at: c.resolved_at ? new Date(c.resolved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null
              })));
            }
          }
        } catch (e) {
          console.error("Error syncing public data from backend:", e);
        }
      }
    };
    
    fetchData();
  }, [user]);

  const login = async (email, password, role) => {
    let endpoint = '';
    let payload = {};

    if (role === 'admin' || email === 'admin@pmosense.com') {
      endpoint = `${API_BASE}/admin/login`;
      payload = { username: email, password };
    } else if (role === 'doctor' || email === 'doctor@pmosense.com') {
      endpoint = `${API_BASE}/doctor/login`;
      payload = { email, password };
    } else {
      endpoint = `${API_BASE}/user/login`;
      payload = { email, password };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials.");
    }

    localStorage.setItem('pmosense_token', data.token);

    const profileRes = await fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });

    let userObj = data.user;
    if (profileRes.ok) {
      userObj = await profileRes.json();
    }

    userObj.id = userObj.user_id || userObj.doctor_id || userObj.admin_id;
    setUser(userObj);
    localStorage.setItem('pmosense_user', JSON.stringify(userObj));
    return userObj;
  };

  const register = async (name, email, password, role, extraFields = {}) => {
    let endpoint = role === 'doctor' ? `${API_BASE}/doctor/register` : `${API_BASE}/user/register`;

    const payload = {
      name, email, password, ...extraFields
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    if (role === 'doctor') {
      const newDoc = {
        id: data.doctor_id,
        name,
        email,
        specialization: extraFields.specialization || "Gynecologist",
        experience_years: parseInt(extraFields.experience_years) || 0,
        license_number: extraFields.license_number || "MC-998811",
        profile_picture: extraFields.profile_picture || null,
        is_approved: false
      };
      setDoctors(prev => [...prev, newDoc]);
      return newDoc;
    } else {
      const calculatedAge = extraFields.dob ? calculateAge(extraFields.dob) : null;
      const newUsr = {
        id: data.user_id,
        name,
        email,
        is_verified: false,
        phone: extraFields.phone || "",
        dob: extraFields.dob || null,
        age: calculatedAge,
        height: extraFields.height ? parseFloat(extraFields.height) : null,
        weight: extraFields.weight ? parseFloat(extraFields.weight) : null,
        bmi: null,
        blood_group: extraFields.blood_group || "Not set"
      };
      setUsers(prev => [...prev, newUsr]);
      return newUsr;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pmosense_user');
    localStorage.removeItem('pmosense_token');
  };

  const updateProfile = async (name, dobVal, weightVal, heightVal, phoneVal, bloodGroupVal, specializationVal, experienceVal, licenseVal, profilePicVal) => {
    if (!user) return;

    const token = localStorage.getItem('pmosense_token');
    if (!token) throw new Error("Authentication required.");

    const payload = {
      name, phone: phoneVal
    };

    if (user.role === 'user') {
      payload.dob = dobVal;
      payload.weight = weightVal;
      payload.height = heightVal;
      payload.blood_group = bloodGroupVal;
    } else if (user.role === 'doctor') {
      payload.specialization = specializationVal;
      payload.experience_years = experienceVal;
      payload.license_number = licenseVal;
      payload.profile_picture = profilePicVal;
    } else if (user.role === 'admin') {
      // admin updates (assuming admin modifies these)
    }

    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update profile.");
    }

    // Refresh user state
    const profileRes = await fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let profileData = {};
    if (profileRes.ok) {
      profileData = await profileRes.json();
      profileData.id = profileData.user_id || profileData.doctor_id || profileData.admin_id;
      setUser(profileData);
      localStorage.setItem('pmosense_user', JSON.stringify(profileData));
    }

    // Keep local arrays synchronized for the admin dashboard
    if (user.role === 'user') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...profileData } : u));
    } else if (user.role === 'doctor') {
      setDoctors(prev => prev.map(d => d.id === user.id ? { ...d, ...profileData } : d));
    }
  };

  const addAssessment = async (inputs) => {
    if (!user) return null;

    const token = localStorage.getItem('pmosense_token');
    const payload = {
      age: inputs.age,
      height: inputs.height,
      weight: inputs.weight,
      blood_group: inputs.blood_group,
      menstrual_cycle: inputs.cycle,
      cycle_length: inputs.cycle_length,
      weight_gain: inputs.weight_gain,
      hair_growth: inputs.hair_growth,
      hair_loss: inputs.hair_loss,
      skin_darkening: inputs.skin_darkening,
      pimples: inputs.pimples,
      fast_food: inputs.fast_food,
      regular_exercise: inputs.reg_exercise
    };

    const res = await fetch(`${API_BASE}/assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save assessment.");

    const asmRes = await fetch(`${API_BASE}/assessment/${data.assessment_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (asmRes.ok) {
      const newAssessment = await asmRes.json();
      if (newAssessment.date) {
        const d = new Date(newAssessment.date);
        if (!isNaN(d)) {
          newAssessment.date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
      }
      setAssessments(prev => [newAssessment, ...prev]);
      
      const updatedUser = {
        ...user,
        age: parseInt(inputs.age),
        height: parseFloat(inputs.height),
        weight: parseFloat(inputs.weight),
        bmi: data.bmi,
        blood_group: inputs.blood_group || "Not set"
      };
      setUser(updatedUser);
      localStorage.setItem('pmosense_user', JSON.stringify(updatedUser));
      
      return newAssessment;
    }
    
    throw new Error("Failed to retrieve saved assessment.");
  };

  const deleteAssessment = async (id) => {
    if (!user) return;
    const token = localStorage.getItem('pmosense_token');
    try {
      const res = await fetch(`${API_BASE}/assessment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAssessments(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addConsultation = async (question, doctorId) => {
    if (!user) return null;
    const token = localStorage.getItem('pmosense_token');
    
    try {
      const res = await fetch(`${API_BASE}/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: doctorId || null,
          question
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit consultation.");
      
      // Re-fetch to get updated list
      const consultsRes = await fetch(`${API_BASE}/consultation/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (consultsRes.ok) {
        const consultsData = await consultsRes.json();
        setConsultations(consultsData.map(c => ({
          ...c,
          id: c.consultation_id,
          created_at: c.consultation_date ? new Date(c.consultation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null,
          resolved_at: c.resolved_at ? new Date(c.resolved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null
        })));
      }
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const replyConsultation = async (id, reply) => {
    if (!user || user.role !== 'doctor') return;
    const token = localStorage.getItem('pmosense_token');
    
    try {
      const res = await fetch(`${API_BASE}/consultation/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          consultation_id: id,
          reply
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reply to consultation.");
      
      // Re-fetch to get updated list
      const consultsRes = await fetch(`${API_BASE}/consultation/doctor`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (consultsRes.ok) {
        const consultsData = await consultsRes.json();
        setConsultations(consultsData.map(c => ({
          ...c,
          id: c.consultation_id,
          created_at: c.consultation_date ? new Date(c.consultation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null,
          resolved_at: c.resolved_at ? new Date(c.resolved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null
        })));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const addArticle = (title, category, content, video_url) => {
    if (!user || user.role !== 'admin') return;

    const newArt = {
      id: "art-" + generateId(),
      title,
      category,
      content,
      video_url,
      created_by: user.name,
      created_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    setArticles(prev => [newArt, ...prev]);
    return newArt;
  };

  const updateArticle = (id, title, category, content, video_url) => {
    if (!user || user.role !== 'admin') return;

    setArticles(prev => prev.map(art => art.id === id ? {
      ...art,
      title,
      category,
      content,
      video_url
    } : art));
  };

  const deleteArticle = (id) => {
    if (!user || user.role !== 'admin') return;
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  const toggleUserVerify = async (id) => {
    if (!user || user.role !== 'admin') return;
    try {
      const token = localStorage.getItem('pmosense_token');
      const res = await fetch(`${API_BASE}/admin/users/${id}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_verified: !u.is_verified } : u));
      }
    } catch (e) { console.error(e); }
  };

  const approveDoctor = async (id) => {
    if (!user || user.role !== 'admin') return;
    try {
      const token = localStorage.getItem('pmosense_token');
      const res = await fetch(`${API_BASE}/admin/doctors/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_approved: !d.is_approved } : d));
      } else {
        const data = await res.json();
        console.error("Failed to approve:", data);
      }
    } catch (e) { console.error(e); }
  };

  const verifyProfileChange = async (id) => {
    if (!user || user.role !== 'admin') return;
    try {
      const token = localStorage.getItem('pmosense_token');
      const res = await fetch(`${API_BASE}/admin/doctors/${id}/profile_change/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDoctors(prev => prev.map(d => {
          if (d.id === id) {
            return {
              ...d,
              license_number: d.pending_license_number || d.license_number,
              profile_picture: d.pending_profile_picture || d.profile_picture,
              pending_license_number: undefined,
              pending_profile_picture: undefined
            };
          }
          return d;
        }));
      }
    } catch (e) { console.error(e); }
  };

  const rejectProfileChange = async (id) => {
    if (!user || user.role !== 'admin') return;
    try {
      const token = localStorage.getItem('pmosense_token');
      const res = await fetch(`${API_BASE}/admin/doctors/${id}/profile_change/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDoctors(prev => prev.map(d => {
          if (d.id === id) {
            return {
              ...d,
              pending_license_number: undefined,
              pending_profile_picture: undefined
            };
          }
          return d;
        }));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      doctors,
      articles,
      assessments,
      consultations,
      login,
      register,
      logout,
      updateProfile,
      addAssessment,
      deleteAssessment,
      addConsultation,
      replyConsultation,
      addArticle,
      updateArticle,
      deleteArticle,
      toggleUserVerify,
      approveDoctor,
      verifyProfileChange,
      rejectProfileChange
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
