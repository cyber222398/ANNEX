import {
  Calculator,
  CheckCircle,
  Download,
  FileText,
  Landmark,
  LayoutDashboard,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'calculations' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'calculations' | 'reports') => void;
  onVerify: () => void;
  onExport: () => void;
  hasErrors: boolean;
  isValidated: boolean;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calculations', label: 'Calculs', icon: Calculator },
  { id: 'reports', label: 'Journal', icon: FileText },
] as const;

export default function Header({
  activeTab,
  setActiveTab,
  onVerify,
  onExport,
  hasErrors,
  isValidated,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-panel-ink/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-3 py-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-ore-gold/50 bg-ore-gold text-black shadow-[0_0_30px_rgba(214,168,66,0.18)]">
              <span className="font-black uppercase italic tracking-tighter">O.</span>
              <span className="absolute bottom-1 left-1 right-1 h-px bg-black/30"></span>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black uppercase italic leading-none tracking-tight text-white sm:text-xl">
                Ouansimi
              </h1>
              <p className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-450 sm:block">
                Mine extraction study console
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={onVerify}
              className={`flex h-10 items-center gap-1.5 rounded-full border px-3 text-[10px] font-bold uppercase tracking-[0.16em] transition-all sm:px-4 ${
                isValidated
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/15 bg-white/5 text-white hover:border-ore-gold/60 hover:text-ore-gold'
              }`}
              title="Verifier les donnees du rapport"
            >
              {isValidated && <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />}
              <span className="hidden sm:inline">{isValidated ? 'Valide' : 'Verifier'}</span>
              <span className="sm:hidden">{isValidated ? 'OK' : 'Test'}</span>
            </button>

            <button
              onClick={onExport}
              className="flex h-10 items-center gap-1.5 rounded-full border border-ore-gold/60 bg-ore-gold px-3 text-[10px] font-black uppercase tracking-[0.16em] text-black transition hover:bg-[#edc465] sm:px-4"
              title="Exporter le rapport PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exporter</span>
            </button>

            <div className="hidden h-8 w-px bg-white/12 sm:block"></div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  hasErrors ? 'bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]' : 'bg-emerald-400'
                }`}
              ></span>
              <Landmark className="h-3.5 w-3.5 text-neutral-200" />
            </div>
          </div>
        </div>

        <nav className="flex w-full gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1.5 md:w-fit md:self-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-fit items-center justify-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all sm:px-5 ${
                  isActive
                    ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)]'
                    : 'text-neutral-450 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
