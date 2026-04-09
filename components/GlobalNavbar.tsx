"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  X, Home, Info, Mail, User, Zap, 
  LayoutDashboard, ChevronRight, Menu,
  Settings, LogOut, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Menu items gebaseerd op de briefing (Userpagina, Dashboard, etc.)
  const menuItems = [
    { name: 'Dashboard', href: '/home', icon: <LayoutDashboard size={22} />, desc: 'Daily Stats' },
    { name: 'User Profile', href: '/login', icon: <User size={22} />, desc: 'Personal Metrics' },
    { name: 'Weather Tool', href: '/weer_app', icon: <Info size={22} />, desc: 'Outdoor Conditions' },
    { name: 'Support', href: '/contact', icon: <Mail size={22} />, desc: 'Get Help' },
  ];

  return (
    <>
      {/* Zwevende Trigger Knop met Blur-effect voor Responsive Design */}
      {!isOpen && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-60 bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-[2rem] shadow-2xl shadow-slate-200/50 text-slate-900 hover:scale-105 active:scale-95 transition-all group"
        >
          <Menu size={24} className="group-hover:text-blue-600 transition-colors" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay die de focus op de data versterkt */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-70"
            />

            {/* De Sidebar: Focus op UX en Visuele Hiërarchie */}
            <motion.div 
              initial={{ x: '-100%', skewX: 5 }} 
              animate={{ x: 0, skewX: 0 }} 
              exit={{ x: '-100%', skewX: -5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 left-0 h-full w-85 bg-white/90 backdrop-blur-2xl z-80 shadow-[30px_0_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col border-r border-white/50"
            >
              {/* Branding: ProFuel Elite Identity */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6 group-hover:rotate-0 transition-transform">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase italic leading-none tracking-tighter">
                      ProFuel <span className="text-blue-600">Elite</span>
                    </h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Health Ecosystem</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigatie: Interactieve patronen en duidelijke selectie */}
              <nav className="space-y-4 flex-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-2">Main Navigation</p>
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a 
                      key={item.name} 
                      href={item.href}
                      className={`flex items-center justify-between p-4 rounded-3xl transition-all group relative overflow-hidden ${
                        isActive 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <span className={`${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:scale-110 group-hover:text-blue-600'} transition-all`}>
                          {item.icon}
                        </span>
                        <div>
                          <span className="text-sm font-black uppercase italic block leading-none mb-1">
                            {item.name}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </a>
                  );
                })}
              </nav>

              {/* User Context: Belangrijk voor de "Userpagina" eis in de briefing */}
              <div className="pt-8 mt-auto border-t border-slate-100 space-y-4">
                <div className="bg-slate-50 rounded-[2rem] p-5 flex items-center gap-4 border border-slate-100/50">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                      <User size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-900 uppercase italic">Elite Athlete</p>
                    <div className="flex items-center gap-1">
                      <Award size={10} className="text-blue-600" />
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Premium Plan</p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
                <p className="text-[9px] text-center font-black text-slate-300 uppercase tracking-[0.4em]">v1.0.4 • ProFuel OS</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}