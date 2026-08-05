// frontend/src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { 
  ShieldAlert, Activity, ClipboardCheck, ArrowRight, BookOpen, Users, Microscope, Apple, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { value: "1 in 10", label: "Global Prevalence", desc: "Affects approximately 10% of women of reproductive age worldwide." },
    { value: "84.40%", label: "Screening Accuracy", desc: "Trained on clinical diagnostic biomarkers matching the Rotterdam consensus." },
    { value: "70%+", label: "Insulin Connection", desc: "Over 70% of individuals with PMOS experience metabolic insulin resistance." }
  ];

  const features = [
    {
      icon: <ClipboardCheck className="text-brand-pink-500" size={24} />,
      title: "Rotterdam Screener",
      desc: "Evaluates menstrual cycle regularity, hirsutism signs, acne, and BMI markers against diagnostic criteria."
    },
    {
      icon: <Activity className="text-brand-indigo-500" size={24} />,
      title: "Risk Speedometer",
      desc: "Calculates probability scores, health indexes, and clinical feature weights to highlight individual risk drivers."
    },
    {
      icon: <Apple className="text-emerald-500" size={24} />,
      title: "Nutritional Roadmap",
      desc: "Generates custom low-glycemic anti-inflammatory diet guides and muscle-centric exercise plans."
    },
    {
      icon: <Users className="text-brand-purple-500" size={24} />,
      title: "Doctor Consultations",
      desc: "Connect directly with verified endocrinologists and gynecologists to submit questions and review replies."
    }
  ];

  const faqs = [
    {
      q: "What is PMOSense?",
      a: "PMOSense is an early-stage risk assessment platform designed to help women evaluate hormonal symptoms and receive personalized dietary recommendations."
    },
    {
      q: "Is PMOSense a medical diagnostic system?",
      a: "No, PMOSense is an early-stage screening tool. The evaluations are for awareness and early detection and are not clinical diagnoses. Always consult a gynecologist for a physical check, blood panels, or ovarian ultrasound scans."
    },
    {
      q: "How does the AI model evaluate PMOS risk?",
      a: "The screening evaluates risk using clinical features like cycle length, acne indicators, hirsutism checks, BMI, blood group, and diet. It calculates a probability score which classifies risk range."
    },
    {
      q: "What is the Rotterdam Criteria?",
      a: "Established in 2003, it is the global standard for diagnosing PMOS. A person is diagnosed if they meet at least two of the following: (1) Irregular periods or anovulation, (2) High levels of androgens (either in blood tests or symptoms like hirsutism/acne), (3) Polycystic ovaries visible on an ultrasound."
    }
  ];

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-pink-50 border border-brand-pink-100 text-brand-pink-600 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} />
            <span>Early Screening Platform</span>
          </div>
          
          <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Early PMOS Risk <span className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-transparent">Assessment Platform</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
            Evaluate your hormonal risk factors, obtain dynamic anti-inflammatory nutritional suggestions, track symptom history, and consult verified medical specialists on a single platform.
          </p>

          <p className="text-xs text-slate-450 italic border-l-2 border-brand-pink-500 pl-3 max-w-xl">
            <strong>Note:</strong> In May 2026, global medical consensus updated the terminology for PCOS to PMOS (Polyendocrine Metabolic Ovarian Syndrome) to better reflect its multi-system metabolic nature.
          </p>

          {/* Medical Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-850 text-xs flex items-start space-x-2.5 max-w-xl shadow-sm">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>MEDICAL DISCLAIMER:</strong> PMOSense results are for educational awareness only. This is not a diagnosis. Consult a healthcare provider for medical testing.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/assessment">
              <Button size="lg" className="w-full sm:w-auto">Take Free Assessment</Button>
            </Link>
            <Link to="/education">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Explore PMOS Pathways</Button>
            </Link>
          </div>
        </div>
        
        {/* Right Column (Glassmorphic Mockup) */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-brand-pink-400 to-brand-purple-400 blur-[85px] opacity-25"></div>
          
          <div className="relative glass-card border-white/60 p-6 sm:p-8 shadow-xl max-w-sm w-full hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-brand-pink-500"></div>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">PMOSense AI</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">CLASSIFIER READY</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Screening Accuracy</span>
                <span className="text-sm font-extrabold text-brand-indigo-600 bg-brand-indigo-50 px-2 py-0.5 rounded-lg">84.40%</span>
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Biomarkers</span>
                {[
                  { name: "Anovulatory Cycle", val: "High Risk" },
                  { name: "Hyperandrogenism (Hirsutism)", val: "Moderate Risk" },
                  { name: "Insulin Resistance (BMI)", val: "Metabolic Flag" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-650">{item.name}</span>
                    <span className="text-brand-pink-600 font-bold">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-slate-100 pt-2"></div>
              
              <p className="text-[10px] text-slate-400 text-center font-medium">
                *Statistical metrics matching the Rotterdam clinical criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="bg-gradient-to-r from-brand-pink-50 to-brand-indigo-50 border border-slate-100/60 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-2">
              <span className="font-outfit text-4xl font-extrabold text-slate-900 block">{s.value}</span>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider block">{s.label}</span>
              <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-outfit text-3xl font-extrabold text-slate-900">Platform Features</h2>
          <p className="text-slate-450 text-xs sm:text-sm">Integrated medical logs, predictions, and guidelines support.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-5 flex flex-col items-start hover:-translate-y-1.5 transition-transform duration-300">
              <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-outfit text-3xl font-extrabold text-slate-900">How It Works</h2>
          <p className="text-slate-450 text-xs sm:text-sm">Four simple steps to complete early hormonal assessment.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Registration", desc: "Secure Patient or Doctor accounts to maintain screening data." },
            { step: "02", title: "Symptom Log", desc: "Submit cycle logs, hair growth indicators, pimples, and lifestyle habits." },
            { step: "03", title: "AI Probabilities", desc: "Platform evaluates data to calculate risk levels and contributors." },
            { step: "04", title: "Lifestyle Guide", desc: "Download PDF reports, adapt anti-inflammatory diets, and write queries to doctors." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-150 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
              <span className="font-outfit text-4xl font-extrabold text-brand-pink-600 mb-3 block">{item.step}</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="max-w-2xl mx-auto space-y-6">
        <h2 className="font-outfit text-2xl font-extrabold text-slate-900 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-850 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm">{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 border-t border-slate-150 bg-slate-50 text-xs sm:text-sm text-slate-650 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
