// frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Button from '../components/Button';
import Input from '../components/Input';
import { Mail, Phone, MapPin, Send, Compass } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      Swal.fire({ icon: 'error', title: 'Input Error', text: 'All marked fields are required.', confirmButtonColor: '#db2777' });
      return;
    }

    setSending(true);
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for reaching out. We will get back to you shortly.',
        confirmButtonColor: '#4f46e5'
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 animate-fadeIn">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="font-outfit text-3xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
          Need clinical resources, academic detail alignments, or platform support? Drop us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Hospital Coordinates details */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Medical Center Info</h3>
              
              <div className="flex items-start space-x-3 text-xs sm:text-sm">
                <MapPin size={16} className="text-brand-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-700">Hospital Address</span>
                  <span className="text-slate-500 text-xs leading-relaxed block">
                    Women's Endocrine & Health Dept,<br/>
                    City General Hospital, Block B,<br/>
                    45 Medical Plaza Avenue, NY.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs sm:text-sm">
                <Phone size={16} className="text-brand-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-700">Telephone Line</span>
                  <span className="text-slate-500 text-xs block">+1 (555) 234-5678</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs sm:text-sm">
                <Mail size={16} className="text-brand-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-700">Support Mailbox</span>
                  <span className="text-slate-500 text-xs block">support@pmosense.com</span>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Location Map</span>
              <div className="bg-slate-100 border border-slate-200 rounded-xl h-36 flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                {/* Visual grid indicators */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <Compass size={24} className="text-slate-400 animate-spin-slow mb-1.5" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">City General Hospital Map</span>
                <span className="text-[8px] text-slate-400 font-semibold block">40.7128° N, 74.0060° W</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="md:col-span-8">
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-4 h-full">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Send Message</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject"
              name="subject"
              placeholder="e.g. System Inquiry / Research Feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="form-label">Message Details <span className="text-red-500">*</span></label>
              <textarea
                className="form-input text-xs sm:text-sm h-32 resize-none"
                placeholder="Write down your queries or messages in detail here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              loading={sending} 
              icon={<Send size={15} />}
              className="w-full mt-4"
            >
              Send Inquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
