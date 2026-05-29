import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Camera,
  Layers,
  Info,
  Maximize2,
  Minimize2,
  Bookmark,
  CheckCircle,
  TrendingUp,
  Download,
  Edit2,
  Check,
} from 'lucide-react';
import { MineLevel } from '../types';

interface IntroductionSectionProps {
  authorName: string;
  setAuthorName: (name: string) => void;
  schoolName: string;
  setSchoolName: (school: string) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
}

export default function IntroductionSection({
  authorName,
  setAuthorName,
  schoolName,
  setSchoolName,
  academicYear,
  setAcademicYear,
}: IntroductionSectionProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('0');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);

  // Mine levels data according to prompt schemas
  const mineLevels: MineLevel[] = [
    {
      level: '+50',
      depth: 50,
      percentage: 0,
      title: 'Level +50m (Surface)',
      description:
        "Zone d'accès surface et de stockage préliminaire. Ce niveau héberge l'entrée principale du personnel, le triage mécanique primaire des stériles et le raccordement des pylônes de la ligne ONEE.",
      primaryFunctions: [
        'Réception et aiguillage des skips de surface',
        "Embarquement initial de l'équipe d'exploitation",
        'Tiers convoyeur vers décanteur principale',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '0',
      depth: 0,
      percentage: 7.7,
      title: 'Level 0m (Surface Principale)',
      description:
        "Niveau d'exploitation principal et stationnement de surface. Abrite la machine d'extraction (treuil, tambour bi-cylindrique de 3.5m) et le système d'entraînement électrique principal (Moteur CC 450 kW).",
      primaryFunctions: [
        'Pont roulant et treuil de manutention',
        'Centrale de ventilation principale de la mine d\'or',
        'Cabinet du variateur et armoire automate de pilotage',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-50',
      depth: -50,
      percentage: 15.4,
      title: 'Level -50m (Transition Supérieure)',
      description:
        'Niveau d\'accès intermédiaire stabilisé. Zone de dépollution des eaux pluviales et de redistribution vers la centrale de ventilation de secours sous-terraine.',
      primaryFunctions: [
        'Drainage géologique des infiltrations supérieures',
        'Entrepôt de matériel léger et de sécurité incendie',
        'Vanne de compensation pneumatique',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-100',
      depth: -100,
      percentage: 23,
      title: 'Level -100m (Gisement Supérieur)',
      description:
        "Zone d'extraction historique. Aujourd'hui utilisée comme station d'essai de ventilation forcée et de renforcement des cadres métalliques horizontaux.",
      primaryFunctions: [
        'Surveillance sismique active',
        'Redirection des flux d\'air vers le puits principal',
        'Accès aux galeries de forage horizontales désaffectées',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1516216628859-9bccecad13ca?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-150',
      depth: -150,
      percentage: 30.7,
      title: 'Level -150m (Galerie Est)',
      description:
        "Niveau d'extraction secondaire. On y exploite des veines d'or à faible densité avec des chargeuses à profil bas (LHD). Raccordement au puits de service adjacent.",
      primaryFunctions: [
        'Forage géologique de précision',
        "Centrale d'injection de béton de soutènement",
        'Galerie de liaison vers le puits de secours Est',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-200',
      depth: -200,
      percentage: 38.4,
      title: 'Level -200m (Chambre Technique Supérieure)',
      description:
        "Station d'alimentation électrique intermédiaire. Comprend des transformateurs secs d'isolement (22kV/400V) pour l'alimentation locale des compresseurs d'air et des pompes.",
      primaryFunctions: [
        'Sous-station moyenne tension locale',
        'Parc de compresseurs pour outillage pneumatique',
        'Abri de survie pressorisé à autonomie de 48 heures',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-250',
      depth: -250,
      percentage: 46.1,
      title: 'Level -250m (Zone d\'Exploitation Nord)',
      description:
        "Front de taille hautement productif. Ce niveau utilise d'importantes machines de dynamitage et assure l'alimentation des broyeurs secondaires du niveau inférieur.",
      primaryFunctions: [
        'Dynamitage de précision contrôlé',
        'Collecte et évacuation des blocs de quartz aurifère',
        'Contrôle automatique de turbidité de l\'air',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-300',
      depth: -300,
      percentage: 53.8,
      title: 'Level -300m (Broyeur Primaire)',
      description:
        "Niveau mécanique lourd. Héberge la station de concaténation et de concassage du quartz. Le minerai y est réduit à 0-150mm avant d'être glissé vers la trémie d'évacuation du skip.",
      primaryFunctions: [
        'Concassage hydraulique continu de forte puissance',
        'Contrôle de poussière par brumisation haute pression',
        'Système de convoyage automatisé par automate PLC',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-350',
      depth: -350,
      percentage: 61.5,
      title: 'Level -350m (Transition Matériel)',
      description:
        "Zone de maintenance intermédiaire des engins sous-terrains. Stock important de foreuses hydrauliques d'excavation et d'huiles de transmission biodégradables.",
      primaryFunctions: [
        'Garage de maintenance des camions miniers articulés',
        "Stockage sécurisé des lubrifiants sous monitoring d'incendie",
        "Atelier d'affûtage des taillants de foreuses",
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-365',
      depth: -365,
      percentage: 69.2,
      title: 'Level -365m (Arrivée de Câbles)',
      description:
        'Niveau stratégique pour la transmission mécanique. Ce palier abrite le guidage intermédiaire des câbles en acier du skip et des capteurs de tension dynamiques.',
      primaryFunctions: [
        'Guidage à rouleaux anti-vibratoires des câbles',
        'Ajustement des butées de fin de course de sécurité',
        'Capteurs de pesage piezoélectriques de la charge utile',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-400',
      depth: -400,
      percentage: 76.9,
      title: 'Level -400m (Zone Active Sud)',
      description:
        "Filons d'or à forte concentration. Forages verticaux par méthode de 'Sublevel Stoping' avec remblayage cimenté pour maximiser la sécurité de l'excavation.",
      primaryFunctions: [
        'Forage ascendant et descendant par rampe',
        'Remblayage cimenté automatisé des chantiers',
        'Contrôle géochimique continu de la teneur du quartz',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-450',
      depth: -450,
      percentage: 84.6,
      title: 'Level -450m (Station de Pompage)',
      description:
        'Station d\'exhaure principale. Elle combat la pression hydrostatique en refoulant directement 450 m³ d\'eau par heure vers les bassins de décantation de la surface.',
      primaryFunctions: [
        'Mise en service séquentielle de 3 pompes multicellulaires de 110 kW',
        "Dégrillage et décantation interne de l'eau acide",
        'Télésurveillance des débits via protocole Modbus',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-500',
      depth: -500,
      percentage: 92.3,
      title: 'Level -500m (Silo de Chargement)',
      description:
        "Trémie de stockage et de déchargement du skip. Le minerai broyé y est pesé avec précision à l'aide d'un doseur pneumatique avant d'être déversé dans le skip d'extraction.",
      primaryFunctions: [
        "Dosage pondéral automatique de la trémie d'alimentation",
        "Ouverture/fermeture par vérins pneumatiques de la trappe de chargement",
        'Liaison interphone directe avec le machiniste en surface',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=800',
    },
    {
      level: '-565',
      depth: -565,
      percentage: 100,
      title: 'Level -565m (Fond du Puits)',
      description:
        "Puisard et fondation du puits d'extraction. Zone la plus humide et soumise à une forte pression rocheuse. Il accueille les poulies de queue et le système de tension de câble de guidage.",
      primaryFunctions: [
        'Nettoyage périodique manuel des résidus de sédimentation',
        'Station de tension hydraulique des câbles de guidage',
        'Capteurs de surcourse extrêmes raccordés à l\'arrêt d\'urgence',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const currentLevel = mineLevels.find((l) => l.level === selectedLevelId) || mineLevels[1];

  const handleDownloadSpecs = () => {
    const text = `STUDY SPECIFICATIONS FOR MINE LEVEL ${currentLevel.title}
----------------------------------------
Depth: ${currentLevel.depth} meters
Description: ${currentLevel.description}
Primary Functions:
${currentLevel.primaryFunctions.map((f, i) => ` - ${i + 1}. ${f}`).join('\n')}
----------------------------------------
Generated from: ${schoolName} Academic report (${academicYear})
Author: ${authorName}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `specs-level-${currentLevel.level}m.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* 1. BLUEPRINT HERO CARD */}
      <section className="technical-surface relative min-h-[420px] w-full border flex items-center justify-center md:justify-start p-5 sm:p-6 md:p-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600"
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-panel-ink via-panel-ink/90 to-panel-ink/35"></div>
        {/* Decorative Grid Overlay similar to the design */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]"></div>

        {/* Content Container (Card with frosted glass / outline styled in black) */}
        <div className="readable-card relative z-10 w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-8 border border-white/10 border-l-4 border-l-ore-gold shadow-2xl backdrop-blur flex flex-col justify-between">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 px-3 bg-white/10 text-white text-[9px] font-bold font-mono uppercase tracking-[0.2em] rounded-full">
                  ANNEXE NUMÉRIQUE
                </span>
                <span className="p-1 px-3 bg-ore-gold text-black text-[9px] font-bold font-mono uppercase tracking-[0.2em] rounded-full">
                  RAPPORT TECHNIQUE
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white font-sans">
                Étude de la Machine d'Extraction (Skip)
              </h2>
              <h3 className="font-mono font-medium text-ore-gold text-[11px] uppercase tracking-[0.2em]">
                Mine d'Or Ouansimi — Région de Souss-Massa
              </h3>
            </div>
            <button
              onClick={() => setIsEditingMeta(!isEditingMeta)}
              className="p-2 rounded-full bg-neutral-950/80 hover:bg-white hover:text-black border border-white/10 text-neutral-400 transition cursor-pointer"
              title="Modifier les données académiques"
            >
              {isEditingMeta ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="border-t border-white/10 mt-6 pt-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.25em] block mb-1">
                Stagiaire / Auteur
              </span>
              {isEditingMeta ? (
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-1.5 bg-neutral-950 border border-white/20 rounded-[6px] focus:border-ore-gold focus:ring-0 text-white"
                />
              ) : (
                <p className="font-sans font-bold text-white text-[13px] uppercase tracking-wide">{authorName}</p>
              )}
            </div>
            <div>
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.25em] block mb-1">
                École / Institution
              </span>
              {isEditingMeta ? (
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-1.5 bg-neutral-950 border border-white/20 rounded-[6px] focus:border-ore-gold focus:ring-0 text-white"
                />
              ) : (
                <p className="font-sans font-bold text-white text-[13px] uppercase tracking-wide">{schoolName}</p>
              )}
            </div>
            <div>
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.25em] block mb-1">
                Année Universitaire
              </span>
              {isEditingMeta ? (
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full text-xs font-mono px-2 py-1.5 bg-neutral-950 border border-white/20 rounded-[6px] focus:border-ore-gold focus:ring-0 text-white"
                />
              ) : (
                <p className="font-mono text-white text-[13px] font-bold">{academicYear}</p>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Vertical Shaft Graphic & Dynamic Skip Container */}
        <div className="shaft-mark absolute right-8 md:right-16 top-0 bottom-0 w-24 border-l border-r border-dashed border-ore-gold/30 bg-white/[0.01] pointer-events-none hidden md:block">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2"></div>
          {/* Shaft Level Lines and Markers */}
          <div className="absolute top-[20%] left-0 w-full h-px bg-white/5"></div>
          <div className="absolute top-[40%] left-0 w-full h-px bg-white/5"></div>
          <div className="absolute top-[60%] left-0 w-full h-px bg-white/5"></div>
          <div className="absolute top-[80%] left-0 w-full h-px bg-white/5"></div>

          {/* Golden animated lift/skip box */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: [20, 240, 20] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-1/2 -ml-5 w-10 h-10 bg-ore-gold border border-black rounded-[4px] shadow-[0_0_26px_rgba(214,168,66,0.5)] flex items-center justify-center pointer-events-auto"
          >
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
            <span className="text-[8px] text-black font-extrabold ml-1 font-mono uppercase">SKIP</span>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION INTRODUCTION AND EXPLORER */}
      <section className="technical-surface border p-5 sm:p-6 md:p-8 space-y-8">
        <header className="border-b border-white/10 pb-5">
          <span className="text-[10px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            Section 1.0
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase font-sans text-white">
            Présentation de la mine d'Ouansimi
          </h2>
          <p className="text-sm text-neutral-450 mt-2 max-w-4xl leading-relaxed">
            Coupe transversale interactive de la mine d'or d'Ouansimi. Sélectionnez un niveau de profondeur 
            spécifique sur l'architecture verticale à gauche pour inspecter ses caractéristiques techniques, 
            ses missions fonctionnelles ainsi que ses images de documentation géologiques réelles.
          </p>
        </header>

        {/* INTERACTIVE COLUMN VIEWGRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* COLUMN 1: INTERACTIVE SHAFT TIMELINE */}
          <div className="lg:col-span-4 readable-card border border-white/10 p-5 flex flex-col justify-between">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-white mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" />
              Puits Vertical d'Architecture
            </h4>

            {/* Vertical level line and dot markers */}
            <div className="relative border-l-2 border-neutral-800 ml-4 pl-6 py-2 pb-6 space-y-4">
              {mineLevels.map((lvl) => {
                const isSelected = selectedLevelId === lvl.level;
                return (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevelId(lvl.level)}
                    className="flex items-center gap-3 w-full text-left group focus:outline-none relative cursor-pointer"
                  >
                    {/* Ring indicator dot matching screenshot */}
                    <div
                      className={`absolute -left-[31px] w-[11px] h-[11px] border transition-all ${
                        isSelected
                          ? 'bg-white border-black scale-125'
                          : 'bg-neutral-950 border-neutral-700 group-hover:border-neutral-500'
                      }`}
                    ></div>

                    <div className="flex items-baseline justify-between w-full">
                      <span
                        className={`text-[11px] font-mono tracking-wider transition-all ${
                          isSelected
                            ? 'text-white font-black'
                            : 'text-neutral-500 group-hover:text-neutral-300'
                        }`}
                      >
                        Niveau {lvl.level}m
                      </span>
                      {isSelected && (
                        <span className="text-[8px] uppercase tracking-[0.15em] bg-white text-black px-1.5 py-0.5 font-mono font-bold">
                          ACTIF
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: DATA SHEETS WITH GLASSMORPHISM AND PICTURE */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="readable-card border border-white/10 h-full flex flex-col overflow-hidden">
              {/* Header of sheet */}
              <div className="bg-panel-ink/85 border-b border-white/10 px-5 sm:px-6 py-4 flex justify-between items-center gap-4 shrink-0">
                <div>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500 font-mono font-bold">
                    PROFONDEUR ENREGISTRÉE
                  </span>
                  <h3 className="font-mono font-bold text-white text-md uppercase tracking-wider">
                    Palier {currentLevel.level}m
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-ore-gold/10 text-white p-1.5 px-3 border border-ore-gold/25 rounded-full">
                  <span className="text-xs font-mono font-black tracking-wider">
                    {Math.abs(currentLevel.depth)} m
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-450">
                    Sous-Sol
                  </span>
                </div>
              </div>

              {/* Data Content Body */}
              <div className="p-5 sm:p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="space-y-6 flex flex-col justify-between">
                  {/* Explanation card */}
                  <div>
                    <h5 className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 pb-1.5 mb-3.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-white" />
                      Spécifications de la Zone
                    </h5>
                    <p className="text-xs md:text-sm text-neutral-350 leading-relaxed font-sans">
                      {currentLevel.description}
                    </p>
                  </div>

                  {/* Duties list */}
                  <div>
                    <h5 className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 pb-1.5 mb-3.5 flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-white" />
                      Fonctions Principales
                    </h5>
                    <ul className="text-xs md:text-sm text-neutral-300 space-y-3 list-none pl-0">
                      {currentLevel.primaryFunctions.map((fn, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{fn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Picture Container */}
                <div className="flex flex-col h-full min-h-[220px]">
                  <h5 className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 pb-1.5 mb-3.5 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-white" />
                    Cliché de la galerie technique
                  </h5>
                  <div className="flex-1 bg-neutral-950 border border-white/10 overflow-hidden relative group">
                    <img
                      src={currentLevel.imageUrl}
                      alt={`Level ${currentLevel.level} documentation photo`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300"></div>

                    {/* Meta tag corner */}
                    <div className="absolute bottom-3 left-3 bg-neutral-950 border border-white/10 text-[9px] font-mono text-white p-1.5 px-3 hover:bg-black transition uppercase tracking-widest">
                      Galerie {currentLevel.level}m
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower actions of sheet */}
              <div className="bg-panel-ink/85 border-t border-white/10 px-5 sm:px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                <button
                  onClick={handleDownloadSpecs}
                  className="px-4 py-2 border border-white/20 text-white hover:bg-white hover:text-black rounded-full text-[10px] font-bold uppercase tracking-[0.18em] transition cursor-pointer"
                >
                  Télécharger les Spécifications
                </button>
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="px-4 py-2 bg-ore-gold text-black hover:bg-[#edc465] rounded-full text-[10px] font-bold uppercase tracking-[0.18em] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Agrandir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL SCREEN MODAL */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col text-white"
            >
              <div className="bg-neutral-950 border-b border-white/10 px-6 py-5 flex justify-between items-center">
                <div>
                  <h4 className="font-sans font-bold text-white text-[15px] uppercase tracking-wider">
                    Visualisation HD Génie Minière
                  </h4>
                  <p className="text-[9px] uppercase font-mono tracking-[0.2em] text-neutral-500 mt-1">
                    Unité {currentLevel.level} m - {schoolName} (Annexe Académique)
                  </p>
                </div>
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="p-1 px-4 border border-white/20 text-white bg-transparent hover:bg-white hover:text-black rounded-none text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-neutral-950">
                <div className="h-full max-h-[400px] border border-white/15 rounded-none overflow-hidden relative">
                  <img
                    src={currentLevel.imageUrl}
                    alt="Extended level documentation photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="p-1 px-3 bg-neutral-900 text-white border border-white/10 text-[8px] font-bold font-mono tracking-[0.2em] uppercase">
                      ZONE GÉOLOGIE
                    </span>
                    <h3 className="text-lg font-black text-white mt-3 uppercase tracking-wider font-sans">
                      Niveau {currentLevel.level} m - ({currentLevel.depth}m)
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">{currentLevel.description}</p>
                  <div className="bg-neutral-900 border border-white/10 p-4 text-xs font-mono">
                    <h5 className="font-bold uppercase text-neutral-500 mb-2 tracking-wider text-[9px]">Paramètres géotechniques</h5>
                    <p>Contrainte de cisaillement locale: <span className="text-white font-bold font-mono">2.4 MPa</span></p>
                    <p className="mt-1.5">Pression hydrostatique estimée: <span className="text-white font-bold font-mono">{Math.abs(currentLevel.depth) * 0.1} bars</span></p>
                    <p className="mt-1.5">Accélération sismique admissible: <span className="text-white font-bold font-mono font-mono">0.15g</span></p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleDownloadSpecs}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold uppercase tracking-[0.18em] rounded-none transition cursor-pointer"
                >
                  Exporter les données d'ingénierie
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
