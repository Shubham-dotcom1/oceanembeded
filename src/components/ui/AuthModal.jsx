import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Lock, Mail, User, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('NOAA / Academic Research');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-md rounded-3xl border border-cyan-500/40 p-6 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                {activeTab === 'login' ? 'RESEARCHER LOGIN' : 'CREATE OBSERVATORY ACCOUNT'}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Login / Signup Tab Switch Pills */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-5 font-mono text-xs">
            <button
              onClick={() => { setActiveTab('login'); setIsSubmitted(false); }}
              className={`py-2 rounded-lg font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setIsSubmitted(false); }}
              className={`py-2 rounded-lg font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center font-mono">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 animate-bounce">
                ✓
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {activeTab === 'login' ? 'LOGGED IN SUCCESSFULLY' : 'ACCOUNT CREATED'}
              </h4>
              <p className="text-xs text-slate-400">Authenticating oceanographic API credentials...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-mono text-xs">
              {activeTab === 'signup' && (
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">FULL NAME</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">INSTITUTION EMAIL</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="researcher@noaa.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">PASSWORD</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>

              {activeTab === 'signup' && (
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">ORGANIZATION / SECTOR</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-colors appearance-none"
                    >
                      <option value="NOAA / Academic Research">NOAA / Academic Oceanography</option>
                      <option value="Commercial Maritime Fleet">Commercial Maritime Fleet</option>
                      <option value="Environmental Defense NGO">Environmental Defense NGO</option>
                      <option value="Public Student Access">Public / Student Access</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="glass-button w-full py-2.5 rounded-xl font-bold text-xs shadow-xl mt-2 flex items-center justify-center gap-2"
              >
                {activeTab === 'login' ? 'AUTHENTICATE & ENTER' : 'CREATE FREE ACCOUNT'}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center text-[10px] font-mono text-slate-400">
            Encrypted with WMO & NOAA Sentinel Data Access Protocol
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
