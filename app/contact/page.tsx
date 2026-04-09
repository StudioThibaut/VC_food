"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Send, MapPin, Phone, Mail as MailIcon } from "lucide-react";

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <main className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-block p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
            <MailIcon size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Get in Touch</h1>
          <p className="text-slate-500 font-medium italic">We helpen je graag met je fitness journey.</p>
        </header>

        <form onSubmit={handleSubmit((data) => alert("Bericht verzonden!"))} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Volledige Naam</label>
              <input {...register("name", { required: true })} className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:border-blue-500 font-bold" placeholder="bv. Walter White" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Adres</label>
              <input {...register("email", { required: true })} className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:border-blue-500 font-bold" placeholder="walter@profuel.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Bericht</label>
              <textarea rows={4} {...register("message", { required: true })} className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:border-blue-500 font-bold" placeholder="Hoe kunnen we je helpen?" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
            <Send size={16} /> Verstuur Bericht
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12 border-t border-slate-100">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-slate-50 p-3 rounded-xl text-blue-600"><Phone size={20} /></div>
            <p className="text-sm font-bold">+32 499 12 34 56</p>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="bg-slate-50 p-3 rounded-xl text-blue-600"><MapPin size={20} /></div>
            <p className="text-sm font-bold">Antwerpen, BE</p>
          </div>
        </div>
      </div>
    </main>
  );
}