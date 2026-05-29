import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flag,
  BookOpen,
  Network,
  Activity,
  TrendingUp,
  Cpu,
  Monitor,
  Cable,
  ArrowRight,
  BarChart4,
} from 'lucide-react';
import { NodeDetail } from '../types';

export default function ArchitectureSection() {
  const [selectedNodeKey, setSelectedNodeKey] = useState<string>('machine');

  // Proposed node specs matching screenshot requirements
  const proposedNodes: Record<string, NodeDetail> = {
    machine: {
      title: "Machine d'Extraction (Moteur CC Principal)",
      content:
        "Moteur à courant continu de forte puissance (450kW) constituant la charge motrice principale de l'arbre vertical d'Ouansimi. Elle génère d'importants courants d'appel transitoires lors de la mise en mouvement verticale du skip lesté.",
      specs: [
        { label: 'Tension Nominale d\'Induit', value: '400V DC' },
        { label: 'Courant de Surcharge Creux', value: '2350 A' },
        { label: 'Tours par minute', value: '0 - 750 tr/min' },
      ],
    },
    sensors: {
      title: 'Transformateurs d\'Intensité et Tension (TC / TT)',
      content:
        "Assurent l'acquisition physique isolée des niveaux d'ampérages et de voltages sur la liaison industrielle d'alimentation. Ils abaissent de manière linéaire les grandeurs physiques en signaux d'instrumentation analogiques injectés dans l'analyseur de puissance.",
      specs: [
        { label: 'Ratio de Transformation TC', value: '1000 / 5 A' },
        { label: 'Classe de Précision Métrologique', value: 'Classe 0.2S (Norme CEI)' },
        { label: 'Tension d\'Isolement Diélectrique', value: '24 kV' },
      ],
    },
    analyzer: {
      title: 'Analyseur Qualité de Réseau (Digital Meter)',
      content:
        "Élément névralgique du dispositif d'instrumentation électrique du stagiaire. Il calcule par échantillonnage rapide de phases les tensions vraies (RMS), les facteurs de puissances croisés, ainsi que le taux de distorsion harmonique global (THD) induit par le variateur thyristor.",
      specs: [
        { label: 'Fréquence de Balayage', value: '256 points / période' },
        { label: 'Registres Mappés', value: 'U, I, F, Cos Phi, P/Q/S, THD%' },
        { label: 'Temps de conversion', value: '12 ms' },
      ],
    },
    plc: {
      title: 'Automate Programmable Industriel (PLC)',
      content:
        "Concentrateur des données Modbus RS485 d'instrumentation. Il exécute de manière cyclique la lecture des registres de l'analyseur de réseau, gère l'historisation des micro-coupures de phase de ligne ONEE et déclenche des avertisseurs locaux en cas de dérive d'impédance.",
      specs: [
        { label: 'Temps de scrutation', value: '20 ms' },
        { label: 'Interface de Comm.', value: '1x RS485 Modbus RTU / 1x RJ45 Profinet' },
        { label: 'Type de Châssis', value: 'SIEMENS S7-1500 compact' },
      ],
    },
    scada: {
      title: 'Supervision Centrale et IHM (SCADA)',
      content:
        "Niveau supérieur informatique d'archivage et d'aide à la décision. Il stocke les historiques d'appels de courants de démarrage du skip dans une base de données SQL pour le calcul automatique de l'indicateur de fatigue thermique du bobinage d'induit du moteur.",
      specs: [
        { label: 'Moteur Base de Données', value: 'PostgreSQL Historian SQL' },
        { label: 'Rafraîchissement Graphique', value: '500 ms' },
        { label: 'Outils', value: 'Génération de tendances (trends) & Courbe de charge' },
      ],
    },
  };

  const currentNodeDetails = proposedNodes[selectedNodeKey] || proposedNodes.machine;

  return (
    <div className="space-y-12 text-white">
      {/* SECTION 6: PROJET DE STAGE OVERVIEW */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 6.0
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Projet de Stage : Système de Mesure des Paramètres Électriques
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Conception d'une structure d'acquisition à distance pour l'identification continue des profils de consommation 
            et de déséquilibre de la machine d'extraction (skip).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Objectives */}
          <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 text-white flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-white text-[11px] uppercase tracking-[0.15em]">
                Objectifs du Projet
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed text-left text-justify mb-2">
              Développer une solution robuste pour la capture en temps réel des données électriques critiques, 
              assurant une surveillance continue des équipements vitaux d'extraction minière afin de prévenir les défaillances.
            </p>
          </div>

          {/* Card: Methodology */}
          <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-white text-[11px] uppercase tracking-[0.15em]">
                Méthodologie retenue
              </h3>
            </div>
            <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside mb-1 pl-1 font-mono">
              <li>Analyse préliminaire des besoins électriques</li>
              <li>Calculs et sélection des rapports de TC/TT</li>
              <li>Développement de la pile Modbus RTU</li>
              <li>Campagne d'essais en laboratoire</li>
            </ul>
          </div>

          {/* Card: Architecture summary */}
          <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 text-white flex items-center justify-center">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-white text-[11px] uppercase tracking-[0.15em]">
                Structure Industrielle
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed text-left text-justify mb-2">
              Une structure hiérarchique réseau complète allant du niveau terrain (capteurs de courant type TC et de tension TT) 
              jusqu'au niveau supérieur d'acquisition et de commande SCADA raccordé à la base SQL.
            </p>
          </div>

          {/* Card: Expected results */}
          <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 text-white flex items-center justify-center">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-sans font-bold text-white text-[11px] uppercase tracking-[0.15em]">
                Garanties de Précision Attendues
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900 p-4 border border-white/15 rounded-none">
                <span className="block text-[8px] font-bold uppercase font-mono tracking-widest text-neutral-500 mb-1.5">
                  Précision Métrologique
                </span>
                <span className="font-mono text-white font-black text-sm md:text-md">
                  &lt; 0.5% Marge d'erreur
                </span>
              </div>
              <div className="bg-neutral-900 p-4 border border-white/15 rounded-none">
                <span className="block text-[8px] font-bold uppercase font-mono tracking-widest text-neutral-500 mb-1.5">
                  Temps de scrutation Max
                </span>
                <span className="font-mono text-white font-black text-sm md:text-md">
                  &lt; 100 ms Cycle complet
                </span>
              </div>
            </div>
          </div>

          {/* Card: Benefits */}
          <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 text-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-white text-[11px] uppercase tracking-[0.15em]">
                Gains Énergétiques Opérationnels
              </h3>
            </div>
            <p className="text-xs text-neutral-450 leading-relaxed text-left text-justify mb-2">
              Réduction de <span className="text-white font-bold font-mono">15% des arrêts programmés</span> par maintenance 
              prospective, maximisation de l'économie d'énergie sur les redresseurs de ligne et rallongement du cycle thermique.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE PROPOSED ARCHITECTURE */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 7.0
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Architecture Systémique Proposée
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Flux de transfert de données : Du capteur analogique terrain à la base SCADA centrale. 
            Sélectionnez une étape de l'architecture pour charger sa structure fonctionnelle.
          </p>
        </header>

        {/* FLOW GRAPH BLOCK CONTAINER */}
        <div className="bg-neutral-950 border border-white/10 p-6 overflow-x-auto relative">
          <div className="min-w-[800px] flex items-center justify-between gap-3 relative z-10 p-4">
            {/* Block 1: Machine */}
            <button
              onClick={() => setSelectedNodeKey('machine')}
              className={`flex flex-col items-center w-36 outline-none cursor-pointer group`}
            >
              <div
                className={`w-14 h-14 border transition-all ${
                  selectedNodeKey === 'machine'
                    ? 'border-white bg-white scale-110 text-black'
                    : 'border-white/10 bg-neutral-900 hover:border-white/30 text-white'
                } flex items-center justify-center`}
              >
                <Cpu className="w-5 h-5" />
              </div>
              <span className={`text-[8px] uppercase tracking-[0.15em] font-bold mt-3 block text-center ${
                selectedNodeKey === 'machine' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}>
                Machine d'Extraction
              </span>
            </button>

            {/* Line arrow icon */}
            <div className="h-px bg-neutral-800 flex-1 relative flex items-center justify-center">
              <span className="text-[8px] uppercase font-mono tracking-widest text-neutral-600 absolute -bottom-5">
                Courant / Phase
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-700 absolute right-0" />
            </div>

            {/* Block 2: TC/TT */}
            <button
              onClick={() => setSelectedNodeKey('sensors')}
              className={`flex flex-col items-center w-36 outline-none cursor-pointer group`}
            >
              <div
                className={`w-14 h-14 border transition-all ${
                  selectedNodeKey === 'sensors'
                    ? 'border-white bg-white scale-110 text-black'
                    : 'border-white/10 bg-neutral-900 hover:border-white/30 text-white'
                } flex items-center justify-center`}
              >
                <Cable className="w-5 h-5" />
              </div>
              <span className={`text-[8px] uppercase tracking-[0.15em] font-bold mt-3 block text-center ${
                selectedNodeKey === 'sensors' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}>
                TC / TT Mesure
              </span>
            </button>

            {/* Line arrow icon */}
            <div className="h-px bg-neutral-800 flex-1 relative flex items-center justify-center">
              <span className="text-[8px] uppercase font-mono tracking-widest text-neutral-600 absolute -bottom-5">
                Rapport Analogique
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-700 absolute right-0" />
            </div>

            {/* Block 3: Analyzer */}
            <button
              onClick={() => setSelectedNodeKey('analyzer')}
              className={`flex flex-col items-center w-36 outline-none cursor-pointer group`}
            >
              <div
                className={`w-14 h-14 border transition-all ${
                  selectedNodeKey === 'analyzer'
                    ? 'border-white bg-white scale-110 text-black shadow-md'
                    : 'border-white/10 bg-neutral-900 hover:border-white/30 text-white'
                } flex items-center justify-center`}
              >
                <BarChart4 className="w-5 h-5" />
              </div>
              <span className={`text-[8px] uppercase tracking-[0.15em] font-bold mt-3 block text-center ${
                selectedNodeKey === 'analyzer' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}>
                Analyseur Triphasé
              </span>
            </button>

            {/* Line arrow icon */}
            <div className="h-px border-t-2 border-dashed border-neutral-800 flex-1 relative flex items-center justify-center">
              <span className="text-[8px] font-bold font-mono text-white bg-neutral-900 border border-white/10 px-2 py-0.5 absolute -top-3">
                MODBUS RS485
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 absolute right-0" />
            </div>

            {/* Block 4: PLC */}
            <button
              onClick={() => setSelectedNodeKey('plc')}
              className={`flex flex-col items-center w-36 outline-none cursor-pointer group`}
            >
              <div
                className={`w-14 h-14 border transition-all ${
                  selectedNodeKey === 'plc'
                    ? 'border-white bg-white scale-110 text-black'
                    : 'border-white/10 bg-neutral-900 hover:border-white/30 text-white'
                } flex items-center justify-center`}
              >
                <Cpu className="w-5 h-5" />
              </div>
              <span className={`text-[8px] uppercase tracking-[0.15em] font-bold mt-3 block text-center ${
                selectedNodeKey === 'plc' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}>
                Automate (PLC)
              </span>
            </button>

            {/* Line arrow icon */}
            <div className="h-px bg-neutral-800 flex-1 relative flex items-center justify-center">
              <span className="text-[8px] uppercase font-mono tracking-widest text-neutral-600 absolute -bottom-5">
                RJ45 Ethernet
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-700 absolute right-0" />
            </div>

            {/* Block 5: SCADA */}
            <button
              onClick={() => setSelectedNodeKey('scada')}
              className={`flex flex-col items-center w-36 outline-none cursor-pointer group`}
            >
              <div
                className={`w-16 h-14 border transition-all ${
                  selectedNodeKey === 'scada'
                    ? 'border-white bg-white scale-110 text-black'
                    : 'border-white/10 bg-neutral-900 hover:border-white/30 text-white'
                } flex items-center justify-center`}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <span className={`text-[8px] uppercase tracking-[0.15em] font-bold mt-3 block text-center ${
                selectedNodeKey === 'scada' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}>
                Supervision SCADA
              </span>
            </button>
          </div>

          {/* LOWER SPEC DETAILS PANEL */}
          <div className="mt-10 bg-neutral-900 border border-white/10 p-6 min-h-[160px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNodeKey}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold font-mono">
                    MODULE D'ARCHITECTURE SÉLECTIONNÉ
                  </span>
                  <h4 className="font-sans font-extrabold text-white text-[14px] uppercase tracking-wider mt-1">
                    {currentNodeDetails.title}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed text-justify">
                  {currentNodeDetails.content}
                </p>

                {/* Sub-specs table */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-8 text-xs font-mono">
                  {currentNodeDetails.specs.map((sp, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[8px] font-extrabold text-neutral-500 uppercase tracking-[0.15em] block">
                        {sp.label}
                      </span>
                      <span className="text-white font-bold mt-1">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
