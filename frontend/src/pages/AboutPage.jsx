// frontend/src/pages/AboutPage.jsx
import React from 'react';
import Card from '../components/Card';
import { BookOpen, ShieldCheck, Heart, Award, Code, Users } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: "Jane Smith", role: "AI/ML Developer", details: "Specializes in clinical classification models and dataset preprocessing." },
    { name: "Emily Watson", role: "Frontend UI/UX Lead", details: "Crafts medical dashboard interfaces and glassmorphic designs." },
    { name: "Sophia Martinez", role: "Healthcare Coordinator", details: "Translates Rotterdam diagnostic metrics into system heuristics." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4 animate-fadeIn">
      {/* Page Heading */}
      <div className="text-center space-y-2">
        <h1 className="font-outfit text-3xl font-extrabold text-slate-900">About PMOSense</h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
          An engineering solution integrating artificial intelligence algorithms to evaluate early endocrine health risks.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Our Project Mission" icon={<ShieldCheck size={18} />}>
          <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
            To provide women worldwide with a secure, highly accessible early screening portal for PMOS, bypassing delays in symptom recognition and encouraging proactive lifestyle interventions before clinical consults.
          </p>
        </Card>
        <Card title="Our Project Vision" icon={<Heart size={18} />}>
          <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
            To build a digital healthcare assistant that uses machine learning classifiers to analyze indicators, raising clinical awareness of endocrine irregularities and promoting hormonal well-being.
          </p>
        </Card>
      </div>

      {/* Objectives */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <BookOpen className="text-brand-pink-500" size={18} />
          <span>Core System Objectives</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-650 leading-relaxed">
          <div>
            <span className="font-bold text-slate-800 block mb-1">1. High-Fidelity Screening</span>
            Analyse indicators (hirsutism, menstrual regularity, skin darkening, acne, BMI) using Random Forest and XGBoost classifiers yielding 96%+ validation accuracies.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1">2. Customized Diet & Fitness Guides</span>
            Formulate personalized, anti-inflammatory dietary plans and specific resistance fitness steps based on individual metabolic flags.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1">3. Direct Medical Inquiries</span>
            Establish patient-doctor message interfaces enabling users to send inquiries directly to verified specialists.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1">4. Secure Analytics Logging</span>
            Support session tracking, trend graphs, and downloadable PDF summaries to create an early awareness log.
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-850 flex items-center space-x-1.5 pl-1">
          <Code className="text-brand-indigo-500" size={18} />
          <span>Technology Infrastructure</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-600">
          {[
            { cat: "Frontend Shell", items: "React.js, Vite, Axios, Tailwind CSS v4" },
            { cat: "Auth & States", items: "Context API, JWT Session, Password Salting" },
            { cat: "Machine Learning", items: "XGBoost, Random Forest, Scikit-learn" },
            { cat: "Database Shell", items: "MongoDB Atlas, PyMongo Client" }
          ].map((stack, i) => (
            <div key={i} className="bg-white border border-slate-150 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">{stack.cat}</span>
              <span className="text-slate-850 leading-tight block">{stack.items}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-850 flex items-center space-x-1.5 pl-1">
          <Users className="text-brand-pink-500" size={18} />
          <span>Meet the Development Team</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-white border border-slate-150 rounded-2xl p-5 space-y-2">
              <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center font-outfit text-sm font-bold text-brand-pink-650 border border-slate-100">
                {member.name.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-sm leading-snug">{member.name}</span>
                <span className="text-[10px] text-brand-indigo-650 font-bold uppercase block">{member.role}</span>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed">{member.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
