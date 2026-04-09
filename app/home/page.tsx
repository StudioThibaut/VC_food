"use client";

// ═══════════════════════════════════════════════════════════════════════════
// PROFUEL ATHLETE — page.tsx  (AthletePage)
// Alle UI-logica zit hier. Alle gedeelde code staat in:
//   @/components/profuel/components.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, X, Utensils,
  ChartBar, ChartPie, ChartLine, Circle,
  Search, Calendar as CalendarIcon,
  Settings, RefreshCw, Globe, Loader2, Barcode, Check,
  Droplets, Leaf, Candy, ChevronRight,
  Dumbbell, Zap, Moon, TrendingUp, Award, Flame,
  Heart, Timer, Target, BarChart3, Scale, Battery, Syringe, Pencil, Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




// ── Importeer alles uit het components bestand ──────────────────────────────
import {
  THEMES, SPORT_TYPES, SUPPLEMENT_LIST,
  MY_FOOD_LOG, FOOD_LOG_BY_DATE, PRELOADED_MEALS, INITIAL_DATABASE,
  type ThemeKey, type Theme,
  defaultCategory, waterGoalMl, getMoodEmoji,
  getRecoveryLabel, getRecoveryColor,
  AddMealModal, TrainingModal, RecoveryModal,
  PRModal, BodyModal, SettingsModal, UndoToast,
} from "@/components/component";
// ────────────────────────────────────────────────────────────────────────────
// Pas het pad aan naar waar jij components.tsx hebt geplaatst.
// ────────────────────────────────────────────────────────────────────────────

export default function AthletePage() {
  // ── Core state ──
  const [db, setDb]                     = useState(INITIAL_DATABASE);
  const [mealsByDate, setMealsByDate]   = useState<Record<string,any[]>>(PRELOADED_MEALS);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [waterByDate, setWaterByDate]   = useState<Record<string,number>>({});
  const [moodByDate, setMoodByDate]     = useState<Record<string,number>>({});
  const currentWater = waterByDate[selectedDate] || 0;
  const effectiveMood: number|undefined = moodByDate[selectedDate] ?? FOOD_LOG_BY_DATE[selectedDate]?.mood;

  // ── Athlete-specific state ──
  const [trainingLog, setTrainingLog]         = useState<Record<string,any>>({});
  const [recoveryLog, setRecoveryLog]         = useState<Record<string,any>>({});
  const [bodyLog, setBodyLog]                 = useState<Record<string,any>>({});
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  const [supplementLog, setSupplementLog]     = useState<Record<string,string[]>>({});

  // ── UI state ──
  const [activeTab, setActiveTab]         = useState<"nutrition"|"training"|"recovery"|"progress">("nutrition");
  const [isWorkoutDay, setIsWorkoutDay]   = useState(true);
  const [isLoaded, setIsLoaded]           = useState(false);
  const [activeChart, setActiveChart]     = useState<"line"|"bar"|"pie"|"donut">("bar");
  const [currentTheme, setCurrentTheme]   = useState<ThemeKey>("orange");
  const [showAddMeal, setShowAddMeal]     = useState(false);
  const [showSettings, setShowSettings]   = useState(false);
  const [showScanner, setShowScanner]     = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showPRModal, setShowPRModal]     = useState(false);
  const [addMethod, setAddMethod]         = useState<"search"|"manual">("search");
  const [editingMeal, setEditingMeal]     = useState<any|null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Breakfast"|"Lunch"|"Dinner"|"Snack">(defaultCategory());
  const [productSearch, setProductSearch] = useState("");
  const [amount, setAmount]               = useState<string>("100");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSearching, setIsSearching]     = useState(false);
  const [apiResults, setApiResults]       = useState<any[]>([]);
  const [newName, setNewName]   = useState("");
  const [newCal, setNewCal]     = useState("");
  const [newProt, setNewProt]   = useState("");
  const [newCarbs, setNewCarbs] = useState("");
  const [newFats, setNewFats]   = useState("");
  const [newFiber, setNewFiber] = useState("");
  const [newSugar, setNewSugar] = useState("");
  const [weight, setWeight]     = useState<string>("80");
  const [height, setHeight]     = useState<string>("180");
  const [age, setAge]           = useState<string>("25");
  const [gender, setGender]     = useState<"male"|"female">("male");
  const [undoToast, setUndoToast] = useState<{meal:any;date:string}|null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // ── Training modal form state ──
  const [tType, setTType]         = useState("Strength");
  const [tDuration, setTDuration] = useState("");
  const [tBurn, setTBurn]         = useState("");
  const [tNotes, setTNotes]       = useState("");

  // ── Recovery modal form state ──
  const [rSleep, setRSleep]       = useState("");
  const [rQuality, setRQuality]   = useState(3);
  const [rSoreness, setRSoreness] = useState(3);
  const [rHRV, setRHRV]           = useState("");

  // ── PR modal form state ──
  const [prExercise, setPrExercise] = useState("");
  const [prValue, setPrValue]       = useState("");
  const [prUnit, setPrUnit]         = useState("kg");

  // ── Body weight modal ──
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [bwValue, setBwValue] = useState("");
  const [bfValue, setBfValue] = useState("");

  const meals           = mealsByDate[selectedDate] || [];
  const todayTraining   = trainingLog[selectedDate];
  const todayRecovery   = recoveryLog[selectedDate];
  const todayBody       = bodyLog[selectedDate];
  const todaySupplements = supplementLog[selectedDate] || [];

  // ── currentData ──
  const currentData = useMemo(() => {
    const fromLog  = FOOD_LOG_BY_DATE[selectedDate];
    const dayMeals = mealsByDate[selectedDate] || [];
    const top = [...dayMeals].sort((a,b)=>(b.cal||0)-(a.cal||0))[0];
    return {
      datum:   selectedDate,
      kcal:    fromLog?.kcal  ?? dayMeals.reduce((s,m)=>s+(m.cal||0),0),
      prot:    fromLog?.prot  ?? Math.round(dayMeals.reduce((s,m)=>s+(m.prot||0),0)),
      carbs:   fromLog?.carbs ?? Math.round(dayMeals.reduce((s,m)=>s+(m.carbs||0),0)),
      fats:    fromLog?.fats  ?? Math.round(dayMeals.reduce((s,m)=>s+(m.fats||0),0)),
      mood:    effectiveMood,
      topMeal: fromLog?.topMeal ?? top?.name ?? "—",
    };
  }, [selectedDate, mealsByDate, effectiveMood]);

  // ── Weekly stats ──
  const weeklyStats = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    const totals = days.map(date => {
      const log      = FOOD_LOG_BY_DATE[date];
      const dayMeals = mealsByDate[date] || [];
      return {
        date,
        kcal:    log?.kcal ?? dayMeals.reduce((s,m)=>s+(m.cal||0),0),
        prot:    log?.prot ?? dayMeals.reduce((s,m)=>s+(m.prot||0),0),
        trained: !!trainingLog[date],
      };
    });
    const daysWithData = totals.filter(d=>d.kcal>0);
    return {
      days: totals,
      avgKcal:   daysWithData.length ? Math.round(daysWithData.reduce((s,d)=>s+d.kcal,0)/daysWithData.length) : 0,
      avgProt:   daysWithData.length ? Math.round(daysWithData.reduce((s,d)=>s+d.prot,0)/daysWithData.length) : 0,
      trainDays: totals.filter(d=>d.trained).length,
    };
  }, [selectedDate, mealsByDate, trainingLog]);

  // ── Weight trend ──
  const weightTrend = useMemo(() => {
    return Object.entries(bodyLog)
      .sort((a,b)=>a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, v]) => ({ date, weight: v.weight, bf: v.bodyFat }));
  }, [bodyLog]);

  // ── Day index ──
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const idx = MY_FOOD_LOG.findIndex(d => d.datum === new Date().toISOString().split("T")[0]);
    return idx !== -1 ? idx : 0;
  });
  useEffect(() => {
    const idx = MY_FOOD_LOG.findIndex(d => d.datum === selectedDate);
    if (idx !== -1) setSelectedDayIndex(idx);
  }, [selectedDate]);

  // ── Barcode scanner ──
  useEffect(() => {
    if (!showScanner || !showAddMeal) return;
    let scanner: any = null;
    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      scanner = new Html5QrcodeScanner("reader",{ fps:10, qrbox:{width:250,height:150}, rememberLastUsedCamera:true, supportedScanTypes:[0] },false);
      scanner.render(async (code: string) => { scanner.clear(); setShowScanner(false); await searchByBarcode(code); }, () => {});
    });
    return () => { if (scanner) scanner.clear().catch(()=>{}); };
  }, [showScanner, showAddMeal]);

  const searchByBarcode = async (code: string) => {
    setIsSearching(true);
    try {
      const resp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await resp.json();
      if (data.status === 1) {
        const p = data.product;
        const r = { name:p.product_name||"Unknown", cal:Math.round(p.nutriments["energy-kcal_100g"]||0), prot:Number(p.nutriments.proteins_100g||0), carbs:Number(p.nutriments.carbohydrates_100g||0), fats:Number(p.nutriments.fat_100g||0), fiber:Number(p.nutriments.fiber_100g||0), sugar:Number(p.nutriments.sugars_100g||0) };
        setApiResults([r]); setSelectedProduct(r);
      } else { alert("Product not found."); }
    } catch(e){ console.error(e); } finally { setIsSearching(false); }
  };

  // ── localStorage ──
  useEffect(() => {
    const load = (key: string) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };
    const savedMeals    = load("profuel_meals_v2");
    const savedWater    = load("profuel_water_v2");
    const savedMood     = load("profuel_mood_v1");
    const savedMetrics  = load("profuel_metrics");
    const savedTheme    = localStorage.getItem("profuel_theme");
    const savedDb       = load("profuel_db");
    const savedTraining = load("profuel_training");
    const savedRecovery = load("profuel_recovery");
    const savedBody     = load("profuel_body");
    const savedPRs      = load("profuel_prs");
    const savedSupps    = load("profuel_supps");

    if (savedMeals)    setMealsByDate({ ...PRELOADED_MEALS, ...savedMeals });
    if (savedWater)    setWaterByDate(savedWater);
    if (savedMood)     setMoodByDate(savedMood);
    if (savedTheme && THEMES[savedTheme as ThemeKey]) setCurrentTheme(savedTheme as ThemeKey);
    if (savedDb)       setDb(savedDb);
    if (savedTraining) setTrainingLog(savedTraining);
    if (savedRecovery) setRecoveryLog(savedRecovery);
    if (savedBody)     setBodyLog(savedBody);
    if (savedPRs)      setPersonalRecords(savedPRs);
    if (savedSupps)    setSupplementLog(savedSupps);
    if (savedMetrics)  { const {w,h,a,g} = savedMetrics; setWeight(w||"80"); setHeight(h||"180"); setAge(a||"25"); setGender(g||"male"); }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("profuel_meals_v2",  JSON.stringify(mealsByDate));
    localStorage.setItem("profuel_water_v2",  JSON.stringify(waterByDate));
    localStorage.setItem("profuel_mood_v1",   JSON.stringify(moodByDate));
    localStorage.setItem("profuel_db",        JSON.stringify(db));
    localStorage.setItem("profuel_theme",     currentTheme);
    localStorage.setItem("profuel_metrics",   JSON.stringify({w:weight,h:height,a:age,g:gender}));
    localStorage.setItem("profuel_training",  JSON.stringify(trainingLog));
    localStorage.setItem("profuel_recovery",  JSON.stringify(recoveryLog));
    localStorage.setItem("profuel_body",      JSON.stringify(bodyLog));
    localStorage.setItem("profuel_prs",       JSON.stringify(personalRecords));
    localStorage.setItem("profuel_supps",     JSON.stringify(supplementLog));
  }, [mealsByDate,waterByDate,moodByDate,db,currentTheme,weight,height,age,gender,trainingLog,recoveryLog,bodyLog,personalRecords,supplementLog,isLoaded]);

  // ── Quick actions ──
  const quickActions = useMemo(() => {
    const counts: Record<string,number> = {};
    Object.values(mealsByDate).flat().forEach(m => { const b=m.name.split(" (")[0]; counts[b]=(counts[b]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name])=>({name,data:db[name]})).filter(i=>i.data);
  }, [mealsByDate, db]);

  const searchGlobal = async () => {
    if (!productSearch) return;
    setIsSearching(true);
    try {
      const resp = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productSearch)}&search_simple=1&action=process&json=1&page_size=8`);
      const data = await resp.json();
      const results = data.products.map((p:any) => ({ name:p.product_name||"Unknown", brand:p.brands||"Generic", cal:Math.round(p.nutriments["energy-kcal_100g"]||0), prot:Number(p.nutriments.proteins_100g||0), carbs:Number(p.nutriments.carbohydrates_100g||0), fats:Number(p.nutriments.fat_100g||0), fiber:Number(p.nutriments.fiber_100g||0), sugar:Number(p.nutriments.sugars_100g||0) })).filter((p:any)=>p.cal>0);
      setApiResults(results);
    } catch(e){ console.error(e); } finally { setIsSearching(false); }
  };

  const resetAddModal = () => {
    setShowAddMeal(false); setShowScanner(false); setSelectedProduct(null); setEditingMeal(null);
    setAmount("100"); setProductSearch(""); setApiResults([]);
    setNewName(""); setNewCal(""); setNewProt(""); setNewCarbs(""); setNewFats(""); setNewFiber(""); setNewSugar("");
    setSelectedCategory(defaultCategory());
  };

  const openEditMeal = (m: any) => {
    setEditingMeal(m); setAddMethod("manual"); setSelectedCategory(m.category);
    const base = m.name.replace(/\s*\(\d+g\)$/,"");
    setNewName(base); setNewCal(m.cal.toString()); setNewProt(m.prot.toString());
    setNewCarbs(m.carbs.toString()); setNewFats(m.fats.toString());
    setNewFiber((m.fiber||0).toString()); setNewSugar((m.sugar||0).toString());
    setAmount("100"); setShowAddMeal(true);
  };

  const addMealEntry = (name: string, data: any) => {
    if (!db[name]) setDb(prev => ({...prev,[name]:data}));
    const factor = Number(amount)/100;
    if (editingMeal) {
      const updated = {...editingMeal, name, category:selectedCategory, cal:Math.round(data.cal||0), prot:Math.round(data.prot||0), carbs:Math.round(data.carbs||0), fats:Math.round(data.fats||0), fiber:Math.round(data.fiber||0), sugar:Math.round(data.sugar||0)};
      setMealsByDate(prev => ({...prev,[selectedDate]:(prev[selectedDate]||[]).map(m=>m.id===editingMeal.id?updated:m)}));
    } else {
      const nm = { id:Date.now(), name:`${name} (${amount}g)`, category:selectedCategory, cal:Math.round((data.cal||0)*factor), prot:Math.round((data.prot||0)*factor), carbs:Math.round((data.carbs||0)*factor), fats:Math.round((data.fats||0)*factor), fiber:Math.round((data.fiber||0)*factor), sugar:Math.round((data.sugar||0)*factor), time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
      setMealsByDate(prev => ({...prev,[selectedDate]:[nm,...(prev[selectedDate]||[])]}));
    }
    resetAddModal();
  };

  const deleteMeal = (m: any) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setMealsByDate(prev => ({...prev,[selectedDate]:(prev[selectedDate]||[]).filter(x=>x.id!==m.id)}));
    setUndoToast({meal:m, date:selectedDate});
    undoTimerRef.current = setTimeout(()=>setUndoToast(null), 5000);
  };
  const undoDelete = () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setMealsByDate(prev => ({...prev,[undoToast.date]:[undoToast.meal,...(prev[undoToast.date]||[])]}));
    setUndoToast(null);
  };

  const saveTraining = () => {
    setTrainingLog(prev => ({...prev,[selectedDate]:{ type:tType, durationMin:Number(tDuration), caloriesBurned:Number(tBurn)||0, notes:tNotes }}));
    setShowTrainingModal(false);
    setTType("Strength"); setTDuration(""); setTBurn(""); setTNotes("");
  };
  const saveRecovery = () => {
    setRecoveryLog(prev => ({...prev,[selectedDate]:{ sleepHours:Number(rSleep), sleepQuality:rQuality, soreness:rSoreness, hrv:Number(rHRV)||null }}));
    setShowRecoveryModal(false);
    setRSleep(""); setRQuality(3); setRSoreness(3); setRHRV("");
  };
  const savePR = () => {
    if (!prExercise || !prValue) return;
    setPersonalRecords(prev => [...prev, { exercise:prExercise, value:Number(prValue), unit:prUnit, date:selectedDate }]);
    setShowPRModal(false); setPrExercise(""); setPrValue(""); setPrUnit("kg");
  };
  const saveBody = () => {
    if (!bwValue) return;
    setBodyLog(prev => ({...prev,[selectedDate]:{ weight:Number(bwValue), bodyFat:bfValue?Number(bfValue):null }}));
    setShowBodyModal(false); setBwValue(""); setBfValue("");
  };
  const toggleSupplement = (supp: string) => {
    setSupplementLog(prev => {
      const curr = prev[selectedDate] || [];
      const next = curr.includes(supp) ? curr.filter(s=>s!==supp) : [...curr,supp];
      return {...prev,[selectedDate]:next};
    });
  };

  const stats = useMemo(() => {
    const totalCal   = meals.reduce((s,m)=>s+(m.cal||0),0);
    const totalProt  = meals.reduce((s,m)=>s+(m.prot||0),0);
    const totalCarbs = meals.reduce((s,m)=>s+(m.carbs||0),0);
    const totalFats  = meals.reduce((s,m)=>s+(m.fats||0),0);
    const totalFiber = meals.reduce((s,m)=>s+(m.fiber||0),0);
    const totalSugar = meals.reduce((s,m)=>s+(m.sugar||0),0);
    const bmrVal = gender==="male" ? Math.round(10*Number(weight)+6.25*Number(height)-5*Number(age)+5) : Math.round(10*Number(weight)+6.25*Number(height)-5*Number(age)-161);
    const tdee = Math.round(bmrVal*1.55);
    const targetCal   = isWorkoutDay ? tdee+400 : tdee-200;
    const targetProt  = Math.round((targetCal*0.4)/4);
    const targetCarbs = Math.round((targetCal*0.3)/4);
    const targetFats  = Math.round((targetCal*0.3)/9);
    const maxVal = Math.max(totalProt,totalCarbs,totalFats,10);
    const totalMacros = totalProt+totalCarbs+totalFats||0.1;
    const wGoal  = waterGoalMl(Number(weight)||80);
    const burned = todayTraining?.caloriesBurned || 0;
    const netBalance = totalCal - targetCal;
    return {
      totalCal, totalProt, totalCarbs, totalFats, totalFiber, totalSugar,
      targetCal, tdee, targetProt, targetCarbs, targetFats, waterGoal:wGoal,
      burned, netBalance,
      pPerc:(totalProt/totalMacros)*100, cPerc:(totalCarbs/totalMacros)*100, fPerc:(totalFats/totalMacros)*100,
      pBar:(totalProt/maxVal)*100, cBar:(totalCarbs/maxVal)*100, fBar:(totalFats/maxVal)*100,
      progressPerc: Math.min((totalCal/(targetCal||1))*100,100),
      protPerKg: totalProt / (Number(weight)||80),
    };
  }, [meals, isWorkoutDay, weight, height, age, gender, todayTraining]);

  const recoveryScore = useMemo(() => {
    if (!todayRecovery) return null;
    const sleepScore   = Math.min((todayRecovery.sleepHours / 8) * 4, 4);
    const qualityScore = todayRecovery.sleepQuality;
    const sorenessScore = (10 - todayRecovery.soreness) / 10 * 1;
    return Math.round((sleepScore + qualityScore + sorenessScore) * 10) / 10;
  }, [todayRecovery]);

  // ── Calendar ──
  const today = useMemo(() => new Date(), []);
  const [activeMonth, setActiveMonth] = useState<{year:number;month:number}>({ year:today.getFullYear(), month:today.getMonth() });
  const calendarDays = useMemo(() => {
    const {year,month} = activeMonth;
    return Array.from({length:new Date(year,month+1,0).getDate()},(_,i)=>new Date(year,month,i+1).toISOString().split("T")[0]);
  }, [activeMonth]);
  const oneYearAgo = useMemo(()=>{ const d=new Date(today); d.setFullYear(d.getFullYear()-1); return {year:d.getFullYear(),month:d.getMonth()}; },[today]);
  const canGoPrev = activeMonth.year>oneYearAgo.year||(activeMonth.year===oneYearAgo.year&&activeMonth.month>oneYearAgo.month);
  const canGoNext = activeMonth.year<today.getFullYear()||(activeMonth.year===today.getFullYear()&&activeMonth.month<today.getMonth());
  const goPrevMonth = () => setActiveMonth(p=>p.month===0?{year:p.year-1,month:11}:{year:p.year,month:p.month-1});
  const goNextMonth = () => setActiveMonth(p=>p.month===11?{year:p.year+1,month:0}:{year:p.year,month:p.month+1});

  if (!isLoaded) return null;

  const handleExport = () => {
    const headers = ["Date","Category","Name","Calories","Protein","Carbs","Fats","Water(ml)","Training","Duration","Burned","Sleep","Recovery"];
    const rows = [headers];
    const allDates = Array.from(new Set([...Object.keys(mealsByDate),...Object.keys(waterByDate)])).sort();
    allDates.forEach(date => {
      (mealsByDate[date]||[]).forEach(m => rows.push([date,m.category,m.name,m.cal.toString(),m.prot.toString(),m.carbs.toString(),(m.fats??0).toString(),"","","","","",""]));
      const w = waterByDate[date]||0;
      const t = trainingLog[date];
      const r = recoveryLog[date];
      if (w>0||t||r) rows.push([date,"META","Daily Stats","","","","",w.toString(),t?.type||"",t?.durationMin?.toString()||"",t?.caloriesBurned?.toString()||"",r?.sleepHours?.toString()||"",recoveryScore?.toString()||""]);
    });
    const link = document.createElement("a");
    link.setAttribute("href","data:text/csv;charset=utf-8,"+encodeURI(rows.map(r=>r.join(",")).join("\n")));
    link.setAttribute("download",`ProFuel_Athlete_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const calPercent = currentData.kcal>0 ? Math.min((currentData.kcal/(stats.targetCal||2500))*100,100) : 0;
  const calColor   = calPercent>110 ? "#ef4444" : calPercent>90 ? "#f59e0b" : THEMES[currentTheme].p;
  const todayStr   = today.toISOString().split("T")[0];
  const T          = THEMES[currentTheme];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans pb-24">

      {/* ── HEADER ── */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl" style={{backgroundColor:T.p}}>
              <Zap size={22} className="text-slate-900"/>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white"/>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">ProFuel <span style={{color:T.p}}>Athlete</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Performance Nutrition OS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {Object.entries(THEMES).map(([t,v])=>(
              <button key={t} onClick={()=>setCurrentTheme(t as ThemeKey)} title={t.charAt(0).toUpperCase()+t.slice(1)}
                className={`w-6 h-6 rounded-full transition-all ${currentTheme===t?"scale-125 ring-2 ring-white/30":"opacity-50 hover:opacity-80"}`}
                style={{backgroundColor:v.p}}/>
            ))}
          </div>
          <button onClick={()=>setIsWorkoutDay(!isWorkoutDay)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${isWorkoutDay?"border-transparent text-white shadow-lg":"bg-slate-50 border-slate-300 text-slate-500"}`}
            style={isWorkoutDay?{backgroundColor:T.p}:{}}
          >
            {isWorkoutDay?<><Dumbbell size={14}/> Training</>:<><Moon size={14}/> Rest</>}
          </button>
          <button onClick={()=>setShowSettings(true)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
            <Settings size={18}/>
          </button>
        </div>
      </header>

      {/* ── TABS ── */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 w-fit shadow-sm">
          {([
            {id:"nutrition",icon:Utensils, label:"Nutrition"},
            {id:"training", icon:Dumbbell, label:"Training"},
            {id:"recovery", icon:Heart,    label:"Recovery"},
            {id:"progress", icon:TrendingUp,label:"Progress"},
          ] as const).map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab===tab.id?"text-slate-900 shadow-lg":"text-slate-500 hover:text-slate-600"}`}
              style={activeTab===tab.id?{backgroundColor:T.p}:{}}
            >
              <tab.icon size={14}/>{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CALENDAR ── */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-500"><CalendarIcon size={16}/><span className="text-[10px] font-black uppercase tracking-widest">History</span></div>
            <div className="flex items-center gap-3">
              <button onClick={goPrevMonth} disabled={!canGoPrev} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-20">
                <ChevronRight size={14} className="rotate-180"/>
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 min-w-32.5 text-center">
                {new Date(activeMonth.year,activeMonth.month).toLocaleDateString("en-US",{month:"long",year:"numeric"})}
              </span>
              <button onClick={goNextMonth} disabled={!canGoNext} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-20">
                <ChevronRight size={14}/>
              </button>
            </div>
            <button onClick={()=>{setActiveMonth({year:today.getFullYear(),month:today.getMonth()});setSelectedDate(todayStr);}} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
              Today
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3" style={{scrollbarWidth:"none"}}>
            {calendarDays.map(dateStr=>{
              const dObj     = new Date(dateStr);
              const isSel    = selectedDate===dateStr;
              const isT      = dateStr===todayStr;
              const hasMeals = (mealsByDate[dateStr]||[]).length>0;
              const logEntry = FOOD_LOG_BY_DATE[dateStr];
              const moodLog  = moodByDate[dateStr];
              const trained  = !!trainingLog[dateStr];
              const isFuture = dateStr>todayStr;
              const displayMood = moodLog ?? logEntry?.mood;
              return (
                <button key={dateStr} onClick={()=>!isFuture&&setSelectedDate(dateStr)} disabled={isFuture}
                  className={`flex flex-col items-center min-w-14 h-20 justify-center rounded-xl transition-all shrink-0 relative ${isSel?"text-slate-900 shadow-xl":isFuture?"text-slate-400 cursor-not-allowed":isT?"bg-slate-100 border border-slate-300 text-slate-900":"bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                  style={isSel?{backgroundColor:T.p}:{}}
                >
                  <span className="text-[7px] font-black uppercase opacity-60 mb-0.5">{dObj.toLocaleDateString("en-US",{weekday:"short"})}</span>
                  <span className="text-sm font-black">{dObj.getDate()}</span>
                  {displayMood&&!isFuture&&<span className="text-[9px] mt-0.5">{getMoodEmoji(displayMood).split(" ")[0]}</span>}
                  {trained&&!isFuture&&<span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-orange-400"/>}
                  {hasMeals&&!displayMood&&!isFuture&&<span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSel?"bg-white/60":"bg-green-400"}`}/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: NUTRITION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab==="nutrition" && (
        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0}} className="bg-white p-6 rounded-[2rem] border border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
              <div className="absolute inset-0 opacity-5" style={{background:`radial-gradient(circle at top right, ${T.p}, transparent 70%)`}}/>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Calories In</p>
              <div className="flex items-end gap-1.5 mb-3">
                <span className="text-4xl font-black italic" style={{color:calColor}}>{currentData.kcal.toLocaleString()}</span>
                <span className="text-zinc-500 text-sm mb-1 font-bold">/ {stats.targetCal}</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full rounded-full" style={{backgroundColor:calColor}} initial={{width:0}} animate={{width:`${calPercent}%`}} transition={{duration:0.8}}/>
              </div>
              <div className="flex justify-between text-[9px] font-bold">
                <span style={{color:calColor}}>{calPercent.toFixed(0)}% of goal</span>
                {stats.netBalance!==0&&(<span className={stats.netBalance>0?"text-orange-400":"text-green-400"}>{stats.netBalance>0?"+":""}{stats.netBalance} net</span>)}
              </div>
            </motion.div>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.06}} className="bg-white p-6 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Protein</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-black italic text-white">{currentData.prot}</span>
                <span className="text-zinc-500 text-xs mb-1">g / {stats.targetProt}g</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full rounded-full" style={{backgroundColor:T.p}} initial={{width:0}} animate={{width:`${Math.min((currentData.prot/(stats.targetProt||1))*100,100)}%`}} transition={{duration:0.8,delay:0.1}}/>
              </div>
              <p className="text-[9px] font-bold text-zinc-500">{stats.protPerKg.toFixed(1)}g / kg bodyweight</p>
            </motion.div>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.12}} className="bg-white p-6 rounded-[2rem] border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{backgroundColor:T.p}}/>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Mood</p>
              <p className="text-2xl font-black italic mb-3">{effectiveMood!==undefined?getMoodEmoji(effectiveMood):"— Log"}</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setMoodByDate(prev=>({...prev,[selectedDate]:n}))}
                    className={`flex-1 h-6 rounded-lg text-xs transition-all hover:scale-110 ${n<=(effectiveMood??0)?"opacity-100":"opacity-15 hover:opacity-50"}`}
                    style={{backgroundColor:T.p}}
                  >{["😞","😴","😐","🙂","🤩"][n-1]}</button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.18}} className="bg-white p-6 rounded-[2rem] border border-slate-200">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Energy Balance</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase">TDEE</span><span className="text-sm font-black text-slate-900">{stats.tdee} kcal</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase">Target</span><span className="text-sm font-black" style={{color:T.p}}>{stats.targetCal} kcal</span></div>
                {stats.burned>0&&(<div className="flex justify-between items-center"><span className="text-[10px] text-orange-500 font-bold uppercase flex items-center gap-1"><Flame size={10}/> Burned</span><span className="text-sm font-black text-orange-400">−{stats.burned} kcal</span></div>)}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-500">Net</span>
                  <span className={`text-sm font-black ${stats.netBalance>0?"text-orange-400":"text-green-400"}`}>{stats.netBalance>0?"+":""}{stats.netBalance}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Macro breakdown + chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-zinc-900 rounded-[2rem] p-8 border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Macro Breakdown</p>
                    <p className="text-4xl font-black italic mt-1">{stats.totalCal}</p>
                  </div>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {[{id:"bar",icon:ChartBar},{id:"line",icon:ChartLine},{id:"pie",icon:ChartPie},{id:"donut",icon:Circle}].map(c=>(
                      <button key={c.id} onClick={()=>setActiveChart(c.id as any)} className={`p-2 rounded-lg transition-all ${activeChart===c.id?"text-white shadow-lg":"text-slate-400 hover:text-slate-600"}`} style={activeChart===c.id?{backgroundColor:T.p}:{}}>
                        <c.icon size={16}/>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="h-48 flex justify-center items-center">
                    <AnimatePresence mode="wait">
                      {activeChart==="bar"&&(
                        <motion.div key="bar" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full flex items-end justify-around gap-3 px-2">
                          {[{l:"Prot",v:stats.pBar,c:T.p},{l:"Carb",v:stats.cBar,c:T.c},{l:"Fat",v:stats.fBar,c:T.f}].map(({l,v,c})=>(
                            <div key={l} className="flex flex-col items-center gap-2 w-full h-full justify-end">
                              <div className="w-full bg-zinc-900 rounded-t-xl relative h-full overflow-hidden">
                                <motion.div initial={{height:0}} animate={{height:`${v}%`}} className="absolute bottom-0 w-full rounded-t-lg" style={{backgroundColor:c}}/>
                              </div>
                              <span className="text-[9px] font-black uppercase" style={{color:c}}>{l}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                      {activeChart==="line"&&(
                        <motion.div key="line" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full flex flex-col items-center justify-center">
                          <svg viewBox="0 0 100 40" className="w-full h-32 overflow-visible">
                            {(["prot","carbs","fats"] as const).map((macro,idx)=>{
                              const c   = idx===0?T.p:idx===1?T.c:T.f;
                              const tar = idx===0?stats.targetProt:idx===1?stats.targetCarbs:stats.targetFats;
                              const rev = meals.slice().reverse();
                              const path = rev.length>0?`M 0 40 ${rev.map((_,i)=>{ const x=(i+1)*(100/rev.length); const tot=rev.slice(0,i+1).reduce((s,m)=>s+(m[macro]||0),0); const y=40-Math.min((tot/(tar||1))*35,38); return `L ${x} ${y}`; }).join(" ")}`:"M 0 35 L 100 35";
                              return (
                                <g key={macro}>
                                  <motion.path d={path} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:1,delay:idx*0.2}}/>
                                  {rev.map((m,i)=>{ const x=(i+1)*(100/rev.length); const tot=rev.slice(0,i+1).reduce((s,meal)=>s+(meal[macro]||0),0); const y=40-Math.min((tot/(tar||1))*35,38); return <motion.circle key={`${m.id}-${macro}`} initial={{scale:0}} animate={{scale:1}} transition={{delay:1+i*0.1}} cx={x} cy={y} r="1.2" fill="white" stroke={c} strokeWidth="0.8"/>; })}
                                </g>
                              );
                            })}
                          </svg>
                          <div className="flex gap-4 mt-2">{[{l:"Prot",c:T.p},{l:"Carb",c:T.c},{l:"Fat",c:T.f}].map(item=>(<div key={item.l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor:item.c}}/><span className="text-[8px] font-black uppercase text-slate-500">{item.l}</span></div>))}</div>
                        </motion.div>
                      )}
                      {(activeChart==="donut"||activeChart==="pie")&&(
                        <motion.div key="circle" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="relative w-44 h-44">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
                            {[{p:100,c:"rgba(255,255,255,0.04)",o:0},{p:stats.pPerc,c:T.p,o:0},{p:stats.cPerc,c:T.c,o:stats.pPerc},{p:stats.fPerc,c:T.f,o:stats.pPerc+stats.cPerc}].map(({p,c,o},i)=>{
                              const r=activeChart==="pie"?25:38; const sw=activeChart==="pie"?50:10; const C=2*Math.PI*r;
                              return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={`${(p/100)*C} ${C}`} strokeDashoffset={`${-(o/100)*C}`}/>;
                            })}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black italic">{stats.totalCal}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">kcal</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-4">
                    {[
                      {label:"Protein",cur:stats.totalProt, tar:stats.targetProt, c:T.p},
                      {label:"Carbs",  cur:stats.totalCarbs,tar:stats.targetCarbs,c:T.c},
                      {label:"Fats",   cur:stats.totalFats, tar:stats.targetFats, c:T.f},
                    ].map(m=>(
                      <div key={m.label}>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                          <span className="text-slate-500">{m.label}</span>
                          <span className="text-slate-900">{m.cur}g <span className="text-slate-400">/ {m.tar}g</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{width:0}} animate={{width:`${Math.min((m.cur/m.tar)*100,100)}%`}} className="h-full rounded-full" style={{backgroundColor:m.c}}/>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-200 flex gap-4">
                      <div className="flex items-center gap-1.5"><Leaf size={12} className="text-green-400"/><div><p className="text-[8px] text-slate-400 uppercase font-black">Fiber</p><p className="text-xs font-black">{stats.totalFiber}g</p></div></div>
                      <div className="flex items-center gap-1.5"><Candy size={12} className="text-pink-400"/><div><p className="text-[8px] text-slate-400 uppercase font-black">Sugar</p><p className="text-xs font-black">{stats.totalSugar}g</p></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Water + Supplements */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Droplets size={20} className="text-blue-400 mb-1"/>
                    <p className="text-sm font-black uppercase italic">Hydration</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{(stats.waterGoal/1000).toFixed(1)}L goal ({Number(weight)}kg × 35ml)</p>
                  </div>
                  <button onClick={()=>setWaterByDate({...waterByDate,[selectedDate]:0})} className="text-slate-400 hover:text-slate-600 transition-colors"><RefreshCw size={14}/></button>
                </div>
                <p className="text-3xl font-black italic text-blue-600 mb-1">{currentWater}<span className="text-sm text-slate-500 not-italic"> ml</span></p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <motion.div className="h-full bg-blue-500 rounded-full" initial={{width:0}} animate={{width:`${Math.min((currentWater/stats.waterGoal)*100,100)}%`}} transition={{type:"spring",stiffness:40}}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setWaterByDate({...waterByDate,[selectedDate]:currentWater+250})} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase hover:bg-blue-500/20 transition-all">+250ml</button>
                  <button onClick={()=>setWaterByDate({...waterByDate,[selectedDate]:currentWater+500})} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase hover:bg-blue-500/20 transition-all">+500ml</button>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Syringe size={16} style={{color:T.p}}/>
                  <p className="text-sm font-black uppercase italic">Supplements</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUPPLEMENT_LIST.slice(0,8).map(s=>{
                    const taken = todaySupplements.includes(s);
                    return (
                      <button key={s} onClick={()=>toggleSupplement(s)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${taken?"text-white":"bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                        style={taken?{backgroundColor:T.p}:{}}
                      >{s}</button>
                    );
                  })}
                </div>
                {todaySupplements.length>0&&(<p className="text-[9px] text-slate-400 font-bold uppercase mt-3">{todaySupplements.length} taken today</p>)}
              </div>
            </div>
          </div>

          {/* Meal list */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                {quickActions.map((qa,i)=>(
                  <button key={i} onClick={()=>{setProductSearch(qa.name);setSelectedProduct(qa.data);setShowAddMeal(true);}} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all text-sm border border-slate-200">
                    {qa.name[0]}
                  </button>
                ))}
                {quickActions.length>0&&<span className="text-[9px] font-black uppercase text-slate-400">Quick Log</span>}
              </div>
              <button onClick={()=>{setEditingMeal(null);setSelectedCategory(defaultCategory());setShowAddMeal(true);}}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:scale-105 transition-all text-white"
                style={{backgroundColor:T.p}}
              >
                <Plus size={14}/> Add Intake
              </button>
            </div>
            <div className="space-y-6">
              {(["Breakfast","Lunch","Dinner","Snack"] as const).map(cat=>{
                const catMeals = meals.filter(m=>m.category===cat);
                if (catMeals.length===0&&meals.length>0) return null;
                if (meals.length===0&&cat!=="Breakfast") return null;
                return (
                  <div key={cat}>
                    {catMeals.length>0&&(<p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-3">{cat}</p>)}
                    <div className="space-y-2">
                      {catMeals.map(m=>(
                        <div key={m.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-slate-300 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${T.p}20`}}>
                              <Utensils size={16} style={{color:T.p}}/>
                            </div>
                            <div>
                              <p className="font-black text-sm text-slate-900">{m.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">
                                {m.time} · <span style={{color:T.p}}>{m.prot}g P</span> · {m.carbs}g C · {m.fats}g F
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-black italic">{m.cal} <span className="text-[9px] not-italic text-slate-400">kcal</span></p>
                            <button onClick={()=>openEditMeal(m)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={14}/></button>
                            <button onClick={()=>deleteMeal(m)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: TRAINING
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab==="training"&&(
        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
          <div className="bg-zinc-900 rounded-[2rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Today's Session</p>
                <p className="text-xl font-black italic text-white mt-1">{selectedDate}</p>
              </div>
              <button onClick={()=>{
                if(todayTraining){setTType(todayTraining.type);setTDuration(todayTraining.durationMin?.toString()||"");setTBurn(todayTraining.caloriesBurned?.toString()||"");setTNotes(todayTraining.notes||"");}
                setShowTrainingModal(true);
              }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase text-white" style={{backgroundColor:T.p}}>
                <Dumbbell size={14}/>{todayTraining?"Edit":"Log Training"}
              </button>
            </div>
            {todayTraining?(
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {label:"Sport",       value:todayTraining.type,                                   icon:Dumbbell, color:T.p},
                  {label:"Duration",    value:`${todayTraining.durationMin} min`,                   icon:Timer,    color:"#60a5fa"},
                  {label:"Burned",      value:`${todayTraining.caloriesBurned} kcal`,               icon:Flame,    color:"#f97316"},
                  {label:"Net Balance", value:`${stats.netBalance>0?"+":""}${stats.netBalance}`,    icon:BarChart3, color:stats.netBalance>0?"#f97316":"#22c55e"},
                ].map(({label,value,icon:Icon,color})=>(
                  <div key={label} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <Icon size={16} className="mb-2" style={{color}}/>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-xl font-black italic" style={{color}}>{value}</p>
                  </div>
                ))}
                {todayTraining.notes&&(
                  <div className="col-span-2 md:col-span-4 bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Session Notes</p>
                    <p className="text-sm text-zinc-300 font-medium">{todayTraining.notes}</p>
                  </div>
                )}
              </div>
            ):(
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <Dumbbell size={40} className="mb-3"/>
                <p className="text-sm font-black uppercase text-zinc-500">No training logged yet</p>
                <p className="text-[9px] text-zinc-600 mt-1">Log your session to track calories burned & balance</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">7-Day Training Overview</p>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weeklyStats.days.map((d,i)=>{
                const dObj    = new Date(d.date);
                const isToday = d.date===todayStr;
                return (
                  <div key={i} className={`flex flex-col items-center p-3 rounded-xl border ${isToday?"border-slate-400 bg-slate-100":"border-slate-200"}`}>
                    <span className="text-[8px] font-black text-slate-500 uppercase mb-2">{dObj.toLocaleDateString("en-US",{weekday:"short"})}</span>
                    <div className="w-full h-16 bg-slate-100 rounded-lg relative overflow-hidden mb-2">
                      {d.kcal>0&&(<div className="absolute bottom-0 w-full rounded-t-md transition-all" style={{height:`${Math.min((d.kcal/3000)*100,100)}%`, backgroundColor:d.trained?T.p:"#3f3f46"}}/>)}
                    </div>
                    <span className="text-[8px] font-bold text-slate-500">{d.kcal>0?`${(d.kcal/1000).toFixed(1)}k`:"—"}</span>
                    {d.trained&&<span className="w-1.5 h-1.5 rounded-full mt-1" style={{backgroundColor:T.p}}/>}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {label:"Avg Calories", value:`${weeklyStats.avgKcal} kcal`, icon:Flame},
                {label:"Avg Protein",  value:`${weeklyStats.avgProt}g`,     icon:Target},
                {label:"Training Days",value:`${weeklyStats.trainDays} / 7`,icon:Dumbbell},
              ].map(({label,value,icon:Icon})=>(
                <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <Icon size={14} className="mb-2 text-slate-500"/>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-lg font-black italic" style={{color:T.p}}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Personal Records</p>
                <p className="text-lg font-black italic mt-0.5">All-time PRs 🏆</p>
              </div>
              <button onClick={()=>setShowPRModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[9px] uppercase text-white" style={{backgroundColor:T.p}}>
                <Award size={12}/> Add PR
              </button>
            </div>
            {personalRecords.length>0?(
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {personalRecords.map((pr,i)=>(
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative">
                    <Award size={12} className="absolute top-3 right-3" style={{color:T.p}}/>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{pr.exercise}</p>
                    <p className="text-xl font-black italic" style={{color:T.p}}>{pr.value}<span className="text-xs text-slate-500 ml-1 not-italic">{pr.unit}</span></p>
                    <p className="text-[8px] text-slate-400 mt-1">{pr.date}</p>
                    <button onClick={()=>setPersonalRecords(prev=>prev.filter((_,j)=>j!==i))} className="absolute bottom-2 right-2 p-1 text-slate-400 hover:text-red-400 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100">
                      <X size={10}/>
                    </button>
                  </div>
                ))}
              </div>
            ):(
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <Award size={32} className="mb-3"/>
                <p className="text-sm font-black uppercase text-slate-500">No PRs logged yet</p>
                <p className="text-[9px] text-slate-400 mt-1">Track your squat, bench, deadlift, run times…</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: RECOVERY
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab==="recovery"&&(
        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-[2rem] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Recovery Status</p>
                  <p className="text-lg font-black italic text-white mt-0.5">{selectedDate}</p>
                </div>
                <button onClick={()=>{
                  if(todayRecovery){setRSleep(todayRecovery.sleepHours?.toString()||"");setRQuality(todayRecovery.sleepQuality||3);setRSoreness(todayRecovery.soreness||3);setRHRV(todayRecovery.hrv?.toString()||"");}
                  setShowRecoveryModal(true);
                }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase text-white" style={{backgroundColor:T.p}}>
                  <Heart size={14}/>{todayRecovery?"Edit":"Log Recovery"}
                </button>
              </div>
              {todayRecovery?(
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
                        <circle cx="50" cy="50" r="40" fill="none" stroke={getRecoveryColor(recoveryScore||0)} strokeWidth="12" strokeDasharray={`${((recoveryScore||0)/10)*251} 251`} strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">{recoveryScore?.toFixed(1)}</span>
                        <span className="text-[8px] text-slate-500 uppercase font-bold">/10</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-black italic" style={{color:getRecoveryColor(recoveryScore||0)}}>{getRecoveryLabel(recoveryScore||0)}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Recovery Status</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {label:"Sleep",   value:`${todayRecovery.sleepHours}h`,        icon:Moon,    color:"#818cf8", sub:"duration"},
                      {label:"Quality", value:`${todayRecovery.sleepQuality}/5`,     icon:Battery, color:"#34d399", sub:"sleep quality"},
                      {label:"Soreness",value:`${todayRecovery.soreness}/10`,        icon:Zap,     color:"#fb7185", sub:"muscle"},
                    ].map(({label,value,icon:Icon,color,sub})=>(
                      <div key={label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <Icon size={14} style={{color}} className="mb-2"/>
                        <p className="text-[8px] text-slate-400 uppercase font-black">{sub}</p>
                        <p className="text-lg font-black italic" style={{color}}>{value}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{label}</p>
                      </div>
                    ))}
                  </div>
                  {todayRecovery.hrv&&(
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">HRV</p>
                        <p className="text-xl font-black italic text-green-400">{todayRecovery.hrv} ms</p>
                      </div>
                      <Heart size={24} className="text-green-400 opacity-30"/>
                    </div>
                  )}
                </div>
              ):(
                <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                  <Heart size={40} className="mb-3"/>
                  <p className="text-sm font-black uppercase text-zinc-500">No recovery data</p>
                  <p className="text-[9px] text-zinc-600 mt-1">Log sleep, soreness & HRV for a recovery score</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Nutrition for Recovery</p>
              <div className="space-y-4">
                {[
                  {label:"Protein intake",     current:stats.totalProt, target:stats.targetProt, unit:"g",    tip:"Aim for 1.6–2.2g/kg for muscle repair",     color:T.p},
                  {label:"Hydration",          current:currentWater,    target:stats.waterGoal,  unit:"ml",   tip:"Proper hydration accelerates recovery",      color:"#60a5fa"},
                  {label:"Calories vs target", current:stats.totalCal,  target:stats.targetCal,  unit:"kcal", tip:"Undereating slows recovery significantly",   color:"#34d399"},
                ].map(({label,current,target,unit,tip,color})=>{
                  const pct = Math.min((current/(target||1))*100,100);
                  return (
                    <div key={label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black text-slate-600 uppercase">{label}</p>
                        <p className="text-sm font-black" style={{color}}>{current}<span className="text-slate-500 text-[9px]"> / {target}{unit}</span></p>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:color}}/>
                      </div>
                      <p className="text-[8px] text-slate-400 font-bold">{tip}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Today's Supplements</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {SUPPLEMENT_LIST.map(s=>{
                const taken = todaySupplements.includes(s);
                return (
                  <button key={s} onClick={()=>toggleSupplement(s)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${taken?"border-transparent":"bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-600"}`}
                    style={taken?{backgroundColor:`${T.p}25`,borderColor:T.p,color:T.p}:{}}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${taken?"":"bg-slate-200"}`} style={taken?{backgroundColor:T.p}:{}}>
                      {taken?<Check size={14} className="text-slate-900"/>:<Plus size={14} className="text-slate-500"/>}
                    </div>
                    <span className="text-[8px] font-black uppercase text-center leading-tight">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: PROGRESS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab==="progress"&&(
        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Body Composition</p>
                <p className="text-lg font-black italic mt-0.5">Weight & Body Fat Trend</p>
              </div>
              <button onClick={()=>{if(todayBody){setBwValue(todayBody.weight?.toString()||"");setBfValue(todayBody.bodyFat?.toString()||"");}setShowBodyModal(true);}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase text-white" style={{backgroundColor:T.p}}>
                <Scale size={14}/>{todayBody?"Update":"Log Weight"}
              </button>
            </div>
            {weightTrend.length>0?(
              <div className="space-y-6">
                <div className="h-40 relative">
                  <svg viewBox={`0 0 ${Math.max(weightTrend.length-1,1)*40+40} 80`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {weightTrend.length>1&&(()=>{
                      const minW   = Math.min(...weightTrend.map(d=>d.weight));
                      const maxW   = Math.max(...weightTrend.map(d=>d.weight));
                      const range  = (maxW-minW)||1;
                      const points = weightTrend.map((d,i)=>({x:i*40+20, y:70-((d.weight-minW)/range)*60}));
                      const path   = points.map((p,i)=>i===0?`M ${p.x} ${p.y}`:`L ${p.x} ${p.y}`).join(" ");
                      const area   = `${path} L ${points[points.length-1].x} 80 L ${points[0].x} 80 Z`;
                      return (
                        <>
                          <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.p} stopOpacity="0.3"/><stop offset="100%" stopColor={T.p} stopOpacity="0"/></linearGradient></defs>
                          <path d={area} fill="url(#wg)"/>
                          <path d={path} fill="none" stroke={T.p} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={T.p} stroke="white" strokeWidth="1.5"/>)}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weightTrend.slice(-4).reverse().map((e,i)=>(
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">{e.date}</p>
                      <p className="text-xl font-black italic" style={{color:T.p}}>{e.weight}<span className="text-xs text-slate-500 not-italic"> kg</span></p>
                      {e.bf&&<p className="text-[9px] text-slate-500 font-bold">{e.bf}% body fat</p>}
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <Scale size={40} className="mb-3"/>
                <p className="text-sm font-black uppercase text-slate-500">No weight logged</p>
                <p className="text-[9px] text-slate-400 mt-1">Track your body composition over time</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">7-Day Rolling Averages</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {label:"Avg Calories",  value:weeklyStats.avgKcal,                                        unit:"kcal",  icon:Flame,    color:T.p},
                {label:"Avg Protein",   value:weeklyStats.avgProt,                                        unit:"g",     icon:Target,   color:T.c},
                {label:"Training Days", value:weeklyStats.trainDays,                                      unit:"/ 7",   icon:Dumbbell, color:"#f97316"},
                {label:"Protein / kg",  value:(weeklyStats.avgProt/(Number(weight)||80)).toFixed(1),     unit:"g/kg",  icon:TrendingUp,color:"#34d399"},
              ].map(({label,value,unit,icon:Icon,color})=>(
                <div key={label} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <Icon size={16} style={{color}} className="mb-3"/>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-2xl font-black italic" style={{color}}>{value}<span className="text-xs text-slate-400 not-italic ml-1">{unit}</span></p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklyStats.days.map((d,i)=>{
                const dObj = new Date(d.date);
                const pct  = Math.min((d.kcal/(weeklyStats.avgKcal*1.5||3000))*100,100);
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-[8px] text-slate-400 font-bold">{d.kcal>0?(d.kcal/1000).toFixed(1)+"k":"—"}</span>
                    <div className="w-full h-20 bg-slate-100 rounded-xl relative overflow-hidden">
                      <div className="absolute bottom-0 w-full rounded-t-lg transition-all" style={{height:`${pct}%`, backgroundColor:d.trained?T.p:"#3f3f46"}}/>
                    </div>
                    <span className="text-[7px] font-black text-slate-400 uppercase">{dObj.toLocaleDateString("en-US",{weekday:"short"})}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS (uit components.tsx) ── */}
      <AddMealModal
        showAddMeal={showAddMeal}
        editingMeal={editingMeal}
        addMethod={addMethod} setAddMethod={setAddMethod}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        productSearch={productSearch} setProductSearch={setProductSearch}
        amount={amount} setAmount={setAmount}
        selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}
        isSearching={isSearching} apiResults={apiResults}
        showScanner={showScanner} setShowScanner={setShowScanner}
        newName={newName} setNewName={setNewName}
        newCal={newCal}   setNewCal={setNewCal}
        newProt={newProt} setNewProt={setNewProt}
        newCarbs={newCarbs} setNewCarbs={setNewCarbs}
        newFats={newFats} setNewFats={setNewFats}
        newFiber={newFiber} setNewFiber={setNewFiber}
        newSugar={newSugar} setNewSugar={setNewSugar}
        onReset={resetAddModal}
        onSearchGlobal={searchGlobal}
        onAddMealEntry={addMealEntry}
        theme={T}
      />

      <TrainingModal
        show={showTrainingModal}
        tType={tType} setTType={setTType}
        tDuration={tDuration} setTDuration={setTDuration}
        tBurn={tBurn} setTBurn={setTBurn}
        tNotes={tNotes} setTNotes={setTNotes}
        onClose={()=>setShowTrainingModal(false)}
        onSave={saveTraining}
        theme={T}
      />

      <RecoveryModal
        show={showRecoveryModal}
        rSleep={rSleep} setRSleep={setRSleep}
        rQuality={rQuality} setRQuality={setRQuality}
        rSoreness={rSoreness} setRSoreness={setRSoreness}
        rHRV={rHRV} setRHRV={setRHRV}
        onClose={()=>setShowRecoveryModal(false)}
        onSave={saveRecovery}
        theme={T}
      />

      <PRModal
        show={showPRModal}
        prExercise={prExercise} setPrExercise={setPrExercise}
        prValue={prValue} setPrValue={setPrValue}
        prUnit={prUnit} setPrUnit={setPrUnit}
        onClose={()=>setShowPRModal(false)}
        onSave={savePR}
        theme={T}
      />

      <BodyModal
        show={showBodyModal}
        bwValue={bwValue} setBwValue={setBwValue}
        bfValue={bfValue} setBfValue={setBfValue}
        onClose={()=>setShowBodyModal(false)}
        onSave={saveBody}
        theme={T}
      />

      <SettingsModal
        show={showSettings}
        weight={weight} setWeight={setWeight}
        height={height} setHeight={setHeight}
        age={age}       setAge={setAge}
        gender={gender} setGender={setGender}
        currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}
        onClose={()=>setShowSettings(false)}
        onExport={handleExport}
        theme={T}
      />

      <UndoToast undoToast={undoToast} onUndo={undoDelete} theme={T}/>

    </main>
  );
}