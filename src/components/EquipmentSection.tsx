import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Cpu,
  RefreshCw,
  Power,
  Shield,
  Gauge,
  Sliders,
  Compass,
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  role: string;
  specs: { label: string; value: string }[];
  icon: any;
  extendedDetails: string;
}

export default function EquipmentSection() {
  const [activeNode, setActiveNode] = useState<string>('onee');
  const [activeComponentId, setActiveComponentId] = useState<string>('moteur');

  // Input calculator states
  const [motorEfficiency, setMotorEfficiency] = useState<number>(92);
  const [calcWindingSpeed, setCalcWindingSpeed] = useState<number>(8.5); // m/s
  const [calcSkipWeight, setCalcSkipWeight] = useState<number>(12); // tons total

  // Calculated variables
  const gravity = 9.81;
  const skipMassKg = calcSkipWeight * 1000;
  const dynamicPowerKw = parseFloat(
    ((skipMassKg * gravity * calcWindingSpeed) / (1000 * (motorEfficiency / 100))).toFixed(1)
  );

  // Electrical nodes of proposed diagram matching prompt
  const distributionNodes = [
    {
      id: 'onee',
      title: 'Ligne ONEE',
      value: '60 kV',
      role: 'Réseau National Interconnecté',
      details: 'Fournit la tension alternative triphasée principale de 60kV via deux liaisons aériennes en boucle ouverte.',
      efficiency: '100%',
      pfs: 'Interrupteur sectionneur 1200A SF6 automatique',
    },
    {
      id: 'principal',
      title: 'Poste Principal',
      value: '60/22 kV',
      role: 'Redressement & Abaissement de Tension',
      details: 'Comprend deux transformateurs de puissance triphasés de 16 MVA raccordés en étoile/triangle.',
      efficiency: '98.4%',
      pfs: "Parafoudres à oxyde de zinc et relais protection d'impédance",
    },
    {
      id: 'jour',
      title: 'Poste Mine Jour',
      value: '22 kV / 5.5 kV',
      role: 'Sous-station Centrale Auxiliaire',
      details: 'Sous-station de distribution moyenne tension vers la machinerie des skips et des compresseurs pneumatiques.',
      efficiency: '97.2%',
      pfs: 'Disjoncteurs à coupure dans le vide et relais de surintensité homopolaire',
    },
    {
      id: 'machine',
      title: 'Machine Ext.',
      value: '400 V DC',
      role: 'Variateur Pont de Graetz Triphasé',
      details: "Alimente le pont à thyristor DCREG4 de la machine d'extraction (skip) pour convertir le courant alternatif en continu réglable.",
      efficiency: '94.8%',
      pfs: 'Fusibles ultra-rapides UR et filtre de protection d\'harmoniques d\'ordre 5 et 7',
    },
  ];

  const currentDistributionNode = distributionNodes.find((n) => n.id === activeNode) || distributionNodes[0];

  // Specific components matching prompt
  const equipmentComponents: EquipmentItem[] = [
    {
      id: 'moteur',
      name: 'Moteur CC',
      role: 'Entraînement principal du système.',
      specs: [
        { label: 'Puissance Nominale', value: '450 kW' },
        { label: 'Tension Nominale', value: '400 V DC' },
        { label: 'Courant Nominal', value: '1180 A' },
        { label: 'Vitesse de rotation', value: '750 tr/min' },
      ],
      icon: Zap,
      extendedDetails:
        "Moteur à courant continu robuste avec excitation indépendante constante. La régulation se fait par la tension d'induit afin de délivrer un couple maximal dès la vitesse nulle lors du démarrage du skip chargé à pleine capacité.",
    },
    {
      id: 'variateur',
      name: 'Variateur DCREG4',
      role: 'Régulation de vitesse et couple.',
      specs: [
        { label: 'Type de convertisseur', value: 'Pont double 4 Quadrants' },
        { label: 'Bus de communication', value: 'Modbus RTU RS485' },
        { label: 'Surcharge admissible', value: '200% pendant 60s' },
        { label: 'Régulateur', value: 'Microcontrôleur 32-bit DSP' },
      ],
      icon: Cpu,
      extendedDetails:
        "Variateur de vitesse à microprocesseur pour induit de moteur CC. Permet la marche avant/arrière ainsi que le freinage par récupération d'énergie en renvoyant l'énergie électrique vers le réseau moyenne tension 22kV.",
    },
    {
      id: 'tambour',
      name: 'Tambour',
      role: "Enroulement des câbles d'extraction.",
      specs: [
        { label: 'Diamètre Tambour', value: '3.5 m' },
        { label: 'Type de profil', value: 'Bi-cylindroconique' },
        { label: 'Longueur de câble utile', value: '620 m' },
        { label: 'Épaisseur de paroi', value: '38 mm' },
      ],
      icon: Compass,
      extendedDetails:
        "Élément mécanique rotatif de grand diamètre supportant le câble tracteur en acier antigiratoire de 32mm. La configuration bi-cylindrique compense la charge variable liée à la longueur de suspension du câble pendu dans le puits.",
    },
  ];

  const currentComponent =
    equipmentComponents.find((c) => c.id === activeComponentId) || equipmentComponents[0];

  return (
    <div className="space-y-12 text-white">
      {/* SECTION 2: ALIMENTATION INTERACTIVE */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 4.0
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Alimentation Électrique Globale
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Architecture de distribution d'énergie depuis le réseau national ONEE au transformateur principal,
            puis abaissement de tension et redressement vers les armoires d'entraînement. Cliquez sur un bloc ci-dessous 
            pour inspecter son profil de sûreté.
          </p>
        </header>

        {/* INTERACTIVE DISTRIBUTION GRAPH */}
        <div className="bg-neutral-950 border border-white/10 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 py-4 max-w-4xl mx-auto">
            {distributionNodes.map((node, index) => {
              const NodeIcon = index === 0 ? Zap : index === 1 ? RefreshCw : index === 2 ? Power : Shield;
              const isSelected = activeNode === node.id;

              return (
                <div key={node.id} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                  {/* Node trigger */}
                  <button
                    onClick={() => setActiveNode(node.id)}
                    className={`flex flex-col items-center p-4 w-40 rounded-none border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-none scale-105'
                        : 'bg-neutral-900 border-white/10 hover:border-white/30 text-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
                        isSelected ? 'bg-neutral-950 text-white' : 'bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <NodeIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans tracking-[0.1em] uppercase">
                      {node.title}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none mt-2 ${
                      isSelected ? 'bg-neutral-250 text-black' : 'bg-neutral-950 text-neutral-400 border border-white/10'
                    }`}>
                      {node.value}
                    </span>
                  </button>

                  {/* Flow Arrow (not showing on the last node) */}
                  {index < distributionNodes.length - 1 && (
                    <div className="hidden md:flex items-center justify-center p-2 flex-grow">
                      <svg className="w-12 h-6 overflow-visible" viewBox="0 0 48 24">
                        <line
                          x1="0"
                          y1="12"
                          x2="40"
                          y2="12"
                          className="flow-dash-anim"
                          stroke={isSelected ? '#ffffff' : '#333333'}
                          strokeWidth="2"
                        />
                        <polygon
                          points="38,8 44,12 38,16"
                          fill={isSelected ? '#ffffff' : '#333333'}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* NODE SPECIFICATION PANEL */}
          <div className="mt-8 bg-neutral-900 border border-white/10 p-5">
            <h4 className="font-sans font-bold text-white text-[12px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span>FICHE TECHNIQUE :</span>
              <span className="text-neutral-400 font-mono font-bold text-xs">{currentDistributionNode.title.toUpperCase()}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
              <div className="space-y-1 bg-neutral-950 p-3.5 border border-white/5">
                <span className="font-bold text-neutral-500 uppercase tracking-[0.18em] text-[8px] block">Rôle</span>
                <p className="text-white font-medium">{currentDistributionNode.role}</p>
              </div>
              <div className="space-y-1 bg-neutral-950 p-3.5 border border-white/5">
                <span className="font-bold text-neutral-500 uppercase tracking-[0.18em] text-[8px] block">
                  Sécurité / Protection
                </span>
                <p className="text-white font-medium">{currentDistributionNode.pfs}</p>
              </div>
              <div className="space-y-1 bg-neutral-950 p-3.5 border border-white/5">
                <span className="font-bold text-neutral-500 uppercase tracking-[0.18em] text-[8px] block">
                  Rendement Estimé
                </span>
                <p className="font-mono text-white font-black text-sm">
                  {currentDistributionNode.efficiency}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-450 italic pl-1 leading-relaxed">{currentDistributionNode.details}</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MACHINE D'EXTRACTION */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 5.0
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Composants de la Machine d'Extraction (Treuil)
          </h2>
          <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed mt-1">
            Composants électromécaniques fondamentaux raccordés à l'automate industriel de contrôle. 
            Sélectionnez un organe pour analyser sa fonction.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Component Tabs column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {equipmentComponents.map((comp) => {
              const CompIcon = comp.icon;
              const isSelected = activeComponentId === comp.id;

              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveComponentId(comp.id)}
                  className={`w-full text-left p-5 transition-all outline-none cursor-pointer border rounded-none ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-neutral-900 text-white hover:bg-neutral-950'
                  }`}
                >
                  <div className={`flex items-center justify-between mb-3 border-b pb-2 ${isSelected ? 'border-neutral-200' : 'border-white/5'}`}>
                    <h4 className="font-sans font-extrabold uppercase tracking-wider text-xs">{comp.name}</h4>
                    <CompIcon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-neutral-400'}`} />
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-[0.15em] block mb-1 ${isSelected ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Rôle
                  </span>
                  <p className={`text-xs text-justify leading-relaxed font-sans ${isSelected ? 'text-neutral-850' : 'text-neutral-300'}`}>
                    {comp.role}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Component Data Details Column */}
          <div className="lg:col-span-8 flex flex-col justify-between border border-white/10 bg-neutral-950 overflow-hidden">
            {/* Upper Content */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                <span className="text-[9px] uppercase tracking-[0.15em] text-neutral-400 font-bold font-mono">
                  FICHE SPÉCIFICATIONS TECHNIQUES
                </span>
                <span className="text-[10px] font-mono font-bold text-white bg-neutral-900 border border-white/10 p-1 px-3">
                  {currentComponent.name} ID : {currentComponent.id.toUpperCase()}
                </span>
              </div>

              {/* Grid Specifications list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentComponent.specs.map((sp, i) => (
                  <div key={i} className="p-4 bg-neutral-900 border border-white/10 rounded-none">
                    <span className="block text-[8px] font-bold uppercase font-mono tracking-[0.15em] text-neutral-500 mb-1">
                      {sp.label}
                    </span>
                    <span className="font-mono text-xs md:text-sm text-white font-extrabold tracking-wide">
                      {sp.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="block text-[9px] font-bold font-mono uppercase tracking-[0.18em] text-white">
                  Détails Opérationnels de Stage
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans text-justify bg-neutral-900 p-4 border border-white/10">
                  {currentComponent.extendedDetails}
                </p>
              </div>
            </div>

            {/* Calculations Playground - Custom Extra Value */}
            <div className="bg-neutral-900 border-t border-white/10 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-white" />
                <h4 className="font-sans font-bold text-white text-[12px] uppercase tracking-[0.2em]">
                  Simulateur de Puissance du Treuil (Calculs d'Ingénierie)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* S1: Efficiency */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-wider block">
                    Rendement Moteur (%)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={motorEfficiency}
                    onChange={(e) => setMotorEfficiency(parseInt(e.target.value))}
                    className="w-full accent-white h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400 font-semibold">
                    <span>92% Nom.</span>
                    <span className="text-white font-bold">{motorEfficiency}%</span>
                  </div>
                </div>

                {/* S2: Velocity */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-wider block">
                    Vitesse du Skip (m/s)
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="0.5"
                    value={calcWindingSpeed}
                    onChange={(e) => setCalcWindingSpeed(parseFloat(e.target.value))}
                    className="w-full accent-white h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400 font-semibold">
                    <span>8.5 m/s Std.</span>
                    <span className="text-white font-bold">{calcWindingSpeed} m/s</span>
                  </div>
                </div>

                {/* S3: Payload total mass */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-wider block">
                    Charge Utile + Skip (tonnes)
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={calcSkipWeight}
                    onChange={(e) => setCalcSkipWeight(parseInt(e.target.value))}
                    className="w-full accent-white h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400 font-semibold">
                    <span>12t Max</span>
                    <span className="text-white font-bold">{calcSkipWeight} t</span>
                  </div>
                </div>
              </div>

              {/* Render calculation output */}
              <div className="bg-neutral-950 border border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-[0.18em] block">
                    Puissance Électrique Requise Estimée
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                    Modèle d'équilibre statique: <code className="bg-neutral-900 border border-white/10 p-0.5 px-2 font-mono text-white font-semibold text-[10px]">P = (m * g * v) / η</code>
                  </p>
                </div>
                <div className="text-center bg-neutral-900 px-6 py-2 border border-white/10 rounded-none">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-wider block mb-0.5">
                    Capacité Calculée
                  </span>
                  <span className="font-mono text-white text-lg font-black tracking-wide">
                    {dynamicPowerKw} kW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
