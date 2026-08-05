// frontend/src/pages/EducationResourcesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { 
  BookOpen, ShieldAlert, Heart, Info, AlertTriangle, Sparkles, CheckCircle2, ArrowLeft 
} from 'lucide-react';

export default function EducationResourcesPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 py-6 animate-fadeIn">
      
      {/* Go Back Link */}
      {!user && (
        <div className="flex justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-brand-pink-650 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go back to Homepage</span>
          </Link>
        </div>
      )}

      {/* 1. Header Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-pink-50 border border-brand-pink-100 text-brand-pink-650 text-xs font-extrabold uppercase tracking-wider">
          <BookOpen size={14} />
          <span>PMOS Educational Hub</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Understanding PMOS & Your Body
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Comprehensive, evidence-based details on what PMOS is, its causes, symptoms, preventions, and how to confidently manage your health.
        </p>
      </div>

      {/* 2. What is PMOS section with Image */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-xs">
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 text-brand-pink-650 font-bold">
            <Info size={18} />
            <h2 className="text-lg sm:text-xl font-extrabold">What is PMOS?</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
            <strong>Polyendocrine Metabolic Ovarian Syndrome (PMOS)</strong>—formerly and commonly known as PCOS—is a complex multi-system hormonal and metabolic disorder that affects about 10% of women globally. 
          </p>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
            Rather than being a simple ovarian disease, it is primarily driven by systemic endocrine imbalance. Elevated levels of male hormones (androgens) interfere with the normal development of ovarian follicles. Instead of maturing and releasing an egg, many follicles stop growing early and remain as small fluid-filled sacs, often described as a "string of pearls" or cysts on pelvic ultrasounds.
          </p>
        </div>
        <div className="md:col-span-5 flex justify-center">
          <div className="relative border-2 border-brand-pink-100 rounded-2xl overflow-hidden shadow-md max-w-[260px] md:max-w-full">
            <img 
              src="/hormone_system_diagram.png" 
              alt="Hormonal System Diagram" 
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>
      </section>

      {/* 3. Causes and Prevention Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Causes Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center space-x-2 text-brand-indigo-650 font-bold">
            <AlertTriangle size={18} />
            <h3 className="text-md sm:text-lg font-extrabold">Root Causes</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            PMOS arises from a combination of genetic predisposition, lifestyle triggers, and environmental factors:
          </p>
          <ul className="space-y-3.5 pl-1">
            {[
              { title: "Insulin Resistance (IR)", desc: "Cells resist taking up glucose, leading the pancreas to overproduce insulin. High insulin signals the ovaries to secrete excess testosterone, disturbing ovulation loops." },
              { title: "Chronic Low-Grade Inflammation", desc: "Systemic inflammation triggers white blood cells to produce cytokines that obstruct normal progesterone production and stimulate excessive ovarian androgen output." },
              { title: "Adrenal Stress Response", desc: "Overactivity of the Hypothalamus-Pituitary-Adrenal (HPA) axis under high chronic stress elevates cortisol and adrenal androgens like DHEA-S, impairing reproductive signal rhythm." }
            ].map((cause, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate-650">
                <strong className="text-slate-800 font-bold block mb-0.5">{cause.title}</strong>
                {cause.desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention & Lifestyle Card */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center space-x-2 text-emerald-650 font-bold">
            <CheckCircle2 size={18} />
            <h3 className="text-md sm:text-lg font-extrabold">Prevention & Management</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-650 font-medium">
            While PMOS has genetic roots, symptoms and metabolic outcomes can be highly prevented, managed, and reversed:
          </p>
          <ul className="space-y-3.5 pl-1">
            {[
              { title: "Low-Glycemic Anti-Inflammatory Diet", desc: "Prioritize lean proteins, healthy fats (avocados, nuts), and complex fiber. Drastically reduce refined carbohydrates and sugars to control insulin spikes." },
              { title: "Targeted Physical Activity", desc: "Combine progressive strength training (which pulls glucose directly from blood without requiring insulin) with low-impact steady cardio to regulate metabolic pathways." },
              { title: "Stress Reduction & Sleep", desc: "Adopt daily mindfulness, yoga, and breathwork to soothe HPA axis triggers. Prioritize 7-8 hours of quality sleep to stabilize growth hormone and glucose tolerance." }
            ].map((prev, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate-650">
                <strong className="text-slate-800 font-bold block mb-0.5">{prev.title}</strong>
                {prev.desc}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Possible Symptoms Section */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-brand-purple-650 font-bold">
          <ShieldAlert size={18} />
          <h3 className="text-md sm:text-lg font-extrabold">Common Symptoms</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
          Symptoms are highly variable depending on individual phenotypes (e.g., insulin-resistant vs. inflammatory) but typically present in these three primary categories:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {[
            { cat: "Menstrual Cycles", items: ["Irregular periods (cycles > 35 days)", "Amenorrhea (absent periods)", "Heavy or unpredictable bleeding"] },
            { cat: "Hormonal & Skin", items: ["Excess facial or body hair (hirsutism)", "Severe, persistent adult acne", "Male-pattern hair thinning / loss"] },
            { cat: "Metabolic Markers", items: ["Sudden weight gain around abdominal area", "Acanthosis nigricans (velvety dark neck folds)", "Frequent fatigue and glucose crashes"] }
          ].map((symp, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-150 space-y-2 shadow-2xs">
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-brand-purple-600">{symp.cat}</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-650 font-semibold">
                {symp.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Support and Empowerment Section */}
      <section className="bg-gradient-to-r from-brand-pink-500/10 via-brand-purple-500/10 to-brand-indigo-500/10 p-6 sm:p-8 rounded-2xl border border-brand-pink-100 flex flex-col md:flex-row items-center gap-8">
        <div className="md:col-span-5 shrink-0 flex justify-center max-w-[240px] md:max-w-[280px]">
          <img 
            src="/empowerment_warrior_women.png" 
            alt="Empowered Women Warrior Graphic" 
            className="w-full h-auto rounded-xl shadow-md border border-brand-pink-200" 
          />
        </div>
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 text-brand-pink-650 font-bold">
            <Heart size={20} className="fill-brand-pink-650" />
            <h3 className="text-lg sm:text-xl font-extrabold">A Message of Strength</h3>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
            To every brave heart reading this: PMOS is a metabolic condition, NOT a personal failure or a flaw in who you are. 
          </p>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
            It is completely natural to feel overwhelmed or frightened by symptoms and diagnostics lists, but please do not let fear take away your light. If you are diagnosed with PMOS, remember that you are an incredibly brave, strong woman. You are a warrior navigating your health journey with courage.
          </p>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
            Every step you take towards understanding your body, optimizing your nutrition, and advocating for your wellness is a victory. You are not alone, you are strong, and you have the power to thrive. Keep your chin up, warrior!
          </p>
        </div>
      </section>

      {/* Medical Disclaimer Disclaimer */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-850 text-xs text-center leading-relaxed font-semibold">
        <strong>MEDICAL DISCLAIMER:</strong> This educational resource is for informational and awareness purposes only and does not replace medical diagnosis, advice, or clinical checkups. Always consult a gynecologist or medical doctor for diagnostics and hormone treatment panels.
      </div>
    </div>
  );
}
