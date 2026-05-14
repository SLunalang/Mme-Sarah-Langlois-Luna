/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Layers, 
  Weight, 
  Maximize2, 
  Thermometer, 
  Droplet, 
  Calculator,
  Info,
  ChevronRight,
  FlaskConical,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Flame,
  Snowflake,
  BookOpen,
  X,
  ExternalLink
} from 'lucide-react';

const CHEMICAL_DATA = [
  // GAZ
  { id: 'helium', name: "Hélium (He)", tf: -272, te: -269, rho: 0.00018, solubility: 0.0017, state: 'G', color: '#f0f9ff', chem: "Inerte (ne réagit pas). Éteint la flamme." },
  { id: 'hydrogen', name: "Dihydrogène (H₂)", tf: -259, te: -253, rho: 0.00009, solubility: 0.002, state: 'G', color: '#ecfeff', chem: "Explose en présence d'une éclisse de bois enflammée." },
  { id: 'oxygen', name: "Dioxygène (O₂)", tf: -218, te: -183, rho: 0.00143, solubility: 0.04, state: 'G', color: '#d1fae5', chem: "Rallume un tison incandescent." },
  { id: 'ammoniac', name: "Ammoniac (NH₃)", tf: -78, te: -33, rho: 0.00075, solubility: 531, state: 'G', color: '#fdf4ff', chem: "Forme une fumée blanche avec HCl. Éteint la flamme." },
  { id: 'hcl', name: "Chlorure d'hydrogène (HCl)", tf: -114, te: -85, rho: 0.00164, solubility: 420, state: 'G', color: '#f1f5f9', chem: "Forme une fumée blanche avec l'ammoniac. Éteint la flamme." },
  { id: 'nitrogen', name: "Diazote (N₂)", tf: -210, te: -196, rho: 0.00125, solubility: 0.02, state: 'G', color: '#f8fafc', chem: "Éteint la flamme." },
  { id: 'chlorine', name: "Dichlore (Cl₂)", tf: -102, te: -35, rho: 0.00294, solubility: 7.3, state: 'G', color: '#fefce8', chem: "Rallume un tison incandescent." },
  { id: 'co2', name: "Dioxyde de carbone (CO₂)", tf: -79, te: 0, rho: 0.00198, solubility: 1.6, state: 'G', color: '#f1f5f9', chem: "Trouble l'eau de chaux. Éteint la flamme." },
  
  // LIQUIDES
  { id: 'ethanol', name: "Éthanol (C₂H₆O)", tf: -114, te: 78, rho: 0.79, solubility: "Oui", conductivity: 'Non', state: 'L', color: '#bae6fd', chem: "Produit une flamme bleu pâle." },
  { id: 'methanol', name: "Méthanol (CH₃OH)", tf: -98, te: 65, rho: 0.79, solubility: "Oui", conductivity: 'Non', state: 'L', color: '#a5f3fc', chem: "Produit une flamme bleu pâle." },
  { id: 'mercury', name: "Mercure (Hg)", tf: -39, te: 357, rho: 13.55, solubility: "Non", conductivity: 'Oui', state: 'L', color: '#94a3b8', chem: "Réagit avec l'acide nitrique. S'oxyde en solide noir." },
  { id: 'water', name: "Eau (H₂O)", tf: 0, te: 100, rho: 1.0, solubility: "S. o.", conductivity: 'Non', state: 'L', color: '#60a5fa', chem: "Colore le papier de dichlorure de cobalt en rose." },
  { id: 'acetic', name: "Acide acétique", tf: 17, te: 118, rho: 1.05, solubility: "Oui", conductivity: 'Oui', state: 'L', color: '#cbd5e1', chem: "Colore le papier tournesol neutre en rouge." },
  { id: 'ethyleneglycol', name: "Éthylèneglycol", tf: -13, te: 198, rho: 1.11, solubility: "Oui", conductivity: 'Non', state: 'L', color: '#e0f2fe', chem: "Inflammable." },
  { id: 'glycerine', name: "Glycérine", tf: 18, te: 290, rho: 1.26, solubility: "Oui", conductivity: 'Non', state: 'L', color: '#e2e8f0', chem: "Explose en présence de certaines substances." },
  
  // SOLIDES
  { id: 'lead', name: "Plomb (Pb)", tf: 327, te: 1740, rho: 11.34, solubility: 0, conductivity: 'Oui', state: 'S', color: '#475569', chem: "S'oxyde pour former un solide noir." },
  { id: 'aluminum', name: "Aluminium (Al)", tf: 660, te: 2467, rho: 2.7, solubility: 0, conductivity: 'Oui', state: 'S', color: '#cbd5e1', chem: "S'oxyde pour former un solide blanc." },
  { id: 'salt', name: "Sel (NaCl)", tf: 801, te: 1413, rho: 2.17, solubility: 357, conductivity: 'Oui (dissous)', state: 'S', color: '#ffffff', chem: "Produit une flamme jaune orangé." },
  { id: 'silver', name: "Argent (Ag)", tf: 961, te: 2212, rho: 10.4, solubility: 0, conductivity: 'Oui', state: 'S', color: '#f1f5f9', chem: "Produit une flamme blanc argenté." },
  { id: 'gold', name: "Or (Au)", tf: 1064, te: 2807, rho: 19.32, solubility: 0, conductivity: 'Oui', state: 'S', color: '#fbbf24', chem: "Ne s'oxyde pas. Réagit avec l'eau régale." },
  { id: 'copper', name: "Cuivre (Cu)", tf: 1083, te: 2595, rho: 8.94, solubility: 0, conductivity: 'Oui', state: 'S', color: '#b45309', chem: "S'oxyde pour former un solide verdâtre." },
  { id: 'iron', name: "Fer (Fe)", tf: 1535, te: 3000, rho: 7.86, solubility: 0, conductivity: 'Oui', state: 'S', color: '#334155', chem: "S'oxyde pour former un solide rouge brun." },
  { id: 'sugar', name: "Glucose (C₆H₁₂O₆)", tf: 146, te: 0, rho: 1.56, solubility: 1000, conductivity: 'Non', state: 'S', color: '#ffffff', chem: "Prend une couleur dorée lorsqu'on le chauffe." },
  { id: 'nickel', name: "Nickel (Ni)", tf: 1455, te: 2730, rho: 8.90, solubility: 0, conductivity: 'Oui', state: 'S', color: '#94a3b8', chem: "S'oxyde peu pour former un solide vert." },
  { id: 'graphite', name: "Graphite (C)", tf: 3652, te: 4200, rho: 2.09, solubility: 0, conductivity: 'Oui', state: 'S', color: '#1e293b', chem: "S'oxyde pour former du CO2." },
  { id: 'diamond', name: "Diamant (C)", tf: 3547, te: 4200, rho: 3.52, solubility: 0, conductivity: 'Oui', state: 'S', color: '#f8fafc', chem: "S'oxyde pour former du CO2." },
  { id: 'sulfur', name: "Soufre (S)", tf: 115, te: 445, rho: 1.96, solubility: 0, conductivity: 'Non', state: 'S', color: '#fde047', chem: "Produit une flamme bleue." },
  { id: 'tungsten', name: "Tungstène (W)", tf: 3410, te: 5900, rho: 19.35, solubility: 0, conductivity: 'Oui', state: 'S', color: '#4b5563', chem: "Réagit avec l'acide nitrique." },
];

const PROPERTY_QUIZZES = {
  density: [
    { 
      question: "Si tu as 20g d'une substance et qu'elle occupe 10ml, quelle est sa masse volumique ?", 
      options: ["0.5 g/ml", "2 g/ml", "200 g/ml", "20 g/ml"], 
      correct: 1, 
      explanation: "ρ = m/V = 20g / 10ml = 2 g/ml."
    },
    { 
      question: "La masse volumique de l'eau est de 1,0 g/ml. Une bille de 1,2 g/ml va-t-elle flotter ?", 
      options: ["Oui", "Non"], 
      correct: 1, 
      explanation: "Si la masse volumique est supérieure à celle du liquide, l'objet coule."
    }
  ]
};

const EXPLORATION_IDS = ['aluminum', 'copper', 'gold', 'iron', 'lead', 'silver', 'graphite', 'sulfur', 'tungsten'];
const EXPLORATION_LIQUIDS_IDS = ['water', 'ethanol', 'methanol', 'acetic', 'ethyleneglycol', 'glycerine', 'mercury'];
const CYLINDER_EMPTY_MASS = 45.0; // g
const INITIAL_WATER_VOLUME = 20; // ml

export default function App() {
  const [view, setView] = useState<'HOME' | 'EXPLORE' | 'LAB' | 'THEORY'>('HOME');
  const [activeMode, setActiveMode] = useState<'EXPLORE' | 'QUIZ' | 'LAB' | 'THEORY'>('EXPLORE');
  const [substanceType, setSubstanceType] = useState<'SOLID' | 'LIQUID'>('SOLID');
  const [showReferenceBook, setShowReferenceBook] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [sampleDensities, setSampleDensities] = useState<Record<string, string>>({});
  // States for simulators
  const [selectedMaterial, setSelectedMaterial] = useState(CHEMICAL_DATA.find(d => d.id === 'aluminum') || CHEMICAL_DATA[0]);
  
  // Density Interactive Lab Bench States
  const [densityObjectPos, setDensityObjectPos] = useState<'SHELF' | 'BALANCE' | 'CYLINDER'>('SHELF');
  const [isExploreCylinderFilled, setIsExploreCylinderFilled] = useState(false);
  const [objectSize, setObjectSize] = useState(10); // ml
  const [userInputs, setUserInputs] = useState({ mass: '', volume: '', v1: '', v2: '', result: '', m1: '', m2: '' });
  const [densityValidation, setDensityValidation] = useState<null | boolean>(null);
  const [densityExerciseFeedback, setDensityExerciseFeedback] = useState<string | null>(null);
  const [vSubInputs, setVSubInputs] = useState({ final: '', initial: '20' });
  const [calcDisplay, setCalcDisplay] = useState('0');

  // Lab Mode state (New 4-sample lab)
  const [labSamples, setLabSamples] = useState(() => {
    return [0, 1, 2, 3].map(i => ({
      id: i,
      substance: CHEMICAL_DATA.find(d => d.id === EXPLORATION_IDS[Math.floor(Math.random() * EXPLORATION_IDS.length)]) || CHEMICAL_DATA[0],
      objectSize: Math.floor(Math.random() * 15) + 5, // ml
      userMass: '',
      userM1: '',
      userM2: '',
      userVi: '20',
      userVf: '',
      userRho: '',
      userGuess: '',
      validated: false
    }));
  });
  const [currentLabIdx, setCurrentLabIdx] = useState(0);
  const [labObjectPos, setLabObjectPos] = useState<'SHELF' | 'BALANCE' | 'CYLINDER'>('SHELF');
  const [isLabCylinderFilled, setIsLabCylinderFilled] = useState(false);
  const [labFeedback, setLabFeedback] = useState<{correct: boolean, msg: string} | null>(null);

  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Lab reset
  const resetLab = () => {
    const ids = substanceType === 'SOLID' ? EXPLORATION_IDS : EXPLORATION_LIQUIDS_IDS;
    setLabSamples([0, 1, 2, 3].map(i => ({
      id: i,
      substance: CHEMICAL_DATA.find(d => d.id === ids[Math.floor(Math.random() * ids.length)]) || CHEMICAL_DATA[0],
      objectSize: substanceType === 'SOLID' 
        ? Math.floor(Math.random() * 15) + 5 
        : Math.floor(Math.random() * 20) + 10, // ml
      userMass: '',
      userM1: '',
      userM2: '',
      userVi: substanceType === 'SOLID' ? '20' : '0',
      userVf: '',
      userRho: '',
      userGuess: '',
      validated: false
    })));
    setCurrentLabIdx(0);
    setLabObjectPos('SHELF');
    setIsLabCylinderFilled(false);
    setLabFeedback(null);
  };

  // Quiz Handlers
  const currentQuiz = PROPERTY_QUIZZES.density;
  
  const handleOptionSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === currentQuiz[quizIdx].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (quizIdx + 1 < currentQuiz.length) {
      setQuizIdx(prev => prev + 1);
    } else {
      // Finished property quiz
      setActiveMode('LAB');
      setQuizIdx(0);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
  };

  // Handle LaTeX rendering
  useEffect(() => {
    // @ts-ignore
    if (window.renderMathInElement) {
      // @ts-ignore
      window.renderMathInElement(document.body);
    }
  }, [view]);

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 bg-[#f8fafc] text-slate-800 antialiased">

      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate-900 pb-4 mb-8 max-w-7xl mx-auto">
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">
            Science et technologie — Secondaire 3
          </span>
          <button 
            onClick={() => setView('HOME')}
            className="title-huge font-display hover:text-blue-600 transition-colors text-left outline-none text-4xl md:text-5xl"
          >
            Masse <br className="hidden md:block" /> Volumique
          </button>
        </div>
        <div className="hidden md:block text-right max-w-sm mt-4 md:mt-0">
          <p className="text-[22.5px] italic text-slate-600 font-serif leading-tight underline decoration-blue-500 decoration-2 underline-offset-4">
            « Rien ne se perd, rien ne se crée, tout se transforme. » <br />
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 not-italic">— Antoine Lavoisier</span>
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button 
                onClick={() => { setView('THEORY'); setActiveMode('THEORY'); }}
                className="group relative h-[300px] card-base text-left transition-all hover:ring-4 ring-emerald-500/20 overflow-hidden md:col-span-2 lg:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-900/10" />
                <div className="relative p-8 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-emerald-600 mb-2 block">Phase 00</span>
                    <h2 className="text-3xl font-display font-black leading-[0.9] -tracking-[0.02em] mb-2 lowercase group-hover:text-emerald-700 transition-colors">Théorie <br/> & Concepts</h2>
                    <p className="text-[22.5px] text-slate-500 font-serif italic leading-relaxed border-l-2 border-emerald-200 pl-4">
                      Comprends les principes fondamentaux avant de passer à la pratique.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-sm tracking-widest">
                    Découvrir <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              <button 
                onClick={() => { setView('EXPLORE'); setActiveMode('EXPLORE'); }}
                className="group relative h-[300px] card-base text-left transition-all hover:ring-4 ring-blue-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-900/10" />
                <div className="relative p-8 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-2 block">Phase 01</span>
                    <h2 className="text-3xl font-display font-black leading-[0.9] -tracking-[0.02em] mb-2 lowercase group-hover:text-blue-700 transition-colors">Exploration <br/> & Mesures</h2>
                    <p className="text-[22.5px] text-slate-500 font-serif italic leading-relaxed border-l-2 border-blue-200 pl-4">
                      Apprends à mesurer la masse et le volume pour trouver la masse volumique.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-sm tracking-widest">
                    Commencer <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              <button 
                onClick={() => { setView('LAB'); setActiveMode('LAB'); }}
                className="group relative h-[300px] card-base text-left transition-all hover:ring-4 ring-blue-900/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-800/10 to-transparent" />
                <div className="relative p-8 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-blue-800 mb-2 block">Phase 02</span>
                    <h2 className="text-3xl font-display font-black leading-[0.9] -tracking-[0.02em] mb-2 lowercase group-hover:text-blue-900 transition-colors">Laboratoire <br/> de Certification</h2>
                    <p className="text-[22.5px] text-slate-500 font-serif italic leading-relaxed border-l-2 border-blue-800/40 pl-4">
                      Identifie les substances mystères en appliquant tes connaissances.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900 font-black uppercase text-sm tracking-widest">
                    Entrer au labo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {(view === 'EXPLORE' || view === 'LAB' || view === 'THEORY') && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="relative z-10 flex-1">
                   <h2 className="text-xl font-display font-black lowercase text-white flex items-center gap-2">
                     <Layers className="text-blue-400" /> Masse Volumique
                   </h2>
                </div>

                <div className="relative z-10 w-full lg:w-auto bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1">
                  {[
                    { id: 'THEORY', label: '00. Théorie', view: 'THEORY' },
                    { id: 'EXPLORE', label: '01. Exploration', view: 'EXPLORE' },
                    { id: 'LAB', label: '02. Laboratoire', view: 'LAB' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMode(m.id as any);
                        setView(m.view as any);
                      }}
                      className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                        activeMode === m.id 
                        ? 'bg-white text-slate-900 shadow-lg' 
                        : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <section className="space-y-8 pb-16">
                {activeMode === 'THEORY' ? (
                  <motion.div
                    key="theory-view"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    <div className="lg:col-span-2 space-y-8">
                      <div className="card-base p-10 bg-white border-b-8 border-emerald-600 shadow-2xl space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-4xl font-display font-black lowercase text-slate-900 leading-tight">La Masse Volumique</h2>
                          <div className="h-1 w-24 bg-emerald-500 rounded-full" />
                        </div>
                        
                        <div className="prose prose-slate max-w-none space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                              1. Une Propriété Caractéristique
                            </h3>
                            <p className="text-[22.5px] font-serif italic text-slate-600 leading-relaxed">
                              Une propriété caractéristique est une propriété qui permet d'identifier une substance ou un groupe de substances. La masse volumique est unique pour chaque substance pure dans des conditions de température et de pression données.
                            </p>
                          </div>

                          <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 my-8 space-y-4">
                             <h3 className="font-black uppercase text-sm tracking-widest text-emerald-600">La Formule Mathématique</h3>
                             <div className="flex items-center justify-center py-6 bg-white rounded-2xl shadow-inner border border-slate-200">
                                <span className="text-5xl font-black italic math-font text-slate-900">ρ = m / V</span>
                             </div>
                             <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <span className="block text-[22.5px] font-black text-slate-900 italic font-serif">ρ</span>
                                  <span className="text-sm font-black uppercase text-slate-400">Masse Volumique</span>
                                </div>
                                <div>
                                  <span className="block text-[22.5px] font-black text-slate-900 italic font-serif">m</span>
                                  <span className="text-sm font-black uppercase text-slate-400">Masse (g)</span>
                                </div>
                                <div>
                                  <span className="block text-[22.5px] font-black text-slate-900 italic font-serif">V</span>
                                  <span className="text-sm font-black uppercase text-slate-400">Volume (ml ou cm³)</span>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-4 pt-4">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                              2. Influence de la Température
                            </h3>
                            <p className="text-[22.5px] font-serif italic text-slate-600 leading-relaxed">
                              Généralement, la masse volumique d'une substance diminue lorsque la température augmente. Pourquoi ? Car l'agitation thermique espace les particules, augmentant ainsi le volume pour une même masse. 
                              <br /><br />
                              <span className="text-emerald-700 font-bold">* Exception notable :</span> L'eau est plus dense à 4°C qu'à l'état solide (glace), c'est pourquoi la glace flotte !
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 italic font-serif text-[22.5px] text-slate-600">
                              <h4 className="font-black uppercase text-sm text-emerald-700 mb-2">Les Solides</h4>
                              Habituellement les plus denses car les particules sont très serrées. On mesure leur volume par déplacement d'eau.
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 italic font-serif text-[22.5px] text-slate-600">
                              <h4 className="font-black uppercase text-sm text-blue-700 mb-2">Les Liquides</h4>
                              Leur masse volumique se mesure souvent en g/ml. On utilise un cylindre gradué pour le volume et une balance pour la masse.
                            </div>
                          </div>

                          <div className="space-y-6 pt-8">
                            <h3 className="text-2xl font-display font-black lowercase text-slate-900 flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">3</div>
                              Vidéo Explicative
                            </h3>
                            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-900 bg-slate-900">
                              <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dq0iiywt0YU"
                                title="Vidéo explicative sur la masse volumique"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <p className="text-[22.5px] text-slate-400 font-serif italic text-center">
                              Source : Vidéo Alloprof - La masse volumique
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="card-base p-10 bg-emerald-900 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                              <ExternalLink className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-2xl font-display font-black lowercase">Sources & Crédits</h3>
                          </div>
                          <p className="text-[22.5px] font-serif italic text-emerald-100/80 leading-relaxed max-w-xl">
                            Les informations théoriques de cette section sont basées sur les ressources pédagogiques d'**Alloprof**, la référence en soutien scolaire au Québec.
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <a 
                              href="https://www.alloprof.qc.ca/fr/eleves/bv/sciences/la-masse-volumique-s1017" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-white text-emerald-900 px-6 py-3 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
                            >
                              Fiche Théorique <ChevronRight size={14} />
                            </a>
                            <a 
                              href="https://www.alloprof.qc.ca/fr/eleves/bv/minirecup/sciences/la-masse-volumique-0-s1630" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-emerald-800 text-white px-6 py-3 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-emerald-700 border border-emerald-700 transition-all shadow-xl active:scale-95"
                            >
                              MiniRécup interactive <ChevronRight size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div className="card-base p-8 bg-white border border-slate-200 shadow-xl space-y-6">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">À retenir</h4>
                          <ul className="space-y-4">
                             {[
                               "Chaque substance pure possède sa propre masse volumique.",
                               "L'eau a une masse volumique de 1,00 g/ml.",
                               "Si ρ < 1,00 g/ml, l'objet flotte sur l'eau.",
                               "Si ρ > 1,00 g/ml, l'objet coule dans l'eau."
                             ].map((text, i) => (
                               <li key={i} className="flex gap-4 items-start">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                  </div>
                                  <p className="text-[22.5px] font-serif italic text-slate-600 leading-relaxed">{text}</p>
                               </li>
                             ))}
                          </ul>
                       </div>

                       <div className="card-base p-8 bg-slate-50 border border-slate-200 shadow-inner space-y-6">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Prêt pour la suite ?</h4>
                          <p className="text-[22.5px] text-slate-500 leading-relaxed italic font-serif">
                            Une fois que tu as bien compris la théorie, passe à l'exploration pour mettre en pratique tes connaissances.
                          </p>
                          <button 
                            onClick={() => { setView('EXPLORE'); setActiveMode('EXPLORE'); }}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                          >
                            Passer à l'Exploration
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ) : activeMode === 'EXPLORE' ? (
                  <motion.div
                    key="density-explore"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                  >
                    <div className="card-base p-8 bg-white shadow-xl space-y-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="md:w-1/3 space-y-4">
                          <h2 className="text-3xl font-display font-black lowercase text-blue-600">Exploration : La Démarche</h2>
                          
                          <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button 
                              onClick={() => {
                                setSubstanceType('SOLID');
                                setSelectedMaterial(CHEMICAL_DATA.find(d => d.id === 'aluminum')!);
                              }}
                              className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${substanceType === 'SOLID' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              Solides
                            </button>
                            <button 
                              onClick={() => {
                                setSubstanceType('LIQUID');
                                setSelectedMaterial(CHEMICAL_DATA.find(d => d.id === 'water')!);
                              }}
                              className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${substanceType === 'LIQUID' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              Liquides
                            </button>
                          </div>

                          <p className="text-[22.5px] text-slate-500 font-serif italic leading-relaxed border-l-4 border-blue-100 pl-4">
                            {substanceType === 'SOLID' 
                              ? "Pour les solides, on mesure la masse directe et le volume par déplacement d'eau."
                              : "Pour les liquides, n'oublie pas de soustraire la masse du cylindre vide (Tare = 45,0 g)."}
                          </p>
                          
                          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">1. CHOISIR UN ÉCHANTILLON</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {CHEMICAL_DATA.filter(d => (substanceType === 'SOLID' ? EXPLORATION_IDS : EXPLORATION_LIQUIDS_IDS).includes(d.id)).map(sub => (
                                <div key={sub.id} className="space-y-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedMaterial(sub);
                                      setDensityObjectPos('SHELF');
                                      setIsExploreCylinderFilled(false);
                                      setObjectSize(Math.floor(Math.random() * 15) + 5);
                                      setUserInputs({ mass: '', volume: '', v1: '', v2: '', result: '', m1: '', m2: '' });
                                      setDensityValidation(null);
                                      setDensityExerciseFeedback(null);
                                      setVSubInputs({ final: '', initial: '20' });
                                    }}
                                    className={`w-full p-3 rounded-xl border-2 transition-all text-[12px] font-black uppercase tracking-tight shadow-sm ${selectedMaterial.id === sub.id ? 'bg-blue-600 border-blue-400 text-white shadow-blue-200' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}`}
                                  >
                                    {sub.name}
                                  </button>
                                  <div className="relative group">
                                    <input 
                                      type="text" 
                                      value={sampleDensities[sub.id] || ''} 
                                      onChange={(e) => setSampleDensities(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                      placeholder="Note la ρ..."
                                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-center focus:border-blue-500 outline-none transition-all shadow-inner"
                                    />
                                    {sampleDensities[sub.id] && (
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 pointer-events-none">g/ml</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Shortened calculation help for Exploration */}
                            <div className="mt-4 p-4 bg-slate-900 rounded-3xl border-b-4 border-slate-950 shadow-xl">
                              <button 
                                onClick={() => setShowCalculator(true)}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-slate-800 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                              >
                                <Calculator size={14} /> Calculatrice
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-[3rem] p-6 border-4 border-white shadow-inner relative flex flex-col justify-between overflow-hidden min-h-[600px]">
                            {/* Simulator Area */}
                            <div className="flex-1 flex flex-col gap-8">
                                {/* Shelf Area */}
                                <div className="w-full flex justify-center items-center h-24 border-b border-slate-200 relative px-12">
                                  {substanceType === 'LIQUID' && (
                                     <div className="absolute left-12 bottom-3 flex flex-col items-center">
                                        <div className="w-10 h-14 bg-blue-100/20 border-x-4 border-b-4 border-slate-300 rounded-b-lg relative">
                                           <div 
                                             className="absolute bottom-0 w-full h-3/4 opacity-60 rounded-b-md" 
                                             style={{ backgroundColor: selectedMaterial.color }} 
                                           />
                                        </div>
                                        <span className="text-xs font-black uppercase text-slate-400 mt-1">Source</span>
                                     </div>
                                  )}

                                  {densityObjectPos === 'SHELF' && (
                                    <motion.div 
                                      layoutId="object"
                                      className={`shadow-2xl border-4 border-white/20 cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-3xl font-black ${substanceType === 'SOLID' ? 'w-20 h-20' : 'w-14 h-28 rounded-b-lg'}`}
                                      style={{ 
                                        backgroundColor: substanceType === 'SOLID' ? selectedMaterial.color : 'transparent',
                                        clipPath: substanceType === 'SOLID' ? 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)' : 'none',
                                        borderLeft: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                        borderRight: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                        borderBottom: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                      }}
                                      onClick={() => setDensityObjectPos('BALANCE')}
                                    >
                                       {substanceType === 'LIQUID' && isExploreCylinderFilled && (
                                          <div 
                                            className="w-full absolute bottom-0 transition-all duration-500 rounded-b-sm" 
                                            style={{ 
                                              height: `${(objectSize / 50) * 100}%`, 
                                              backgroundColor: selectedMaterial.color,
                                              opacity: 0.8
                                            }} 
                                          />
                                       )}
                                       {substanceType === 'SOLID' ? '?' : ''}
                                    </motion.div>
                                  )}
                                  <span className="absolute bottom-2 left-4 text-xs font-black uppercase tracking-widest text-slate-300">Étagère</span>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-12 items-end px-4">
                                  {/* Electronic Balance */}
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-full h-40 relative flex flex-col justify-end items-center">
                                      {/* Weighing Tray (Plate) */}
                                      <div className="w-40 h-4 bg-slate-400 rounded-lg shadow-lg z-20 relative" />
                                      
                                      {/* Body */}
                                      <div className="w-48 h-32 bg-slate-900 rounded-b-2xl border-b-4 border-slate-950 flex flex-col items-center justify-center shadow-2xl z-10">
                                        <div className="bg-emerald-950/50 px-4 py-2 rounded-lg border border-emerald-500/30">
                                          <span className="font-mono text-3xl font-black text-emerald-400">
                                            {densityObjectPos === 'BALANCE' 
                                              ? (substanceType === 'SOLID' 
                                                ? (selectedMaterial.rho * objectSize).toFixed(1)
                                                : (CYLINDER_EMPTY_MASS + (isExploreCylinderFilled ? selectedMaterial.rho * objectSize : 0)).toFixed(1))
                                              : "0.0"}
                                          </span>
                                          <span className="text-emerald-400 ml-2 font-black text-sm">g</span>
                                        </div>
                                      </div>
                                      
                                      {densityObjectPos === 'BALANCE' && (
                                        <motion.div 
                                          layoutId="object"
                                          className={`absolute bottom-[140px] shadow-2xl border-4 border-white/20 z-30 flex items-center justify-center text-white text-3xl font-black ${substanceType === 'SOLID' ? 'w-20 h-20' : 'w-16 h-32 rounded-b-lg'}`}
                                          style={{ 
                                            backgroundColor: substanceType === 'SOLID' ? selectedMaterial.color : 'transparent',
                                            clipPath: substanceType === 'SOLID' ? 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)' : 'none',
                                            borderLeft: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                            borderRight: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                            borderBottom: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                          }}
                                        >
                                          {substanceType === 'LIQUID' && isExploreCylinderFilled && (
                                            <div 
                                              className="w-full absolute bottom-0 transition-all duration-500 rounded-b-md" 
                                              style={{ 
                                                height: `${(objectSize / 50) * 100}%`, 
                                                backgroundColor: selectedMaterial.color,
                                                opacity: 0.8
                                              }} 
                                            />
                                          )}
                                          {substanceType === 'SOLID' ? '?' : ''}
                                        </motion.div>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => setDensityObjectPos('BALANCE')}
                                        className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                      >
                                        Peser
                                      </button>
                                      {substanceType === 'LIQUID' && !isExploreCylinderFilled && (
                                        <button 
                                          onClick={() => setIsExploreCylinderFilled(true)}
                                          className="mt-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                                        >
                                           Verser
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Cylinder Area */}
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-20 h-64 border-x-4 border-b-4 border-slate-300 rounded-b-2xl relative bg-blue-50/10 backdrop-blur-sm shadow-inner flex flex-col justify-end">
                                      <div className="absolute inset-0 z-0 pointer-events-none px-1">
                                        {Array.from({ length: 51 }, (_, i) => 50 - i).map((v, i) => (
                                          <div key={v} className="absolute w-full flex items-center gap-1" style={{ top: `${(i / 50) * 100}%` }}>
                                            <div className={`h-[1px] bg-slate-400 ${v % 5 === 0 ? 'w-full opacity-100' : 'w-1/3 opacity-40'}`} />
                                            {v % 5 === 0 && <span className="text-[12px] font-black text-slate-800 absolute -right-2 translate-x-full pr-1">{v}</span>}
                                          </div>
                                        ))}
                                      </div>
                                      <motion.div 
                                        animate={{ 
                                          height: substanceType === 'SOLID' 
                                            ? `${((INITIAL_WATER_VOLUME + (densityObjectPos === 'CYLINDER' ? objectSize : 0)) / 50) * 100}%`
                                            : `${((isExploreCylinderFilled ? objectSize : 0) / 50) * 100}%`,
                                          backgroundColor: (densityObjectPos === 'CYLINDER' && substanceType === 'SOLID') 
                                            ? '#3b82f6' 
                                            : (substanceType === 'LIQUID' && isExploreCylinderFilled)
                                              ? selectedMaterial.color
                                              : '#3b82f6'
                                        }} 
                                        className="w-full border-t-4 border-blue-500 flex items-end justify-center p-1 z-10 transition-all duration-1000 relative rounded-b-2xl overflow-hidden"
                                        style={{ opacity: 0.5 }}
                                      >
                                        {densityObjectPos === 'CYLINDER' && substanceType === 'SOLID' && (
                                          <motion.div 
                                            initial={{ y: 200 }} animate={{ y: 0 }}
                                            className="w-14 h-14 shadow-2xl border-2 border-white/20 mb-1 flex items-center justify-center text-white text-2xl font-black"
                                            style={{ 
                                              backgroundColor: selectedMaterial.color,
                                              clipPath: 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)'
                                            }}
                                          >
                                            ?
                                          </motion.div>
                                        )}
                                      </motion.div>
                                    </div>
                                    {substanceType === 'SOLID' ? (
                                      <button 
                                        onClick={() => setDensityObjectPos('CYLINDER')}
                                        className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                      >
                                        Plonger
                                      </button>
                                    ) : (
                                      <div className="text-sm font-black uppercase text-slate-300 mt-2">Mesure directe</div>
                                    )}
                                  </div>
                                </div>
                            </div>

                            <div className="mt-4 bg-white/80 backdrop-blur rounded-[2.5rem] p-6 border-2 border-slate-900 shadow-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="math-font text-6xl font-black italic text-slate-900 drop-shadow-sm">ρ = m / V</div>
                                  <div className="flex items-center gap-4">
                                     <button 
                                      onClick={() => {
                                        const actualM = selectedMaterial.rho * objectSize;
                                        const actualV = objectSize;
                                         const actualRho = selectedMaterial.rho;
                                         
                                         if (substanceType === 'SOLID') {
                                          const inputM = parseFloat(userInputs.mass);
                                          const inputV1 = parseFloat(userInputs.v1);
                                          const inputV2 = parseFloat(userInputs.v2);
                                          const inputV = parseFloat(userInputs.volume);
                                          const inputR = parseFloat(userInputs.result.replace(',', '.'));
                                          
                                          const mOk = Math.abs(inputM - actualM) < 0.5;
                                          const v1Ok = Math.abs(inputV1 - INITIAL_WATER_VOLUME) < 0.1;
                                          const v2Ok = Math.abs(inputV2 - (INITIAL_WATER_VOLUME + actualV)) < 0.1;
                                          const vOk = Math.abs(inputV - actualV) < 0.5;
                                          const rOk = Math.abs(inputR - actualRho) < 0.1;

                                          if (!mOk) {
                                            setDensityExerciseFeedback(`Erreur de masse : La valeur "${userInputs.mass}" ne correspond pas à ce qui est affiché sur la balance (${actualM.toFixed(1)} g).`);
                                            setDensityValidation(false);
                                          } else if (!v1Ok) {
                                            setDensityExerciseFeedback(`Erreur V₁ : Le volume d'eau initial est de ${INITIAL_WATER_VOLUME} ml.`);
                                            setDensityValidation(false);
                                          } else if (!v2Ok) {
                                            setDensityExerciseFeedback(`Erreur V₂ : Le niveau final avec l'objet est de ${(INITIAL_WATER_VOLUME + actualV).toFixed(1)} ml.`);
                                            setDensityValidation(false);
                                          } else if (!vOk) {
                                            setDensityExerciseFeedback(`Erreur de calcul du volume Vt : Vt = V₂ - V₁. Donc ${inputV2} - ${inputV1} = ${actualV} ml.`);
                                            setDensityValidation(false);
                                          } else if (!rOk) {
                                            setDensityExerciseFeedback(`Erreur de calcul : ρ = m / Vt. Donc ${actualM.toFixed(1)} / ${actualV} = ${actualRho.toFixed(2)}. Ton résultat "${userInputs.result}" est erroné.`);
                                            setDensityValidation(false);
                                          } else {
                                            setDensityExerciseFeedback("Félicitations ! Tes mesures et tes calculs sont exacts.");
                                            setDensityValidation(true);
                                          }
                                         } else {
                                          const inputM1 = parseFloat(userInputs.m1);
                                          const inputM2 = parseFloat(userInputs.m2);
                                          const inputV = parseFloat(userInputs.volume);
                                          const inputR = parseFloat(userInputs.result.replace(',', '.'));
                                          
                                          const m1Ok = Math.abs(inputM1 - CYLINDER_EMPTY_MASS) < 0.1;
                                          const m2Ok = Math.abs(inputM2 - (CYLINDER_EMPTY_MASS + actualM)) < 0.5;
                                          const vOk = Math.abs(inputV - actualV) < 0.5;
                                          const rOk = Math.abs(inputR - actualRho) < 0.1;

                                          if (!m1Ok) {
                                            setDensityExerciseFeedback(`Erreur m₁ : La masse du cylindre vide est de ${CYLINDER_EMPTY_MASS.toFixed(1)} g.`);
                                            setDensityValidation(false);
                                          } else if (!m2Ok) {
                                            setDensityExerciseFeedback(`Erreur m₂ : La masse totale affichée est de ${(CYLINDER_EMPTY_MASS + actualM).toFixed(1)} g.`);
                                            setDensityValidation(false);
                                          } else if (!vOk) {
                                            setDensityExerciseFeedback(`Erreur de volume : Le volume lu sur le cylindre est de ${actualV} ml.`);
                                            setDensityValidation(false);
                                          } else if (!rOk) {
                                            const calcM = (inputM2 - inputM1).toFixed(1);
                                            setDensityExerciseFeedback(`Erreur de calcul : ρ = (m₂ - m₁) / V. Donc (${inputM2} - ${inputM1}) / ${inputV} = ${calcM} / ${inputV} = ${actualRho.toFixed(2)}. Ton résultat "${userInputs.result}" est erroné.`);
                                            setDensityValidation(false);
                                          } else {
                                            setDensityExerciseFeedback("Félicitations ! L'identification du liquide est parfaite.");
                                            setDensityValidation(true);
                                          }
                                        }
                                      }}
                                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all font-mono"
                                     >
                                        Vérifier le calcul
                                     </button>
                                     {densityValidation !== null && (
                                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                          {densityValidation ? (
                                            <CheckCircle2 size={32} className="text-emerald-500" />
                                          ) : (
                                            <XCircle size={32} className="text-red-500" />
                                          )}
                                       </motion.div>
                                      )}
                                  </div>
                                </div>

                                {densityExerciseFeedback && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-2xl text-[12px] font-black uppercase tracking-wider ${densityValidation ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                  >
                                    {densityExerciseFeedback}
                                  </motion.div>
                                )}

                                <div className={`grid ${substanceType === 'SOLID' ? 'grid-cols-5' : 'grid-cols-5'} gap-4`}>
                                   {substanceType === 'SOLID' ? (
                                     <>
                                       <div className="space-y-2">
                                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Masse (m)</label>
                                          <div className="relative">
                                            <input 
                                              type="text" value={userInputs.mass} onChange={(e)=>setUserInputs({...userInputs, mass: e.target.value})}
                                              className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-base"
                                              placeholder="0.0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm text-slate-300">g</span>
                                          </div>
                                       </div>
                                       
                                       <div className="space-y-2">
                                         <label className="text-sm font-black text-slate-400 uppercase tracking-widest">V₁ (Initial)</label>
                                         <div className="relative">
                                           <input 
                                             type="text" value={userInputs.v1} onChange={(e)=>setUserInputs({...userInputs, v1: e.target.value})}
                                             className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-base"
                                             placeholder="20"
                                           />
                                           <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm text-slate-300">ml</span>
                                         </div>
                                       </div>

                                       <div className="space-y-2">
                                         <label className="text-sm font-black text-slate-400 uppercase tracking-widest">V₂ (Final)</label>
                                         <div className="relative">
                                           <input 
                                             type="text" value={userInputs.v2} onChange={(e)=>setUserInputs({...userInputs, v2: e.target.value})}
                                             className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-base"
                                             placeholder="..."
                                           />
                                           <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm text-slate-300">ml</span>
                                         </div>
                                       </div>

                                       <div className="space-y-2">
                                         <label className="text-sm font-black text-blue-600 uppercase tracking-widest">Vt (V₂ - V₁)</label>
                                         <div className="relative">
                                           <input 
                                             type="text" value={userInputs.volume} onChange={(e)=>setUserInputs({...userInputs, volume: e.target.value})}
                                             className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-base"
                                             placeholder="..."
                                           />
                                           <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm text-blue-300">ml</span>
                                         </div>
                                       </div>

                                       <div className="space-y-2">
                                         <label className="text-sm font-black text-emerald-600 uppercase tracking-widest">ρ (m / Vt)</label>
                                         <div className="relative">
                                           <input 
                                             type="text" value={userInputs.result} onChange={(e)=>setUserInputs({...userInputs, result: e.target.value})}
                                             className="w-full bg-slate-900 text-white border-2 border-slate-900 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-base"
                                             placeholder="..."
                                           />
                                         </div>
                                       </div>
                                     </>
                                   ) : (
                                     <>
                                       <div className="space-y-2">
                                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">m₁ (vide)</label>
                                          <div className="relative">
                                            <input 
                                              type="text" value={userInputs.m1} onChange={(e)=>setUserInputs({...userInputs, m1: e.target.value})}
                                              className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-xs"
                                              placeholder="0.0"
                                            />
                                          </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">m₂ (total)</label>
                                          <div className="relative">
                                            <input 
                                              type="text" value={userInputs.m2} onChange={(e)=>setUserInputs({...userInputs, m2: e.target.value})}
                                              className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all text-xs"
                                              placeholder="0.0"
                                            />
                                          </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-black text-emerald-400 uppercase tracking-widest">m (calc.)</label>
                                          <div className="relative">
                                            <div className="w-full bg-emerald-50 border-2 border-emerald-100 p-3 rounded-xl font-mono font-black text-center text-emerald-600 text-sm">
                                              {(userInputs.m2 && userInputs.m1) ? (Number(userInputs.m2) - Number(userInputs.m1)).toFixed(1) : '0.0'}
                                            </div>
                                          </div>
                                       </div>
                                     </>
                                   )}
                                   {substanceType === 'LIQUID' && (
                                     <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Volume (V)</label>
                                        <div className="relative">
                                          <input 
                                            type="text" value={userInputs.volume} onChange={(e)=>setUserInputs({...userInputs, volume: e.target.value})}
                                            className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all"
                                            placeholder="0.0"
                                          />
                                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[12px] text-slate-300">ml</span>
                                        </div>
                                     </div>
                                   )}
                                   {substanceType === 'LIQUID' && (
                                     <div className="space-y-2">
                                        <label className="text-sm font-black text-blue-400 uppercase tracking-widest">Résultat (ρ)</label>
                                        <div className="relative">
                                          <input 
                                            type="text" value={userInputs.result} onChange={(e)=>setUserInputs({...userInputs, result: e.target.value})}
                                            className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-xl font-mono font-black text-center focus:border-blue-500 outline-none transition-all"
                                            placeholder="0.0"
                                          />
                                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[12px] text-blue-300">g/ml</span>
                                        </div>
                                     </div>
                                   )}
                                </div>
                            </div>

                            <button onClick={()=>{
                              setDensityObjectPos('SHELF');
                              setUserInputs({ mass: '', volume: '', result: '', m1: '', m2: '' });
                              setIsExploreCylinderFilled(false);
                              setDensityValidation(null);
                              setDensityExerciseFeedback(null);
                              setVSubInputs({ final: '', initial: '200' });
                            }} className="absolute bottom-4 right-4 text-[12px] font-black uppercase text-slate-300 hover:text-red-500 flex items-center gap-2 tracking-widest font-mono p-4">
                               <RefreshCw size={12} /> recommencer
                            </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : activeMode === 'QUIZ' ? (
                  <motion.div key="quiz-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                     <div className="card-base p-10 bg-white border-b-8 border-slate-900 shadow-2xl">
                        <div className="flex justify-between items-start mb-8 border-b pb-8">
                           <div className="space-y-1">
                             <h2 className="text-3xl font-display font-black lowercase text-slate-900">Check-point Pédagogique</h2>
                             <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">Sujet : Masse Volumique</p>
                           </div>
                           <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl text-center">
                              <span className="text-xs font-black tracking-widest opacity-40 block">PROGRESSION</span>
                              <div className="text-2xl font-black">{quizIdx + 1} / {currentQuiz.length}</div>
                           </div>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-10 py-6">
                           <div className="text-[22.5px] font-black font-display leading-tight border-l-8 border-blue-600 pl-8 lowercase italic">
                              « {currentQuiz[quizIdx]?.question} »
                           </div>
                           <div className="grid grid-cols-1 gap-3">
                              {currentQuiz[quizIdx]?.options.map((opt: string, i: number) => {
                                const isCorrect = i === currentQuiz[quizIdx].correct;
                                const isSel = selectedOption === i;
                                let style = "bg-white border-slate-100 hover:border-slate-300";
                                if (showFeedback) {
                                  if (isCorrect) style = "bg-emerald-500 text-white border-emerald-400 scale-[1.02] shadow-xl z-10";
                                  else if (isSel) style = "bg-red-500 text-white border-red-400 opacity-60";
                                  else style = "opacity-20 grayscale";
                                }
                                return (
                                  <button 
                                    key={i} 
                                    disabled={showFeedback} 
                                    onClick={() => handleOptionSelect(i)} 
                                    className={`p-6 rounded-3xl border-2 text-left font-black transition-all flex justify-between items-center group ${style}`}
                                  >
                                    <span className="text-sm uppercase tracking-tight">{opt}</span>
                                    {showFeedback && isCorrect && <CheckCircle2 size={24} />}
                                  </button>
                                );
                              })}
                           </div>
                           <AnimatePresence>
                              {showFeedback && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                                   <h4 className="text-sm font-black uppercase tracking-[0.3em] text-blue-400 mb-2">RÉACTION PÉDAGOGIQUE</h4>
                                   <p className="text-[22.5px] font-serif italic text-slate-300 leading-relaxed mb-8 border-l-2 border-white/10 pl-6">
                                     {currentQuiz[quizIdx].explanation}
                                   </p>
                                   <div className="flex justify-between items-center">
                                      <button onClick={resetQuiz} className="text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 font-mono">
                                         <RefreshCw size={14} /> Redémarrer
                                      </button>
                                      <button 
                                       onClick={nextQuestion}
                                       className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-50 transition-all font-mono"
                                      >
                                         {quizIdx + 1 === currentQuiz.length ? 'Accéder au Labo' : 'Question Suivante'}
                                      </button>
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div key="lab-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* Lab Header & Sample Selector */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-slate-900">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-display font-black lowercase text-slate-900 flex items-center gap-3">
                          <FlaskConical className="text-blue-600" /> Laboratoire de Certification
                        </h2>
                        <div className="flex gap-4 mt-2">
                          <button 
                            onClick={() => {
                              setSubstanceType('SOLID');
                              resetLab();
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${substanceType === 'SOLID' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                          >
                            Solides
                          </button>
                          <button 
                            onClick={() => {
                              setSubstanceType('LIQUID');
                              resetLab();
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${substanceType === 'LIQUID' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                          >
                            Liquides
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {labSamples.map((s, idx) => (
                          <button 
                            key={s.id}
                            onClick={() => { 
                              setCurrentLabIdx(idx); 
                              setLabObjectPos('SHELF'); 
                              setLabFeedback(null); 
                              setIsLabCylinderFilled(false);
                            }}
                            className={`w-14 h-14 rounded-2xl border-4 transition-all font-black flex flex-col items-center justify-center ${currentLabIdx === idx ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'}`}
                          >
                             <span className="text-xs opacity-60 uppercase">Éch.</span>
                             <span className="text-lg leading-none">{idx + 1}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Measurement Area */}
                      <div className="bg-slate-50 rounded-[3rem] p-8 border-4 border-white shadow-inner relative flex flex-col gap-12 overflow-hidden h-[600px]">
                        <div className="flex flex-col items-center gap-8">
                           {/* Shelf / Measurement Bench */}
                           <div className="w-full flex justify-center items-center h-24 border-b border-slate-200 relative">
                              {substanceType === 'LIQUID' && (
                                 <div className="absolute left-8 bottom-3 flex flex-col items-center">
                                    <div className="w-10 h-14 bg-blue-100/20 border-x-4 border-b-4 border-slate-300 rounded-b-lg relative">
                                       <div 
                                         className="absolute bottom-0 w-full h-3/4 opacity-60 rounded-b-md" 
                                         style={{ backgroundColor: labSamples[currentLabIdx].substance.color }} 
                                       />
                                    </div>
                                    <span className="text-xs font-black uppercase text-slate-400 mt-1">Source: ?</span>
                                 </div>
                              )}

                              {labObjectPos === 'SHELF' && (
                                <motion.div 
                                  layoutId="lab-object"
                                  className={`shadow-2xl border-4 border-white/20 cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-3xl font-black ${substanceType === 'SOLID' ? 'w-20 h-20' : 'w-14 h-28 rounded-b-lg'}`}
                                  style={{ 
                                    backgroundColor: substanceType === 'SOLID' ? labSamples[currentLabIdx].substance.color : 'transparent',
                                    clipPath: substanceType === 'SOLID' ? 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)' : 'none',
                                    borderLeft: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                    borderRight: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                    borderBottom: substanceType === 'LIQUID' ? '3px solid #cbd5e1' : undefined,
                                  }}
                                  onClick={() => setLabObjectPos('BALANCE')}
                                >
                                   {substanceType === 'LIQUID' && isLabCylinderFilled && (
                                      <div 
                                        className="w-full absolute bottom-0 transition-all duration-500 rounded-b-sm" 
                                        style={{ 
                                          height: `${(labSamples[currentLabIdx].objectSize / 500) * 100}%`, 
                                          backgroundColor: labSamples[currentLabIdx].substance.color,
                                          opacity: 0.8
                                        }} 
                                      />
                                   )}
                                   {substanceType === 'SOLID' ? '?' : ''}
                                </motion.div>
                              )}
                              <span className="absolute bottom-2 left-4 text-xs font-black uppercase tracking-widest text-slate-300">Étagère de stockage</span>
                           </div>

                           <div className="w-full grid grid-cols-2 gap-12 items-end px-4">
                              {/* Balance */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-full h-40 relative flex flex-col justify-end items-center">
                                  {/* Weighing Tray (Plate) - Always on TOP */}
                                  <div className="w-40 h-4 bg-slate-400 rounded-lg shadow-lg z-20 relative" />
                                  
                                  {/* Body - BOTTOM */}
                                  <div className="w-48 h-32 bg-slate-900 rounded-b-2xl border-b-4 border-slate-950 flex flex-col items-center justify-center shadow-2xl z-10">
                                    <div className="bg-emerald-950/50 px-4 py-2 rounded-lg border border-emerald-500/30">
                                      <span className="font-mono text-3xl font-black text-emerald-400">
                                        {labObjectPos === 'BALANCE' 
                                          ? (substanceType === 'SOLID' 
                                            ? (labSamples[currentLabIdx].substance.rho * labSamples[currentLabIdx].objectSize).toFixed(2)
                                            : (CYLINDER_EMPTY_MASS + (isLabCylinderFilled ? labSamples[currentLabIdx].substance.rho * labSamples[currentLabIdx].objectSize : 0)).toFixed(2))
                                          : "0.00"}
                                      </span>
                                      <span className="text-emerald-400 ml-2 font-black text-sm">g</span>
                                    </div>
                                  </div>
                                  
                                    {labObjectPos === 'BALANCE' && (
                                      <motion.div 
                                        layoutId="lab-object"
                                        className={`absolute bottom-[140px] shadow-2xl border-4 border-white/20 z-30 flex items-center justify-center text-white text-3xl font-black ${substanceType === 'SOLID' ? 'w-20 h-20' : 'w-16 h-32 rounded-b-lg'}`}
                                        style={{ 
                                          backgroundColor: substanceType === 'SOLID' ? labSamples[currentLabIdx].substance.color : 'transparent',
                                          clipPath: substanceType === 'SOLID' ? 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)' : 'none',
                                          borderLeft: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                          borderRight: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                          borderBottom: substanceType === 'LIQUID' ? '4px solid #cbd5e1' : undefined,
                                        }}
                                      >
                                        {substanceType === 'LIQUID' && isLabCylinderFilled && (
                                          <div 
                                            className="w-full absolute bottom-0 transition-all duration-500 rounded-b-md" 
                                            style={{ 
                                              height: `${(labSamples[currentLabIdx].objectSize / 50) * 100}%`, 
                                              backgroundColor: labSamples[currentLabIdx].substance.color,
                                              opacity: 0.8
                                            }} 
                                          />
                                        )}
                                        {substanceType === 'SOLID' ? '?' : ''}
                                      </motion.div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setLabObjectPos('BALANCE')}
                                    className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                  >
                                    Peser
                                  </button>
                                  {substanceType === 'LIQUID' && !isLabCylinderFilled && (
                                    <button 
                                      onClick={() => setIsLabCylinderFilled(true)}
                                      className="mt-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                                    >
                                       Verser
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Cylinder */}
                              <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-64 border-x-4 border-b-4 border-slate-300 rounded-b-2xl relative bg-blue-50/10 backdrop-blur-sm shadow-inner flex flex-col justify-end">
                                    <div className="absolute inset-0 z-0 pointer-events-none px-1">
                                      {Array.from({ length: 51 }, (_, i) => 50 - i).map((v, i) => (
                                        <div key={v} className="absolute w-full flex items-center gap-1" style={{ top: `${(i / 50) * 100}%` }}>
                                          <div className={`h-[1px] bg-slate-400 ${v % 5 === 0 ? 'w-full opacity-100' : 'w-1/3 opacity-40'}`} />
                                          {v % 5 === 0 && <span className="text-[12px] font-black text-slate-800 absolute -right-2 translate-x-full pr-1">{v}</span>}
                                        </div>
                                      ))}
                                    </div>
                                    <motion.div 
                                      animate={{ 
                                        height: substanceType === 'SOLID' 
                                          ? `${((INITIAL_WATER_VOLUME + (labObjectPos === 'CYLINDER' ? labSamples[currentLabIdx].objectSize : 0)) / 50) * 100}%`
                                          : `${((isLabCylinderFilled ? labSamples[currentLabIdx].objectSize : 0) / 50) * 100}%`,
                                        backgroundColor: (labObjectPos === 'CYLINDER' && substanceType === 'SOLID') 
                                          ? '#3b82f6' 
                                          : (substanceType === 'LIQUID' && isLabCylinderFilled)
                                            ? labSamples[currentLabIdx].substance.color
                                            : '#3b82f6'
                                      }} 
                                      className="w-full border-t-4 border-blue-500 flex items-end justify-center p-1 z-10 transition-all duration-1000 relative rounded-b-2xl overflow-hidden"
                                      style={{ opacity: 0.5 }}
                                    >
                                      {labObjectPos === 'CYLINDER' && substanceType === 'SOLID' && (
                                        <motion.div 
                                          initial={{ y: 200 }} animate={{ y: 0 }}
                                          className="w-14 h-14 shadow-2xl border-2 border-white/20 mb-1 flex items-center justify-center text-white text-2xl font-black"
                                          style={{ 
                                            backgroundColor: labSamples[currentLabIdx].substance.color,
                                            clipPath: 'polygon(10% 0%, 90% 10%, 100% 50%, 80% 95%, 20% 100%, 0% 40%)'
                                          }}
                                        >
                                          ?
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </div>
                                  {substanceType === 'SOLID' ? (
                                    <button 
                                      onClick={() => setLabObjectPos('CYLINDER')}
                                      className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                    >
                                      Plonger
                                    </button>
                                  ) : (
                                    <div className="text-sm font-black uppercase text-slate-300 mt-2">Mesure directe</div>
                                  )}
                                </div>
                              </div>
                           </div>
                        </div>

                        {/* Lab Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                           <button onClick={() => setShowReferenceBook(true)} className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 text-blue-600 transition-all"><BookOpen size={20}/></button>
                           <button onClick={() => setShowCalculator(true)} className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:border-slate-400 text-slate-800 transition-all"><Calculator size={20}/></button>
                        </div>
                      </div>

                      {/* Notebook */}
                      <div className="space-y-6">
                        <div className="bg-white border-2 border-slate-900 p-8 rounded-[3rem] shadow-2xl space-y-6">
                          <h3 className="text-[22.5px] font-display font-black lowercase italic text-blue-600 underline underline-offset-8">Rapport d'Identification n°{currentLabIdx + 1} ({substanceType === 'SOLID' ? 'Solide' : 'Liquide'})</h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {substanceType === 'SOLID' ? (
                              <>
                                <div className="space-y-2">
                                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Masse (m)</label>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userMass}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userMass = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-mono font-black text-xl text-slate-900 focus:border-blue-500 outline-none transition-all"
                                      placeholder="0.00"
                                    />
                                    <span className="font-black text-slate-300 text-base">g</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">V₁ (ml)</label>
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userVi}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userVi = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-mono font-black text-lg text-slate-900 focus:border-blue-500 outline-none transition-all"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">V₂ (ml)</label>
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userVf}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userVf = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-mono font-black text-lg text-slate-900 focus:border-blue-500 outline-none transition-all"
                                      placeholder="..."
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">m₁ (cylindre vide)</label>
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userM1}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userM1 = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 font-mono font-black text-lg text-slate-900 focus:border-blue-500 outline-none transition-all text-center"
                                      placeholder="0.0"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">m₂ (cylindre + liq.)</label>
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userM2}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userM2 = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 font-mono font-black text-lg text-slate-900 focus:border-blue-500 outline-none transition-all text-center"
                                      placeholder="0.0"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Volume (V) lu</label>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="text" value={labSamples[currentLabIdx].userVf}
                                      onChange={(e) => {
                                        const next = [...labSamples];
                                        next[currentLabIdx].userVf = e.target.value;
                                        setLabSamples(next);
                                      }}
                                      className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-mono font-black text-xl text-slate-900 focus:border-blue-500 outline-none transition-all"
                                      placeholder="0.0"
                                    />
                                    <span className="font-black text-slate-300 text-base">ml</span>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="space-y-2 pt-4 border-t-2 border-slate-100">
                              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Masse Volumique calculée (ρ)</label>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="text" value={labSamples[currentLabIdx].userRho}
                                  onChange={(e) => {
                                    const next = [...labSamples];
                                    next[currentLabIdx].userRho = e.target.value;
                                    setLabSamples(next);
                                  }}
                                  className="flex-1 bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-mono font-black text-2xl text-blue-700 placeholder:text-blue-200 focus:border-blue-500 outline-none transition-all"
                                  placeholder="..."
                                />
                                <span className="font-black text-blue-200 text-base">g/ml</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[22.5px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Conclusion : Identification</label>
                              <select 
                                value={labSamples[currentLabIdx].userGuess}
                                onChange={(e) => {
                                  const next = [...labSamples];
                                  next[currentLabIdx].userGuess = e.target.value;
                                  setLabSamples(next);
                                }}
                                className="w-full bg-slate-900 text-white rounded-2xl p-4 font-black uppercase text-sm tracking-widest outline-none border-4 border-slate-800 focus:border-blue-500 transition-all cursor-pointer"
                              >
                                <option value="">Choisir la substance...</option>
                                {CHEMICAL_DATA.filter(d => (substanceType === 'SOLID' ? EXPLORATION_IDS : EXPLORATION_LIQUIDS_IDS).includes(d.id)).map(sub => (
                                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                                ))}
                              </select>
                            </div>

                            <button 
                              onClick={() => {
                                const sample = labSamples[currentLabIdx];
                                const trueRho = sample.substance.rho;
                                const userRho = parseFloat(sample.userRho.replace(',', '.'));
                                const isIdCorrect = sample.userGuess === sample.substance.name;
                                const isRhoOk = Math.abs(userRho - trueRho) < 0.11;
                                
                                let procedureError = null;
                                if (substanceType === 'LIQUID') {
                                  const m1 = parseFloat(sample.userM1.replace(',', '.'));
                                  const m2 = parseFloat(sample.userM2.replace(',', '.'));
                                  const V = parseFloat(sample.userVf.replace(',', '.'));
                                  
                                  if (isNaN(m1) || isNaN(m2) || isNaN(V)) {
                                    procedureError = "Toutes les mesures (m₁, m₂, V) doivent être complétées.";
                                  } else {
                                    const expectedM = sample.substance.rho * sample.objectSize;
                                    const userM = m2 - m1;
                                    const isMassOk = Math.abs(userM - expectedM) < 0.1;
                                    const isVOk = Math.abs(V - sample.objectSize) < 0.1;
                                    
                                    if (!isMassOk) procedureError = "Erreur dans les mesures de masse (m₁ ou m₂).";
                                    else if (!isVOk) procedureError = "Volume lu incorrect.";
                                  }
                                }

                                if (procedureError) {
                                  setLabFeedback({ correct: false, msg: procedureError });
                                } else if (isIdCorrect && isRhoOk) {
                                  const next = [...labSamples];
                                  next[currentLabIdx].validated = true;
                                  setLabSamples(next);
                                  setLabFeedback({ correct: true, msg: `Échantillon ${currentLabIdx+1} certifié avec succès !` });
                                } else {
                                  setLabFeedback({ 
                                    correct: false, 
                                    msg: !isRhoOk ? "Masse volumique calculée incorrecte." : "Identification de la substance erronée." 
                                  });
                                }
                              }}
                              className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black uppercase text-base tracking-widest shadow-xl transition-all"
                            >
                               Certifier
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {labFeedback && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={`p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-6 ${labFeedback.correct ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                               {labFeedback.correct ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                               <p className="text-[22.5px] font-serif italic text-white/90 leading-tight">{labFeedback.msg}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto border-t border-slate-200 mt-16 py-12 flex flex-col items-center gap-10 text-sm font-black uppercase tracking-[0.3em] text-slate-400">
        <div className="flex flex-col items-center gap-6">
          <img 
            src="/sarah_langlois_luna_symbol.png" 
            alt="Sarah Langlois-Luna" 
            className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-xl"
            onError={(e) => {
              // Fallback to a placeholder or just hide if missing
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="text-center">
             <p className="tracking-[0.5em] text-slate-500 mb-1 text-sm">Sarah Langlois-Luna</p>
             <p className="text-sm opacity-60">Enseignante de science et technologie</p>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-8">
          <div className="flex items-center gap-4">
            <img src="https://recit.qc.ca/favicon.ico" alt="RÉCIT" className="w-8 h-8 grayscale opacity-20" />
            <p>© 2026 — Science et technologie</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Accessibilité</a>
            <a href="#" className="hover:text-slate-900 transition-colors">PDA Québec</a>
          </div>
        </div>
      </footer>
      <ReferenceBook 
        isOpen={showReferenceBook} 
        onClose={() => setShowReferenceBook(false)} 
        sampleDensities={sampleDensities}
        setSampleDensities={setSampleDensities}
      />
      <ScientificCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </div>
  );
}

const ScientificCalculator = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');

  if (!isOpen) return null;

  const append = (val: string) => {
    if (display === '0' && val !== '.') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setFormula('');
  };

  const calculate = () => {
    try {
      // Basic safety: replace common symbols
      const sanitized = display.replace('×', '*').replace('÷', '/').replace(',', '.');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      setFormula(display + ' =');
      setDisplay(String(Number(result.toFixed(5))));
    } catch {
      setDisplay('Erreur');
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, x: 200, y: 100 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="fixed z-[120] bottom-10 right-10 cursor-move"
    >
      <div 
        className="bg-slate-100 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-xs border-8 border-slate-900 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="font-black uppercase text-sm tracking-widest text-slate-400 select-none">Calculatrice Mobile</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <div className="bg-white p-6 rounded-3xl mb-6 text-right shadow-inner border border-slate-200">
          <div className="text-sm font-black text-slate-300 h-4 mb-1">{formula}</div>
          <div className="text-2xl font-black text-slate-900 truncate">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', 'C', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() => btn === 'C' ? clear() : append(btn)}
              className={`h-12 rounded-2xl font-black text-sm transition-all active:scale-95 ${btn === 'C' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-slate-800 hover:bg-slate-200 shadow-sm'}`}
            >
              {btn}
            </button>
          ))}
          <button 
            onClick={calculate}
            className="col-span-4 h-14 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
          >
            Calculer
          </button>
        </div>
        
        <p className="mt-6 text-sm font-black uppercase text-center text-slate-400 tracking-wider">ρ = m / V</p>
      </div>
    </motion.div>
  );
};

const ReferenceBook = ({ isOpen, onClose, sampleDensities, setSampleDensities }: { isOpen: boolean, onClose: () => void, sampleDensities: any, setSampleDensities: any }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl h-full max-h-[85vh] bg-white shadow-2xl rounded-[3rem] overflow-hidden flex flex-col border border-slate-200"
      >
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-6">
             <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
               <BookOpen size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Tableau des propriétés caractéristiques</h2>
                <p className="text-sm font-black uppercase text-slate-400 tracking-[0.3em]">Module de Référence Scientifique — Complète les données manquantes</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center rounded-3xl bg-slate-900 text-white hover:bg-red-600 transition-all shadow-xl active:scale-90"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-16 font-sans scroll-smooth">
          {/* Legende */}
          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { k: 'TF', v: 'température de fusion' },
               { k: 'TÉ', v: 'température d\'ébullition' },
               { k: 'ρ', v: 'masse volumique' },
               { k: 'CÉ', v: 'conductibilité électrique' }
             ].map((item, i) => (
               <div key={i} className="flex flex-col gap-1">
                 <span className="text-sm font-black uppercase tracking-widest text-blue-600 opacity-60">{item.k}</span>
                 <p className="text-sm font-bold text-slate-800">{item.v}</p>
               </div>
             ))}
          </div>

          <ReferenceSection 
            title="Substances Gazeuses (20°C)" 
            data={CHEMICAL_DATA.filter(d => d.state === 'G')} 
            sampleDensities={sampleDensities}
            setSampleDensities={setSampleDensities}
          />
          
          <ReferenceSection 
            title="Substances Liquides (20°C)" 
            data={CHEMICAL_DATA.filter(d => d.state === 'L')} 
            showCE
            sampleDensities={sampleDensities}
            setSampleDensities={setSampleDensities}
          />

          <ReferenceSection 
            title="Substances Solides (20°C)" 
            data={CHEMICAL_DATA.filter(d => d.state === 'S')} 
            showCE
            sampleDensities={sampleDensities}
            setSampleDensities={setSampleDensities}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const ReferenceSection = ({ title, data, showCE, sampleDensities, setSampleDensities }: { title: string, data: any[], showCE?: boolean, sampleDensities: any, setSampleDensities: any }) => (
  <section className="space-y-8">
    <div className="flex items-center gap-6">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight lowercase">{title}</h3>
      <div className="h-1 flex-1 bg-slate-100 rounded-full" />
    </div>
    <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">
            <th className="p-6">Substance</th>
            <th className="p-6 text-center">TF (°C)</th>
            <th className="p-6 text-center">TÉ (°C)</th>
            <th className="p-6 text-center bg-blue-600/5 text-blue-600">
              ρ {title.includes('Gazeuses') ? '(g/L)' : '(g/ml)'}
            </th>
            {showCE && <th className="p-6 text-center">Conductivité</th>}
            <th className="p-6">Propriétés chimiques</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((d, i) => {
            const isExplored = EXPLORATION_IDS.includes(d.id) || EXPLORATION_LIQUIDS_IDS.includes(d.id);
            const userVal = sampleDensities[d.id];
            
            return (
              <tr key={i} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-0">
                <td className="p-6 font-black text-slate-800">{d.name}</td>
                <td className="p-6 text-center text-slate-500 font-mono italic text-[22.5px]">{d.tf === 0 && d.id !== 'water' ? 'S. o.' : d.tf}</td>
                <td className="p-6 text-center text-slate-500 font-mono italic text-[22.5px]">{d.te === 0 ? 'S. o.' : d.te}</td>
                <td className="p-6 text-center font-mono font-black text-blue-600 bg-blue-600/[0.02]">
                  {isExplored ? (
                    <div className="flex items-center justify-center gap-2">
                       <input 
                         type="text"
                         value={sampleDensities[d.id] || ''}
                         onChange={(e) => setSampleDensities((prev: any) => ({ ...prev, [d.id]: e.target.value }))}
                         placeholder="ρ ?" 
                         className="w-20 bg-blue-50 border-2 border-blue-100 rounded-xl p-2 text-center text-blue-700 font-black focus:border-blue-500 outline-none transition-all placeholder:text-blue-200 shadow-inner"
                       />
                       <span className="text-xs opacity-40">g/ml</span>
                    </div>
                  ) : (
                    d.rho.toLocaleString('fr-FR', { minimumFractionDigits: d.rho < 0.01 ? 5 : 2 })
                  )}
                </td>
                {showCE && <td className="p-6 text-center text-slate-600 font-bold">{d.conductivity || 'Non'}</td>}
                <td className="p-6 text-[22.5px] text-slate-400 font-serif italic group-hover:text-slate-600 transition-colors">
                  {d.chem || 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
)
