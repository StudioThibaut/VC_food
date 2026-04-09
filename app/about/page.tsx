import { Trophy } from "lucide-react";

export default function AboutPage() {
  const points = [
    { title: "Innovative Technology", desc: "AI-gestuurde voedingherkenning voor topsporters." },
    { title: "Professional Team", desc: "Gebouwd door experts in sportfysiologie en software." },
    { title: "Customer Success", desc: "Al meer dan 5.000 maaltijden succesvol gelogd." }
  ];

  return (
    <main className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto space-y-16">
        <header className="space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">We Are <br/><span className="text-blue-600 italic underline">ProFuel</span></h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Onze missie is simpel: De complexiteit van voeding weghalen, zodat jij je kunt focussen op je prestaties.
          </p>
        </header>

        <div className="space-y-8">
          {points.map((p, i) => (
            <div key={i} className="group flex gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all">
              <div className="text-4xl font-black text-blue-600/20 group-hover:text-blue-600 transition-colors italic">0{i+1}</div>
              <div>
                <h3 className="text-lg font-black uppercase mb-1">{p.title}</h3>
                <p className="text-slate-500 font-medium">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 p-12 rounded-[3rem] text-white text-center shadow-2xl shadow-blue-100">
          <Trophy size={48} className="mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase mb-2">Join the Elite</h2>
          <p className="text-blue-100 text-sm mb-8">Klaar om je voeding naar een hoger niveau te tillen?</p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Get Started</button>
        </div>
      </div>
    </main>
  );
}