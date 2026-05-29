import {
  BookOpen,
  Settings,
  Info,
  Layers,
  Wrench,
  Activity,
  Zap,
  Shield,
  Leaf,
  DollarSign,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { SectionType } from '../types';

interface SidebarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  progress: Record<SectionType, boolean>;
  onShowFullMap: () => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  progress,
  onShowFullMap,
}: SidebarProps) {
  const menuItems: { id: SectionType; label: string; icon: any; order: string }[] = [
    { id: 'introduction', label: '1. Présentation de la mine', icon: Info, order: '1.0' },
    { id: 'geology', label: '2. Géologie & Gisements', icon: Layers, order: '2.0' },
    { id: 'extraction_method', label: "3. Méthodes d'Extraction", icon: Award, order: '3.0' },
    { id: 'equipment', label: '4. Alimentation & Équipements', icon: Zap, order: '4.0' },
    { id: 'transmission', label: '5. Transmission & Commande', icon: Activity, order: '5.0' },
    { id: 'architecture', label: '6. Projet & Architecture', icon: Wrench, order: '6.0' },
    { id: 'safety', label: '7. Sécurité & Surveillance', icon: Shield, order: '7.0' },
    { id: 'environmental', label: "8. Impact de l'écosystème", icon: Leaf, order: '8.0' },
    { id: 'finances', label: '9. Analyse financière / LOM', icon: DollarSign, order: '9.0' },
    { id: 'conclusion', label: '10. Conclusions & Stage', icon: BookOpen, order: '10.0' },
  ];

  // Calculate completion percentage
  const completedCount = Object.values(progress).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / menuItems.length) * 100);

  return (
    <aside className="technical-surface w-full shrink-0 overflow-hidden rounded-[8px] border md:sticky md:top-[132px] md:flex md:h-[calc(100vh-156px)] md:w-72 md:flex-col md:overflow-y-auto">
      {/* Student/Report Identification Header */}
      <div className="border-b border-white/10 bg-panel-steel/70 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-[8px] bg-ore-gold text-black font-black text-xs flex items-center justify-center tracking-tighter uppercase italic select-none">
            SP
          </div>
          <div>
            <h2 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-white">Section Progress</h2>
            <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">Report Annex v1.2</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[8px] uppercase font-mono tracking-[0.2em] text-neutral-400">
            <span>Rapport d'Analyse</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-ore-gold h-full rounded-full transition-all duration-500 shadow-[0_0_18px_rgba(214,168,66,0.45)]"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onShowFullMap}
          className="w-full mt-4 py-2.5 border border-ore-gold/35 bg-ore-gold/10 text-ore-gold rounded-full text-[9px] font-bold uppercase tracking-[0.18em] hover:bg-ore-gold hover:text-black transition-all cursor-pointer"
        >
          View Full Mine Map
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-4 md:py-6 md:overflow-y-auto">
        <span className="px-4 md:px-6 text-[9px] font-bold text-neutral-550 uppercase tracking-[0.25em] block mb-3">
          Sommaire Interactif
        </span>
        <ul className="flex gap-2 overflow-x-auto px-4 pb-2 md:block md:space-y-1 md:overflow-visible md:px-0 md:pb-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isCompleted = progress[item.id];

            return (
              <li key={item.id} className="shrink-0 md:shrink">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-60 md:w-full text-left flex items-center justify-between gap-3 rounded-[8px] md:rounded-none px-4 md:px-6 py-3 transition-all outline-none cursor-pointer border border-white/10 md:border-y-0 md:border-r-0 md:border-l-4 ${
                    isActive
                      ? 'bg-white text-black font-bold border-white shadow-[0_12px_34px_rgba(255,255,255,0.10)]'
                      : 'border-transparent text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-500'}`} />
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider line-clamp-1">{item.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Analysé"></span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" title="À visiter"></span>
                    )}
                    <ChevronRight className={`w-3 h-3 ${isActive ? 'text-black' : 'text-neutral-600'} stroke-[3]`} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Metadata / Settings Footer */}
      <div className="hidden md:block p-6 border-t border-white/10 bg-panel-steel/70 space-y-3 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-neutral-950/80 border border-white/5 rounded-[8px] text-center">
            <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">
              Mine ID
            </span>
            <span className="font-mono text-[9px] text-white font-extrabold uppercase tracking-widest">
              Ouan-09
            </span>
          </div>
          <div className="p-2.5 bg-neutral-950/80 border border-white/5 rounded-[8px] text-center">
            <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">
              Statut
            </span>
            <span className="font-mono text-[9px] text-emerald-400 font-bold flex items-center justify-center gap-1 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="text-[9px] text-neutral-500 text-center font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} OUANSIMI
        </div>
      </div>
    </aside>
  );
}
