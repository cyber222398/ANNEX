import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Sliders,
  Settings,
  Wrench,
  Disc,
  ArrowRight,
  Shield,
  ShieldAlert,
  Play,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';

export default function TransmissionSection() {
  // Simulator states
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);
  const [sensorsNoisy, setSensorsNoisy] = useState<boolean>(false);
  const [limitSwitchActive, setLimitSwitchActive] = useState<boolean>(false);
  const [rotationDir, setRotationDir] = useState<'forward' | 'reverse'>('forward');
  const [isWinding, setIsWinding] = useState<boolean>(true);

  // Status computation
  const isOnline = !emergencyStopped && !limitSwitchActive;
  const currentStatus = emergencyStopped
    ? 'TRIP URGENCE - ARRET INSTATANÉ'
    : limitSwitchActive
    ? 'LIMITE ATTEINTE - VERROUILLAGE SÉCURITÉ'
    : sensorsNoisy
    ? 'ATTENTION - BRUIT CAPTEUR DÉTECTÉ'
    : isWinding
    ? 'EN MARCHE / ROTATION NOMINALE'
    : 'STANDBY / PRET';

  return (
    <div className="space-y-12 text-white">
      {/* SECTION 4: DIAGRAMME DE TRANSMISSION DE PUISSANCE */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 4.3
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
            Système de Transmission de Puissance Kinématique
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Visualisation hydro-mécanique du flux d'énergie de couple de l'alternateur aux câbles du skip.
          </p>
        </header>

        {/* METADATA DIAGRAM CONTAINER */}
        <div className="bg-neutral-950 border border-white/10 p-6 relative overflow-hidden">
          {/* Subtle dots background */}
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 space-y-8">
            {/* Top row elements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 items-center max-w-4xl mx-auto">
              {/* Box 1: Electric grid */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Étape 1
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Réseau 60kV</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-neutral-600">
                <ArrowRight className="w-5 h-5 animate-pulse text-white" />
              </div>

              {/* Box 2: Variateur */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Étape 2
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Variateur</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-neutral-600">
                <ArrowRight className="w-5 h-5 animate-pulse text-white" />
              </div>

              {/* Box 3: CC Engine */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Settings className="w-5 h-5 text-white animate-spin" style={{ animationDuration: isOnline ? '6s' : '0s' }} />
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Étape 3
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Moteur CC</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-neutral-600">
                <ArrowRight className="w-5 h-5 animate-pulse text-white" />
              </div>

              {/* Box 4: Reducer */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Étape 4
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Réducteur</span>
              </div>
            </div>

            {/* Bottom Row Elements */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center max-w-3xl mx-auto pt-6 border-t border-white/10">
              {/* Box 5: Drum */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Disc className="w-5 h-5 text-white animate-spin" style={{ animationDuration: isOnline ? '12s' : '0s' }} />
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Étape 5
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Tambour d'or</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-neutral-600">
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Box 6: Cables */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded bg-neutral-950 border border-white/10 flex items-center justify-center text-white mb-2 shadow-inner">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-6 bg-white rounded-none animate-bounce"></span>
                    <span className="w-1.5 h-6 bg-neutral-500 rounded-none animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Câbles acier
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">32 mm Diam.</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-neutral-600">
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Box 7: Skip Lift */}
              <div className="bg-neutral-900 border border-white/10 rounded-none p-4 text-center flex flex-col items-center">
                <motion.div
                  className="w-12 h-12 rounded-none bg-white flex items-center justify-center text-black mb-2 shadow"
                  animate={isOnline && isWinding ? { y: [0, -3, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="text-[9px] font-mono font-black text-black uppercase">SKIP</span>
                </motion.div>
                <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  Réceptacle
                </span>
                <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">Capacité 10t</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMMANDS DE SUPERVISION AUTOMATE INTERACTIVE */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 5.0
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
            Pupitre de Commande & Automate de Sécurité (SIEMENS S7)
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Simulez un incident géotechnique ou électrique en cours de montée du skip pour vérifier les réflexes 
            automatisés programmés dans les cartes d'entrées/sorties physiques de la machine.
          </p>
        </header>

        {/* CONTROLLER WORKSPACEGRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* COLUMN 1: INTERACTIVE ENTRÉES (INPUTS) */}
          <div className="lg:col-span-4 bg-neutral-900 border border-white/10 p-5 flex flex-col rounded-none">
            <h3 className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-white border-b border-white/5 pb-2 mb-4 flex items-center justify-between">
              <span>Entrées Physiques (Induit)</span>
              <span className="text-[8px] font-mono bg-neutral-950 text-white border border-white/10 px-2 py-0.5 rounded-none">
                CAPTEURS
              </span>
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-around">
              {/* Emergency stop option */}
              <div className={`p-3 rounded-none border transition-colors ${
                emergencyStopped ? 'bg-red-950/20 border-red-500/30' : 'bg-neutral-950 border-white/5'
              } flex items-center justify-between`}>
                <div>
                  <label className="text-xs font-extrabold text-white block uppercase tracking-wide">Arrêt d'Urgence Coup de Poing</label>
                  <span className={`text-[8px] uppercase font-mono tracking-wider font-bold block mt-1 ${
                    emergencyStopped ? 'text-red-400' : 'text-neutral-500'
                  }`}>
                    {emergencyStopped ? 'ACTIF (OUVERT)' : 'NORMAL (FERMÉ)'}
                  </span>
                </div>
                <button
                  onClick={() => setEmergencyStopped(!emergencyStopped)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer outline-none ${
                    emergencyStopped ? 'bg-red-700 justify-end' : 'bg-neutral-850 border border-white/10 justify-start'
                  }`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow-md inline-block"></span>
                </button>
              </div>

              {/* End of shaft limit switch */}
              <div className={`p-3 rounded-none border transition-colors ${
                limitSwitchActive ? 'bg-neutral-950 border-white opacity-95' : 'bg-neutral-950 border-white/5'
              } flex items-center justify-between`}>
                <div>
                  <label className="text-xs font-bold text-white block uppercase tracking-wide">Fins de Course de Puits</label>
                  <span className="text-[8px] uppercase font-mono tracking-wider text-neutral-500 block mt-1">
                    {limitSwitchActive ? 'BUTEÉ DÉPASSÉE' : 'TRAJECTOIRE SÉCURISÉE'}
                  </span>
                </div>
                <button
                  onClick={() => setLimitSwitchActive(!limitSwitchActive)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer outline-none ${
                    limitSwitchActive ? 'bg-white justify-end' : 'bg-neutral-850 border border-white/10 justify-start'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full shadow-md inline-block ${limitSwitchActive ? 'bg-black' : 'bg-white'}`}></span>
                </button>
              </div>

              {/* Sensor noise simulator */}
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-none border border-white/5">
                <div>
                  <label className="text-xs font-bold text-white block uppercase tracking-wide">Ondulations harmoniques</label>
                  <span className="text-[8px] uppercase font-mono tracking-wider text-neutral-500 block mt-1">
                    {sensorsNoisy ? "Bruit élevé détecté" : "Bruit réseau filtré"}
                  </span>
                </div>
                <button
                  onClick={() => setSensorsNoisy(!sensorsNoisy)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer outline-none ${
                    sensorsNoisy ? 'bg-white justify-end' : 'bg-neutral-850 border border-white/10 justify-start'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full shadow-md inline-block ${sensorsNoisy ? 'bg-black' : 'bg-white'}`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: THE AUTOMATE CPU BODY */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center relative p-6 bg-neutral-950 border border-white/10 rounded-none text-white text-center">
            {/* Blinking alarm if stopped */}
            {emergencyStopped && (
              <div className="absolute top-4 right-4 bg-red-600 animate-ping h-3.5 w-3.5 rounded-full"></div>
            )}

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-none bg-neutral-900 border border-white/10 flex items-center justify-center text-white mx-auto">
                <ShieldAlert className={`w-8 h-8 ${emergencyStopped ? 'text-red-500 animate-pulse' : 'text-white'}`} />
              </div>
              <h3 className="font-mono font-bold text-md uppercase tracking-wider">SIEMENS S7-1500</h3>
              <p className="text-[9px] font-mono tracking-[0.2em] text-neutral-450 uppercase bg-neutral-900 border border-white/5 py-1 px-4 rounded-none block mx-auto w-fit">
                Automate Centralisé
              </p>

              <div className="space-y-1.5 pt-4 text-left font-mono text-[10px] text-neutral-400 bg-neutral-900 p-4 border border-white/5 w-full max-w-xs">
                <p className="flex justify-between">
                  <span>CPU Load:</span> <span className="text-white font-bold">12.4%</span>
                </p>
                <p className="flex justify-between animate-pulse">
                  <span>Modbus Bus:</span> <span className="text-emerald-400 font-bold uppercase">Stable</span>
                </p>
                <p className="flex justify-between">
                  <span>Alim 24V:</span> <span className="text-white font-bold font-mono">23.8 V</span>
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: SORTIES PHYSIQUES (OUTPUT STATUS) */}
          <div className="lg:col-span-4 bg-neutral-900 border border-white/10 p-5 flex flex-col rounded-none">
            <h3 className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-white border-b border-white/5 pb-2 mb-4 flex items-center justify-between">
              <span>Sorties Réflexes (Bobine)</span>
              <span className="text-[8px] font-mono bg-neutral-950 text-white border border-white/10 px-2 py-0.5 rounded-none">
                ACTIONNEURS
              </span>
            </h3>

            {/* Dynamic list rendering based on sensors input states */}
            <div className="space-y-4 flex-1 flex flex-col justify-around text-xs font-mono">
              {/* Output 1: Start/Stop Enable */}
              <div className="flex justify-between items-center p-2.5 border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-neutral-350">
                  <Play className="w-3.5 h-3.5" />
                  <span>Start / Stop / Enable</span>
                </div>
                <span
                  className={`p-1 px-2.5 text-[9px] font-mono font-extrabold uppercase rounded-none ${
                    isOnline && isWinding ? 'bg-white text-black' : 'bg-neutral-950 text-red-500 border border-red-950'
                  }`}
                >
                  {isOnline && isWinding ? 'FONCTIONNEL' : 'VERROUILLÉ'}
                </span>
              </div>

              {/* Output 2: Direction */}
              <div className="flex justify-between items-center p-2.5 border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-neutral-350">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sens de rotation ind.</span>
                </div>
                <span className="text-white font-bold bg-neutral-950 px-2.5 py-1 border border-white/10 text-[9px]">
                  {rotationDir === 'forward' ? 'MONTEE (CW)' : 'DESCENTE (CCW)'}
                </span>
              </div>

              {/* Output 3: Emergency Brake */}
              <div className="flex justify-between items-center p-2.5 border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-neutral-350">
                  <TriangleAlert className="w-3.5 h-3.5" />
                  <span>Serrage Freins</span>
                </div>
                <span
                  className={`p-1 px-2.5 text-[9px] font-mono font-extrabold uppercase rounded-none ${
                    emergencyStopped || limitSwitchActive ? 'bg-red-950 text-red-400 border border-red-500/20 animate-pulse' : 'bg-neutral-950 border border-white/10 text-neutral-500'
                  }`}
                >
                  {emergencyStopped || limitSwitchActive ? 'BLOQUE SECOUR' : 'DEBLOQUE'}
                </span>
              </div>

              {/* Output 4: Hydraulics pump */}
              <div className="flex justify-between items-center p-2.5">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-neutral-350">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Pompe Centrale Hydr.</span>
                </div>
                <span
                  className={`p-1 px-2.5 text-[9px] font-mono font-extrabold uppercase rounded-none ${
                    emergencyStopped ? 'bg-neutral-950 border border-white/10 text-neutral-500' : 'bg-white text-black'
                  }`}
                >
                  {emergencyStopped ? 'STATIQUE' : 'DEBIT NOM.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM REAL-TIME BROADCAST LOG */}
        <div className="bg-neutral-950 border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                emergencyStopped
                  ? 'bg-red-500 animate-ping'
                  : limitSwitchActive
                  ? 'bg-amber-500'
                  : 'bg-white animate-pulse'
              }`}
            ></span>
            <div>
              <h4 className="font-sans font-bold text-white text-[13px] uppercase tracking-wider">
                Statut Système d'Extraction (Skip)
              </h4>
              <p className="text-[10px] text-neutral-550 font-mono tracking-wider mt-0.5">
                Fréquence d'échantillonnage de l'API : 50ms - liaison Modbus RS485 actif
              </p>
            </div>
          </div>

          <div className="font-mono text-[11px] font-black p-2.5 px-4 rounded-none bg-neutral-900 border border-white/5 text-white tracking-wide uppercase">
            Console : <span className={emergencyStopped ? 'text-red-400 font-extrabold' : 'text-white'}>{currentStatus}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
