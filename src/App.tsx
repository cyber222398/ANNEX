import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import IntroductionSection from './components/IntroductionSection';
import EquipmentSection from './components/EquipmentSection';
import TransmissionSection from './components/TransmissionSection';
import ArchitectureSection from './components/ArchitectureSection';
import OtherSections from './components/OtherSections';
import CalculationsTab from './components/CalculationsTab';
import DocumentationTab from './components/DocumentationTab';
import { X, Layers, Compass, Zap, Eye, Download, Printer } from 'lucide-react';

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculations' | 'reports'>('dashboard');
  const [activeSection, setActiveSection] = useState<SectionType>('introduction');

  // Academic metadata states customizable in Hero Card
  const [authorName, setAuthorName] = useState<string>('Ayoub Aznag');
  const [schoolName, setSchoolName] = useState<string>('Université Ibn Zohr (UIZ)');
  const [academicYear, setAcademicYear] = useState<string>('2023 - 2024');

  // Interactive Verification States
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Full Mine Map Overlay State
  const [showFullMap, setShowFullMap] = useState<boolean>(false);

  // Chapters progress tracker
  const [progress, setProgress] = useState<Record<SectionType, boolean>>({
    introduction: true,
    geology: false,
    extraction_method: false,
    equipment: false,
    transmission: false,
    architecture: false,
    safety: false,
    environmental: false,
    finances: false,
    conclusion: false,
  });

  // Automatically mark sections as viewed/completed upon visit
  useEffect(() => {
    setProgress((prev) => ({
      ...prev,
      [activeSection]: true,
    }));
  }, [activeSection]);

  // Simulate verification tests
  const handleVerify = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
      setHasErrors(false);
    }, 1500);
  };

  // Full Stage report download action
  const handleExportPDF = () => {
    // Elegant system print or formatted text-as-doc fallback
    const confirmMessage = "Voulez-vous lancer l'impression propre du livret académique de stage ?";
    if (window.confirm(confirmMessage)) {
      window.print();
    }
  };

  return (
    <div className="app-shell min-h-screen text-white flex flex-col font-sans select-text antialiased overflow-x-hidden">
      {/* HEADER COMPONENT */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onVerify={handleVerify}
        onExport={handleExportPDF}
        hasErrors={hasErrors}
        isValidated={isValidated}
      />

      {/* VERIFYING SPINNER MODAL */}
      <AnimatePresence>
        {isValidating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="technical-surface rounded-[8px] p-8 border flex flex-col items-center max-w-xs text-center">
              <div className="w-12 h-12 rounded-full border-4 border-t-ore-gold border-neutral-800 animate-spin mb-4"></div>
              <h4 className="font-sans font-bold text-white text-[12px] uppercase tracking-[0.2em]">
                Contrôle d'Intégrité
              </h4>
              <p className="text-[11px] text-neutral-450 mt-2 max-w-xs font-sans tracking-wide">
                Analyse des rapports de distorsions et des registres d'induits Modbus RS485...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 max-w-[1480px] w-full mx-auto relative items-stretch px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {activeTab === 'dashboard' ? (
          <>
            {/* LEFT SIDEBAR NAVIGATION */}
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              progress={progress}
              onShowFullMap={() => setShowFullMap(true)}
            />

            {/* MAIN DATA VIEW AREA */}
            <main className="min-w-0 flex-1 space-y-8 md:space-y-10 overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'introduction' && (
                    <IntroductionSection
                      authorName={authorName}
                      setAuthorName={setAuthorName}
                      schoolName={schoolName}
                      setSchoolName={setSchoolName}
                      academicYear={academicYear}
                      setAcademicYear={setAcademicYear}
                    />
                  )}

                  {activeSection === 'equipment' && <EquipmentSection />}

                  {activeSection === 'transmission' && <TransmissionSection />}

                  {activeSection === 'architecture' && <ArchitectureSection />}

                  {/* General / Other narrative Chapters (Geology, Method, Safety, Env, Finances, Conclusion) */}
                  {![
                    'introduction',
                    'equipment',
                    'transmission',
                    'architecture',
                  ].includes(activeSection) && <OtherSections section={activeSection} />}
                </motion.div>
              </AnimatePresence>
            </main>
          </>
        ) : activeTab === 'calculations' ? (
          <main className="min-w-0 flex-1 space-y-8 md:space-y-10">
            <CalculationsTab />
          </main>
        ) : (
          <main className="min-w-0 flex-1 space-y-8 md:space-y-10">
            <DocumentationTab />
          </main>
        )}
      </div>

      {/* FULL INTERACTIVE MAP MODAL OVERLAY */}
      <AnimatePresence>
        {showFullMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="technical-surface text-white border w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden relative rounded-[8px]"
            >
              {/* Top Bar */}
              <div className="bg-panel-ink/95 border-b border-white/10 p-5 md:p-6 flex justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-ore-gold" />
                  <div>
                    <h3 className="font-sans font-bold text-white text-[15px] uppercase tracking-wider">
                      Coupe Orthogonale Complète du Puits Principal
                    </h3>
                    <p className="text-[9px] uppercase font-mono tracking-[0.2em] text-neutral-500 mt-1.5">
                      Gisement d'Ouansimi - Modélisation Académique de Stage ({authorName})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullMap(false)}
                  className="p-2 sm:px-4 border border-white/20 text-white bg-transparent hover:bg-white hover:text-black rounded-full text-[10px] font-medium uppercase tracking-[0.15em] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Fermer</span>
                </button>
              </div>

              {/* Graphic Body */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-neutral-950">
                {/* Visual Shaft Representation */}
                <div className="md:col-span-5 readable-card border border-white/15 p-6 text-white flex flex-col justify-between items-center relative overflow-hidden min-h-[400px]">
                  {/* Vertical lines and levels */}
                  <div className="absolute left-1/2 -ml-3 top-0 bottom-0 w-6 border-l border-r border-dashed border-white/10"></div>

                  {/* Surface Level */}
                  <div className="absolute top-[8%] left-4 right-4 h-px border-t border-dashed border-white/10 text-[9px] font-mono text-neutral-500 text-left">
                    <span>Niveau +50m (Surface)</span>
                  </div>

                  {/* Mid Level */}
                  <div className="absolute top-[48%] left-4 right-4 h-px border-t border-dashed border-white/10 text-[9px] font-mono text-neutral-500 text-left">
                    <span>Niveau -300m (Broyeur global)</span>
                  </div>

                  {/* Bottom level */}
                  <div className="absolute top-[90%] left-4 right-4 h-px border-t border-dashed border-white/10 text-[9px] font-mono text-neutral-500 text-left">
                    <span>Niveau -565m (Fond de Puits)</span>
                  </div>

                  {/* Golden animated Skip elevator box */}
                  <motion.div
                    animate={{ y: [40, 320, 40] }}
                    transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
                    className="absolute left-1/2 -ml-2.5 w-5 h-7 bg-ore-gold rounded-[2px] flex flex-col items-center justify-center border border-black shadow-[0_0_20px_rgba(214,168,66,0.45)]"
                  >
                    <span className="text-[7px] font-mono text-black font-extrabold">SK</span>
                  </motion.div>

                  <div className="z-10 font-mono text-[9px] text-white uppercase font-bold tracking-[0.2em] text-center">
                    AXE DU PUITS VERTICAL
                  </div>
                  <div className="z-10 font-mono text-[9px] text-neutral-500 text-center uppercase tracking-wider">
                    Hauteur Suspendue utile : 615m
                  </div>
                </div>

                {/* Legend and parameters */}
                <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-sans font-bold text-white text-[13px] uppercase tracking-[0.2em] border-b border-white/10 pb-3">
                      Fiche d'Évaluation de Structure
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed text-justify">
                      Le puits d'Ouansimi possède un diamètre utile intérieur maçonné de 5.5 mètres. 
                      Les câbles de guidage verticaux (type rigide en acier demi-clos) préviennent les oscillations 
                      latérales du skip lors des accélérations de 0.8m/s² dans les galeries et inter-niveaux.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-4 readable-card border border-white/10">
                        <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">Fins de courses</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wide">Sécurisés</span>
                      </div>
                      <div className="p-4 readable-card border border-white/10">
                        <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">Inclinaison Max</span>
                        <span className="text-white font-bold font-mono">&lt; 0.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-ore-gold/10 rounded-[8px] border border-ore-gold/25 text-[11px] text-justify text-neutral-200 tracking-wide font-sans leading-relaxed">
                    * Recommandation de stage : Raccorder des caméras d'inspection étanches durcies IP67 aux points stratégiques -300m et -500m pour un retour d'image constant sur l'IHM de la machine.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
