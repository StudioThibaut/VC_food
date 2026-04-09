"use client";

// ═══════════════════════════════════════════════════════════════════════════
// PROFUEL ATHLETE — components.tsx
// Alle gedeelde constanten, helpers, types en UI-componenten.
// Importeer wat je nodig hebt met:
//   import { THEMES, MealRow, ... } from "@/components/profuel/components"
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Plus, X, Trash2, Utensils, Check,
  Droplets, Leaf, Candy, ChevronRight,
  Pencil, RotateCcw, Dumbbell, Zap, Moon,
  Award, Flame, Heart, Timer, BarChart3,
  Scale, Battery, Syringe, Target,
  Search, Globe, Loader2, Barcode,
  ChartBar, ChartPie, ChartLine, Circle,
  Download, Settings, RefreshCw,
  TrendingUp, CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTEN
// ─────────────────────────────────────────────────────────────────────────────

export const THEMES = {
  gray:  { p: "#64748b", c: "#94a3b8", f: "#cbd5e1", accent: "bg-slate-700",  text: "text-slate-500"  },
  blue:  { p: "#3b82f6", c: "#60a5fa", f: "#93c5fd", accent: "bg-blue-600",   text: "text-blue-500"   },
  pink:  { p: "#ec4899", c: "#f472b6", f: "#fbcfe8", accent: "bg-pink-600",   text: "text-pink-500"   },
  green: { p: "#22c55e", c: "#4ade80", f: "#86efac", accent: "bg-green-600",  text: "text-green-500"  },
  orange:{ p: "#f97316", c: "#fb923c", f: "#fed7aa", accent: "bg-orange-500", text: "text-orange-500" },
} as const;

export type ThemeKey = keyof typeof THEMES;
export type Theme = typeof THEMES[ThemeKey];

export const SPORT_TYPES = [
  "Strength","Cardio","HIIT","Cycling","Swimming","Running","Crossfit","Yoga","Rest",
];

export const SUPPLEMENT_LIST = [
  "Creatine","Whey Protein","Casein","BCAA","Pre-workout",
  "Omega-3","Vitamin D","Magnesium","Zinc","Caffeine","Collagen","Multivitamin",
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

export const MY_FOOD_LOG = [
  { datum: "2026-02-15", kcal: 3928, prot: 188.2, carbs: 308.4, fats: 193.9, mood: 3, topMeal: "Steppegras met steak" },
  { datum: "2026-02-16", kcal: 663,  prot: 24.4,  carbs: 79.9,  fats: 25.9,  mood: 3, topMeal: "Lasagne" },
  { datum: "2026-02-17", kcal: 2632, prot: 42.8,  carbs: 303.7, fats: 136.1, mood: 4, topMeal: "10 sprits koeken" },
  { datum: "2026-02-18", kcal: 1757, prot: 55.9,  carbs: 194.4, fats: 81.6,  mood: 3, topMeal: "4 hotdogs met gedroogde ajuintjes" },
  { datum: "2026-02-19", kcal: 1479, prot: 38.5,  carbs: 163.1, fats: 77.1,  mood: 3, topMeal: "Magnum utopia (ijs)" },
  { datum: "2026-02-20", kcal: 1856, prot: 37.1,  carbs: 172.1, fats: 103.4, mood: 3, topMeal: "2 bickey burger" },
  { datum: "2026-02-21", kcal: 2506, prot: 87.2,  carbs: 212.5, fats: 122.2, mood: 4, topMeal: "Steppegras met steak" },
  { datum: "2026-02-22", kcal: 2063, prot: 117.4, carbs: 93.9,  fats: 90.2,  mood: 5, topMeal: "All you can eat (ABC restaurant)" },
  { datum: "2026-02-23", kcal: 1937, prot: 107.5, carbs: 125.2, fats: 89.5,  mood: 3, topMeal: "14 kip nuggets" },
  { datum: "2026-02-24", kcal: 2008, prot: 105.2, carbs: 149.0, fats: 74.3,  mood: 3, topMeal: "Spinaziepuree met worst" },
  { datum: "2026-02-25", kcal: 1969, prot: 122.8, carbs: 59.0,  fats: 58.4,  mood: 4, topMeal: "Pasta carbonara" },
  { datum: "2026-02-26", kcal: 2478, prot: 192.6, carbs: 137.6, fats: 83.5,  mood: 3, topMeal: "Rijst met witte vis" },
];

export const FOOD_LOG_BY_DATE = Object.fromEntries(MY_FOOD_LOG.map(d => [d.datum, d]));

export const RAW_HISTORY: [string,string,string,string,number,number,number,number,number][] = [
  ["2026-02-15","12:00","middag","3 tijgerpistolets met paardenspek en kalkoensalami",475,67.4,82.5,50.3,1060],
  ["2026-02-15","12:00","dessert","koffiekoek met pudding en chocolade",130,61.1,4.9,14.3,395],
  ["2026-02-15","17:15","avond","tomatensoep",250,7.8,1.8,3.3,73],
  ["2026-02-15","17:15","drinken","coca cola",330,53.1,0,0,210],
  ["2026-02-15","17:45","avond","steppegras met steak",900,108,99,126,2070],
  ["2026-02-15","18:00","drinken","coca cola zero",330,0,0,0,0],
  ["2026-02-15","18:30","dessert","home made limonade",500,11,0,0,120],
  ["2026-02-16","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-16","12:00","middag","tomatensoep",300,21.9,4.8,2.1,129],
  ["2026-02-16","17:30","avond","lasagne",280,33.6,19.6,23.8,431],
  ["2026-02-16","21:30","drinken","ice tea",500,24,0,0,100],
  ["2026-02-17","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-17","12:00","middag","romige tomatensoep",600,31.4,8.6,22.8,382],
  ["2026-02-17","15:00","snack","10 sprits koeken",130,75.6,6.5,40.2,692],
  ["2026-02-17","17:30","avond","parika - tomaten soep",200,14,2,8,160],
  ["2026-02-17","17:40","avond","rijst met loempia",275,74.3,13.5,7.1,391],
  ["2026-02-17","21:00","snack","bolognese chips",200,108,12.2,58,1004],
  ["2026-02-18","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-18","12:00","middag","4 hotdogs met gedroogde ajuintjes",256,118.7,21.3,44.4,976],
  ["2026-02-18","17:30","avond","spahetti bolognese",375,41.3,19.1,14.6,386],
  ["2026-02-18","22:30","snack","broccoli soep",450,34,15.5,22.6,392],
  ["2026-02-19","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-19","12:00","middag","royco curry soep",500,33,3.5,9,230],
  ["2026-02-19","17:15","avond","curry madras",240,33.6,13,9.1,276],
  ["2026-02-19","22:30","snack","magnum utopia (ijs)",310,96.1,14.3,58.9,970],
  ["2026-02-20","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-20","12:00","middag","curry madras",240,33.6,13,9.1,276],
  ["2026-02-20","15:00","snack","10 sprits koeken",130,75.6,6.5,40.2,692],
  ["2026-02-20","18:00","avond","viandel",125,18,8,29,370],
  ["2026-02-20","18:00","avond","2 bickey burger",150,44.4,22.8,25.2,515],
  ["2026-02-21","08:00","ontbijt","kelloggs",125,101.3,8.9,2,471],
  ["2026-02-21","12:00","middag","2 tijgerpistolets met kalkoensalami",330,45.3,50.8,43.1,770],
  ["2026-02-21","19:00","avond","steppegras met steak",550,66,60.5,77,1265],
  ["2026-02-22","12:00","middag","pasta carbonara",150,66.4,23,22.2,563],
  ["2026-02-22","19:00","avond","all you can eat (ABC restaurant)",1200,168.4,70.9,68,1500],
  ["2026-02-23","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-23","12:00","middag","14 kip nuggets",630,107.1,100.8,81.9,1569],
  ["2026-02-23","17:30","avond","noodles kip",210,47,24.4,7.6,365],
  ["2026-02-24","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-24","12:00","middag","tomaten soep",300,21.9,4.8,2.1,129],
  ["2026-02-24","12:00","middag","noodles kip",210,47,24.4,7.6,365],
  ["2026-02-24","17:30","avond","spinaziepuree met worst",460,40.4,17,32.2,505],
  ["2026-02-24","23:30","snack","spinaziepuree met worst",460,40.4,17,32.2,505],
  ["2026-02-25","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-25","12:00","middag","wortel pompoen soep",1000,56,13,14,420],
  ["2026-02-25","18:00","avond","pasta carbonara",150,66.4,23,22.2,563],
  ["2026-02-25","22:30","snack","pasta carbonara",150,66.4,23,22.2,563],
  ["2026-02-26","07:00","drinken","thee",300,0.4,0,0,3],
  ["2026-02-26","12:00","middag","14 kip nuggets",630,107.1,100.8,81.9,1569],
  ["2026-02-26","17:30","avond","rijst met witte vis",325,42.5,36.4,0.8,303],
  ["2026-02-26","22:30","snack","rijst met witte vis",325,42.5,36.4,0.8,303],
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function mapCategory(dutch: string): "Breakfast" | "Lunch" | "Dinner" | "Snack" {
  const d = dutch.toLowerCase();
  if (d.includes("ontbijt")) return "Breakfast";
  if (d.includes("middag"))  return "Lunch";
  if (d.includes("avond"))   return "Dinner";
  if (d.includes("snack") || d.includes("dessert") || d.includes("drinken")) return "Snack";
  return "Snack";
}

export function defaultCategory(): "Breakfast" | "Lunch" | "Dinner" | "Snack" {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 14) return "Lunch";
  if (h < 20) return "Dinner";
  return "Snack";
}

export function waterGoalMl(weightKg: number): number {
  return Math.round(weightKg * 35);
}

export function getMoodEmoji(score: number): string {
  if (score >= 5) return "🤩 Super!";
  if (score >= 4) return "🙂 Goed";
  if (score >= 3) return "😐 Neutraal";
  if (score >= 2) return "😴 Moe";
  return "😞 Slecht";
}

export function getRecoveryLabel(score: number): string {
  if (score >= 9) return "Peak";
  if (score >= 7) return "Good";
  if (score >= 5) return "Moderate";
  if (score >= 3) return "Low";
  return "Poor";
}

export function getRecoveryColor(score: number): string {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#84cc16";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

export function buildInitialMeals(): Record<string, any[]> {
  const r: Record<string, any[]> = {};
  RAW_HISTORY.forEach(([date, time, cat, name,, prot, carbs, fats, cal], idx) => {
    const m = {
      id: 1000000 + idx,
      name,
      category: mapCategory(cat),
      cal,
      prot: Math.round(prot),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      fiber: 0,
      sugar: 0,
      time,
    };
    if (!r[date]) r[date] = [];
    r[date].push(m);
  });
  return r;
}

export const PRELOADED_MEALS = buildInitialMeals();
export const INITIAL_DATABASE: Record<string, any> = {};

// ─────────────────────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────────────────────

// ── AddMealModal ──────────────────────────────────────────────────────────────
interface AddMealModalProps {
  showAddMeal: boolean;
  editingMeal: any | null;
  addMethod: "search" | "manual";
  setAddMethod: (v: "search" | "manual") => void;
  selectedCategory: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  setSelectedCategory: (v: "Breakfast" | "Lunch" | "Dinner" | "Snack") => void;
  productSearch: string;
  setProductSearch: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  selectedProduct: any | null;
  setSelectedProduct: (v: any) => void;
  isSearching: boolean;
  apiResults: any[];
  showScanner: boolean;
  setShowScanner: (v: boolean) => void;
  newName: string; setNewName: (v: string) => void;
  newCal: string;  setNewCal:  (v: string) => void;
  newProt: string; setNewProt: (v: string) => void;
  newCarbs: string;setNewCarbs:(v: string) => void;
  newFats: string; setNewFats: (v: string) => void;
  newFiber: string;setNewFiber:(v: string) => void;
  newSugar: string;setNewSugar:(v: string) => void;
  onReset: () => void;
  onSearchGlobal: () => void;
  onAddMealEntry: (name: string, data: any) => void;
  theme: Theme;
}

export function AddMealModal({
  showAddMeal, editingMeal, addMethod, setAddMethod,
  selectedCategory, setSelectedCategory,
  productSearch, setProductSearch,
  amount, setAmount,
  selectedProduct, setSelectedProduct,
  isSearching, apiResults,
  showScanner, setShowScanner,
  newName, setNewName, newCal, setNewCal,
  newProt, setNewProt, newCarbs, setNewCarbs,
  newFats, setNewFats, newFiber, setNewFiber, newSugar, setNewSugar,
  onReset, onSearchGlobal, onAddMealEntry, theme: T,
}: AddMealModalProps) {
  return (
    <AnimatePresence>
      {showAddMeal && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white border border-slate-200 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic">{editingMeal ? "Edit Intake" : "Add Intake"}</h2>
              <button onClick={onReset} className="p-2 bg-slate-100 rounded-xl hover:text-red-400 transition-colors"><X size={18}/></button>
            </div>
            <div className="space-y-5">
              {!editingMeal && (
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                  <button onClick={()=>setAddMethod("search")} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${addMethod==="search"?"bg-slate-200 text-slate-900":"text-slate-500"}`}>Search / Scan</button>
                  <button onClick={()=>setAddMethod("manual")} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${addMethod==="manual"?"bg-slate-200 text-slate-900":"text-slate-500"}`}>Manual</button>
                </div>
              )}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {(["Breakfast","Lunch","Dinner","Snack"] as const).map(cat=>(
                  <button key={cat} onClick={()=>setSelectedCategory(cat)} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory===cat?"text-slate-900":"text-slate-500"}`} style={selectedCategory===cat?{backgroundColor:T.p}:{}}>{cat}</button>
                ))}
              </div>

              {addMethod==="search" && !editingMeal ? (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                      <input type="text" placeholder="Search product..." className="w-full bg-slate-100 text-slate-900 p-4 pl-11 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={productSearch} onChange={e=>setProductSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearchGlobal()}/>
                    </div>
                    <button onClick={()=>setShowScanner(!showScanner)} className={`p-4 rounded-xl ${showScanner?"bg-red-500":"bg-slate-100 border border-slate-200"}`}><Barcode size={18}/></button>
                    <button onClick={onSearchGlobal} className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900">{isSearching?<Loader2 className="animate-spin" size={18}/>:<Globe size={18}/>}</button>
                  </div>
                  {showScanner && <div className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-100"><div id="reader" className="w-full"/></div>}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {apiResults.map((res,i)=>(
                      <button key={i} onClick={()=>setSelectedProduct(res)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedProduct?.name===res.name?"border-slate-500 bg-slate-100":"bg-slate-100/50 border-slate-200 hover:border-slate-400"}`}>
                        <div className="text-left"><p className="font-black text-sm text-slate-900">{res.name}</p><p className="text-[9px] font-bold text-slate-500">{res.cal} kcal / 100g</p></div>
                        {selectedProduct?.name===res.name?<Check size={16} className="text-green-400"/>:<Plus size={16} className="text-slate-500"/>}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Product Name" className="col-span-2 bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={newName} onChange={e=>setNewName(e.target.value)}/>
                  {[
                    {ph:editingMeal?"Calories":"Kcal / 100g",  val:newCal,   set:setNewCal},
                    {ph:editingMeal?"Protein (g)":"Protein/100g",val:newProt, set:setNewProt},
                    {ph:editingMeal?"Carbs (g)":"Carbs/100g",   val:newCarbs, set:setNewCarbs},
                    {ph:editingMeal?"Fats (g)":"Fats/100g",     val:newFats,  set:setNewFats},
                    {ph:"Fiber", val:newFiber, set:setNewFiber},
                    {ph:"Sugar", val:newSugar, set:setNewSugar},
                  ].map(({ph,val,set})=>(
                    <input key={ph} type="number" placeholder={ph} className="bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={val} onChange={e=>set(e.target.value)}/>
                  ))}
                  <button onClick={()=>onAddMealEntry(newName,{cal:Number(newCal),prot:Number(newProt),carbs:Number(newCarbs),fats:Number(newFats),fiber:Number(newFiber),sugar:Number(newSugar)})} className="col-span-2 py-4 rounded-xl font-black uppercase text-white" style={{backgroundColor:T.p}} disabled={!newName||!newCal}>
                    {editingMeal?"Save Changes":"Save & Add"}
                  </button>
                </div>
              )}

              {!editingMeal && ((addMethod==="search"&&selectedProduct)||(addMethod==="manual"&&newName)) && (
                <div className="pt-5 border-t border-slate-200 space-y-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-widest">Portion (g)</label>
                      <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-slate-100 text-slate-900 p-5 rounded-xl font-black text-2xl outline-none border border-slate-200 focus:border-slate-400"/>
                    </div>
                    {addMethod==="search"&&selectedProduct&&(
                      <button onClick={()=>onAddMealEntry(selectedProduct.name,selectedProduct)} className="px-6 py-5 rounded-xl font-black uppercase text-sm text-white hover:scale-105 transition-all" style={{backgroundColor:T.p}}>
                        Add {selectedProduct.name.split(" ")[0].slice(0,10)}
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Per {amount}g portion</p>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Calories</span>
                      <span className="text-xl font-black italic" style={{color:T.p}}>
                        {Math.round((Number(addMethod==="manual"?newCal:selectedProduct?.cal||0)*Number(amount))/100)}
                        <span className="text-xs text-slate-500 ml-1 not-italic">kcal</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {label:"Protein",c:T.p,raw:addMethod==="manual"?newProt:selectedProduct?.prot},
                        {label:"Carbs",  c:T.c,raw:addMethod==="manual"?newCarbs:selectedProduct?.carbs},
                        {label:"Fats",   c:T.f,raw:addMethod==="manual"?newFats:selectedProduct?.fats},
                      ].map(({label,c,raw})=>(
                        <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                          <p className="text-[7px] font-black uppercase mb-1" style={{color:c}}>{label}</p>
                          <p className="text-sm font-black">{((Number(raw||0)*Number(amount))/100).toFixed(1)}<span className="text-[9px] text-slate-500 ml-0.5">g</span></p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {label:"🌿 Fiber",raw:addMethod==="manual"?(newFiber||"0"):(selectedProduct?.fiber||0)},
                        {label:"🍬 Sugar",raw:addMethod==="manual"?(newSugar||"0"):(selectedProduct?.sugar||0)},
                      ].map(({label,raw})=>(
                        <div key={label} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center border border-slate-200">
                          <span className="text-[8px] font-black text-slate-500 uppercase">{label}</span>
                          <span className="text-xs font-black">{((Number(raw)*Number(amount))/100).toFixed(1)}g</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── TrainingModal ─────────────────────────────────────────────────────────────
interface TrainingModalProps {
  show: boolean;
  tType: string; setTType: (v: string) => void;
  tDuration: string; setTDuration: (v: string) => void;
  tBurn: string; setTBurn: (v: string) => void;
  tNotes: string; setTNotes: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: Theme;
}

export function TrainingModal({ show, tType, setTType, tDuration, setTDuration, tBurn, setTBurn, tNotes, setTNotes, onClose, onSave, theme: T }: TrainingModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic">Log Training</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl hover:text-red-400"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Sport / Type</label>
                <div className="flex flex-wrap gap-2">
                  {SPORT_TYPES.map(s=>(
                    <button key={s} onClick={()=>setTType(s)} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${tType===s?"text-slate-900":"bg-slate-100 text-slate-500 hover:text-slate-600"}`} style={tType===s?{backgroundColor:T.p}:{}}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Duration (min)</label>
                  <input type="number" placeholder="60" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={tDuration} onChange={e=>setTDuration(e.target.value)}/>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Kcal Burned</label>
                  <input type="number" placeholder="400" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={tBurn} onChange={e=>setTBurn(e.target.value)}/>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Session Notes</label>
                <textarea placeholder="Sets, reps, feelings, PRs hit today…" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-medium outline-none border border-slate-200 focus:border-slate-400 resize-none h-24 text-sm" value={tNotes} onChange={e=>setTNotes(e.target.value)}/>
              </div>
              <button onClick={onSave} className="w-full py-4 rounded-xl font-black uppercase text-white" style={{backgroundColor:T.p}}>Save Session</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── RecoveryModal ─────────────────────────────────────────────────────────────
interface RecoveryModalProps {
  show: boolean;
  rSleep: string; setRSleep: (v: string) => void;
  rQuality: number; setRQuality: (v: number) => void;
  rSoreness: number; setRSoreness: (v: number) => void;
  rHRV: string; setRHRV: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: Theme;
}

export function RecoveryModal({ show, rSleep, setRSleep, rQuality, setRQuality, rSoreness, setRSoreness, rHRV, setRHRV, onClose, onSave, theme: T }: RecoveryModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic">Log Recovery</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl hover:text-red-400"><X size={18}/></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Sleep Duration (hours)</label>
                <input type="number" step="0.5" placeholder="7.5" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={rSleep} onChange={e=>setRSleep(e.target.value)}/>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Sleep Quality (1–5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setRQuality(n)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${rQuality===n?"text-slate-900":"bg-slate-100 text-slate-500 hover:text-slate-600"}`} style={rQuality===n?{backgroundColor:T.p}:{}}>{["😞","😴","😐","🙂","🤩"][n-1]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Muscle Soreness (1 easy — 10 destroyed)</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                    <button key={n} onClick={()=>setRSoreness(n)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${rSoreness===n?"text-slate-900":"bg-slate-100 text-slate-400"}`} style={rSoreness===n?{backgroundColor:n<=3?"#22c55e":n<=6?"#f59e0b":"#ef4444"}:{}}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">HRV (ms) — optional</label>
                <input type="number" placeholder="e.g. 65" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={rHRV} onChange={e=>setRHRV(e.target.value)}/>
              </div>
              <button onClick={onSave} className="w-full py-4 rounded-xl font-black uppercase text-white" style={{backgroundColor:T.p}} disabled={!rSleep}>Save Recovery</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── PRModal ───────────────────────────────────────────────────────────────────
interface PRModalProps {
  show: boolean;
  prExercise: string; setPrExercise: (v: string) => void;
  prValue: string; setPrValue: (v: string) => void;
  prUnit: string; setPrUnit: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: Theme;
}

export function PRModal({ show, prExercise, setPrExercise, prValue, setPrValue, prUnit, setPrUnit, onClose, onSave, theme: T }: PRModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic">New PR 🏆</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl hover:text-red-400"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Exercise (e.g. Squat, 5K Run, Bench Press)" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={prExercise} onChange={e=>setPrExercise(e.target.value)}/>
              <div className="flex gap-3">
                <input type="number" placeholder="Value" className="flex-1 bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={prValue} onChange={e=>setPrValue(e.target.value)}/>
                <select value={prUnit} onChange={e=>setPrUnit(e.target.value)} className="bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 appearance-none">
                  {["kg","lbs","min","sec","reps","km","m"].map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <button onClick={onSave} className="w-full py-4 rounded-xl font-black uppercase text-white" style={{backgroundColor:T.p}} disabled={!prExercise||!prValue}>Save PR</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── BodyModal ─────────────────────────────────────────────────────────────────
interface BodyModalProps {
  show: boolean;
  bwValue: string; setBwValue: (v: string) => void;
  bfValue: string; setBfValue: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: Theme;
}

export function BodyModal({ show, bwValue, setBwValue, bfValue, setBfValue, onClose, onSave, theme: T }: BodyModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic">Log Body Stats</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl hover:text-red-400"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Body Weight (kg)</label>
                <input type="number" step="0.1" placeholder="e.g. 80.5" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={bwValue} onChange={e=>setBwValue(e.target.value)}/>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Body Fat % — optional</label>
                <input type="number" step="0.1" placeholder="e.g. 15.2" className="w-full bg-slate-100 text-slate-900 p-4 rounded-xl font-bold outline-none border border-slate-200 focus:border-slate-400" value={bfValue} onChange={e=>setBfValue(e.target.value)}/>
              </div>
              <button onClick={onSave} className="w-full py-4 rounded-xl font-black uppercase text-white" style={{backgroundColor:T.p}} disabled={!bwValue}>Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── SettingsModal ─────────────────────────────────────────────────────────────
interface SettingsModalProps {
  show: boolean;
  weight: string; setWeight: (v: string) => void;
  height: string; setHeight: (v: string) => void;
  age: string;    setAge:    (v: string) => void;
  gender: "male"|"female"; setGender: (v: "male"|"female") => void;
  currentTheme: ThemeKey; setCurrentTheme: (v: ThemeKey) => void;
  onClose: () => void;
  onExport: () => void;
  theme: Theme;
}

export function SettingsModal({ show, weight, setWeight, height, setHeight, age, setAge, gender, setGender, currentTheme, setCurrentTheme, onClose, onExport, theme: T }: SettingsModalProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md"/>
      <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} className="relative bg-slate-50 border border-slate-300 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div><h2 className="text-xl font-black italic uppercase">Settings</h2><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Profile & Preferences</p></div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-8">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{color:T.p}}>Physical Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{label:"Weight (kg)",val:weight,set:setWeight},{label:"Height (cm)",val:height,set:setHeight},{label:"Age",val:age,set:setAge}].map(({label,val,set})=>(
                <div key={label} className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase ml-1">{label}</label><input type="number" value={val} onChange={e=>set(e.target.value)} className="w-full bg-slate-100 rounded-xl p-3 text-sm font-bold border border-slate-200 focus:border-slate-400 outline-none text-slate-900"/></div>
              ))}
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Gender</label><select value={gender} onChange={e=>setGender(e.target.value as any)} className="w-full bg-slate-100 rounded-xl p-3 text-sm font-bold border border-slate-200 focus:border-slate-400 outline-none text-slate-900 appearance-none"><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
          </section>
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{color:T.p}}>Theme</h3>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(THEMES).map(([t,v])=>(
                <button key={t} onClick={()=>setCurrentTheme(t as ThemeKey)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${currentTheme===t?"border-slate-500":"border-slate-200 opacity-50 hover:opacity-80"}`} style={currentTheme===t?{backgroundColor:`${v.p}25`}:{}}>
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor:v.p}}/>
                  <span className="text-[9px] font-black uppercase text-slate-900">{t}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Data</h3>
            <button onClick={onExport} className="w-full flex items-center gap-4 p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all border border-slate-200">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${T.p}20`}}><Download size={18} style={{color:T.p}}/></div>
              <div className="text-left"><p className="text-sm font-black text-slate-900">Export CSV</p><p className="text-[9px] text-slate-500">Full history with training & recovery</p></div>
              <ChevronRight size={16} className="text-slate-400 ml-auto"/>
            </button>
            <button onClick={()=>{if(confirm("Delete ALL data?")){localStorage.clear();window.location.reload();}}} className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center"><Trash2 size={18} className="text-red-400"/></div>
              <div className="text-left"><p className="text-xs font-bold text-slate-500">Reset All Data</p><p className="text-[9px] text-slate-400">Clear local storage</p></div>
            </button>
          </section>
        </div>
        <div className="p-5 bg-slate-50 text-center border-t border-slate-200">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">ProFuel v3.0 • Athlete Edition</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── UndoToast ─────────────────────────────────────────────────────────────────
interface UndoToastProps {
  undoToast: {meal: any; date: string} | null;
  onUndo: () => void;
  theme: Theme;
}

export function UndoToast({ undoToast, onUndo, theme: T }: UndoToastProps) {
  return (
    <AnimatePresence>
      {undoToast && (
        <motion.div
          initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:40}}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700"
        >
          <Trash2 size={14} className="text-red-400"/>
          <span className="text-xs font-bold truncate max-w-50">{undoToast.meal.name} deleted</span>
          <button onClick={onUndo} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all" style={{color:T.p}}>
            <RotateCcw size={12}/> Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}