import { useState } from 'react';
import {
  Globe,
  Award,
  ShieldCheck,
  Hammer,
  TrendingDown,
  DollarSign,
  Compass,
  CheckCircle,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';
import { SectionType } from '../types';

interface OtherSectionsProps {
  section: SectionType;
}

export default function OtherSections({ section }: OtherSectionsProps) {
  // Geology interactive stats
  const [selectedStratum, setSelectedStratum] = useState<string>('quartz');

  // Finances inputs
  const [dailyOreTons, setDailyOreTons] = useState<number>(1500);
  const [goldGradeGramsPerTon, setGoldGradeGramsPerTon] = useState<number>(4.8);

  // Financial Outputs
  const goldPricePerGramUsd = 75; // static estimate
  const dynamicDailyRevenueUsd = Math.round(dailyOreTons * goldGradeGramsPerTon * goldPricePerGramUsd);
  const dynamicYearlyRevenueUsd = Math.round(dynamicDailyRevenueUsd * 320); // 320 active days

  switch (section) {
    case 'geology':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 2.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Géologie Structurale & Gisement d'Ouansimi
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Exploration stratigraphique de la faille aurifère secondaire. La gîtologie présente un quartz filonien hydrothermal 
              intrusif dans des formations volcanoclastiques du Précambrien.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Strata interactive diagram */}
            <div className="bg-neutral-950 border border-white/10 p-5 flex flex-col justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white font-sans mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-white" />
                Colonne Stratigraphique
              </h3>

              <div className="space-y-4 flex-1 flex flex-col justify-around">
                {/* Stratum 1 */}
                <button
                  onClick={() => setSelectedStratum('couverture')}
                  className={`w-full p-4 text-left border rounded-none transition cursor-pointer outline-none ${
                    selectedStratum === 'couverture'
                      ? 'bg-white border-black font-extrabold text-black shadow-none'
                      : 'bg-neutral-900 border-white/5 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wide">
                    <span>Siltites & Grès de Couverture (0m à -100m)</span>
                    <span className={`text-[10px] ${selectedStratum === 'couverture' ? 'text-neutral-600' : 'text-neutral-500'}`}>Tectonisé</span>
                  </div>
                </button>

                {/* Stratum 2 */}
                <button
                  onClick={() => setSelectedStratum('quartz')}
                  className={`w-full p-4 text-left border rounded-none transition cursor-pointer outline-none ${
                    selectedStratum === 'quartz'
                      ? 'bg-white border-black font-extrabold text-black shadow-none'
                      : 'bg-neutral-900 border-white/5 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wide">
                    <span>Filon Silicifié à Quartz Aurifère (-100m à -500m)</span>
                    <span className={`text-[10px] font-bold ${selectedStratum === 'quartz' ? 'text-black font-black' : 'text-neutral-400'}`}>Haute Teneur</span>
                  </div>
                </button>

                {/* Stratum 3 */}
                <button
                  onClick={() => setSelectedStratum('chlorite')}
                  className={`w-full p-4 text-left border rounded-none transition cursor-pointer outline-none ${
                    selectedStratum === 'chlorite'
                      ? 'bg-white border-black font-extrabold text-black shadow-none'
                      : 'bg-neutral-900 border-white/5 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wide">
                    <span>Scoltite de Bordure Altérée (&lt; -500m)</span>
                    <span className={`text-[10px] ${selectedStratum === 'chlorite' ? 'text-neutral-600' : 'text-neutral-500'}`}>Altéré</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Geological analysis data paper */}
            <div className="border border-white/10 p-6 bg-neutral-950 flex flex-col justify-between">
              <div>
                <span className="text-[8px] uppercase tracking-[0.15em] font-mono text-neutral-500 font-bold block mb-1">
                  CARACTÉRISTIQUES DE LA COUCHE
                </span>
                <h4 className="font-sans font-extrabold text-white text-[14px] uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  {selectedStratum === 'couverture'
                    ? 'Formation de Terrains calcaires Supérieurs'
                    : selectedStratum === 'quartz'
                    ? 'Veine Hydrothermale Centrale Silicifiée'
                    : 'Axe Métasomatique Profond'}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed text-justify">
                  {selectedStratum === 'couverture'
                    ? 'Cette zone de couverture argilo-greseuse présente une faible minéralisation d\'or (inférieure à 0.4 g/t). Elle nécessite des raccordements bétonnés pour éviter les infiltrations d\'eaux météoriques de surface.'
                    : selectedStratum === 'quartz'
                    ? 'Le gisement loge l\'ensemble des réserves exploitées. Teneur moyenne exceptionnelle de 4.8 grammes d\'or par tonne de quartz. Présence conjointe de sulfures secondaires (pyrite, chalcopyrite) compliquant la lixiviation.'
                    : 'À cette profondeur, la roche carbonatisée est fortement comprimée par les charges horizontales. La teneur en or s\'effondre, mais le gisement reste ouvert en profondeur au-delà de 600m.'}
                </p>
              </div>

              <div className="mt-6 bg-neutral-900 border border-white/5 p-4 text-xs font-mono space-y-1.5">
                <span className="font-bold text-white uppercase block mb-1.5 tracking-wider text-[9px]">PROPRIÉTÉS MINIÈRES</span>
                <p>Résistance en Compression: <span className="font-bold text-white">{selectedStratum === 'quartz' ? '145 MPa' : '85 MPa'}</span></p>
                <p>Densité Massique: <span className="font-bold text-white">{selectedStratum === 'quartz' ? '2.75 t/m³' : '2.40 t/m³'}</span></p>
                <p>Porosité: <span className="font-bold text-white">&lt; 1.5%</span></p>
              </div>
            </div>
          </div>
        </section>
      );

    case 'extraction_method':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 3.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Comparatif des Méthodes de Remontée Minière
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Justification théorique du choix technologique du Skip par rapport à la Cage d'extraction conventionnelle pour le quartz aurifère de forte dureté.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-950 border border-white/10 p-6 space-y-4 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 px-3 bg-neutral-900 text-white border border-white/10 text-[8px] font-bold font-mono tracking-widest">A</span>
                <h4 className="font-sans font-extrabold uppercase text-xs tracking-wider text-white">Dispositif à Skip (Retenu)</h4>
              </div>
              <p className="text-xs text-justify text-neutral-350 leading-relaxed font-sans">
                Le skip est un réceptacle métallique à basculement automatique conçu uniquement pour le transport vertical continu de minerais en vrac. Chargé depuis une trémie doseuse robotisée au fond du puits et dépoté en surface sans intervention humaine directe de déchargement.
              </p>
              <div className="bg-neutral-900 border border-white/5 p-4 text-xs font-mono">
                <p>Chargement/Déchargement: <span className="text-white font-bold">Automatique (In situ)</span></p>
                <p className="mt-1.5">Temps mort d'inter-cycle: <span className="text-white font-bold font-mono">8 secondes</span></p>
                <p className="mt-1.5">Rendement de production: <span className="text-white font-black">Très Élevé (+40%)</span></p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-6 space-y-4 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 px-3 bg-neutral-900 text-white border border-white/10 text-[8px] font-bold font-mono tracking-widest">B</span>
                <h4 className="font-sans font-extrabold uppercase text-xs tracking-wider text-neutral-400">Dispositif à Cage d'Extraction</h4>
              </div>
              <p className="text-xs text-justify text-neutral-350 leading-relaxed font-sans">
                La cage d'extraction fonctionne comme un ascenseur multi-ponts permettant d'y faire entrer des berlines sur rails, du gros matériel mobile (jumbos face) ou des équipes de mineurs d'arrière-taille. Elle implique des manœuvres et un arrimage au sol régulier.
              </p>
              <div className="bg-neutral-900 border border-white/5 p-4 text-xs font-mono">
                <p>Chargement/Déchargement: <span className="text-neutral-500 font-bold">Manuel (Berlines / Rails)</span></p>
                <p className="mt-1.5">Temps mort d'inter-cycle: <span className="text-neutral-500 font-bold">140 secondes</span></p>
                <p className="mt-1.5">Polyvalence matériels: <span className="text-white font-bold">Excellente</span></p>
              </div>
            </div>
          </div>
        </section>
      );

    case 'safety':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 7.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Protocoles de Sécurité & Surveillance Actifs
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Gestion automatisée de la protection mécanique anti-surcourse et prévention sismique continue du pôle de déchargement.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-white/10 bg-neutral-950 space-y-3 rounded-none">
              <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
              <h4 className="text-xs font-black uppercase text-white font-sans tracking-wider">Anti-Glissement Câble</h4>
              <p className="text-xs text-neutral-400 leading-relaxed text-justify">
                Un détecteur laser de synchronisation des vitesses cabine / tambour assure l'absence de patinage du câble acier sur la gorge de poulie d'enroulement à l'arrêt.
              </p>
            </div>

            <div className="p-5 border border-white/10 bg-neutral-950 space-y-3 rounded-none">
              <TriangleAlert className="w-5 h-5 text-white" />
              <h4 className="text-xs font-black uppercase text-white font-sans tracking-wider">Verrouillage d'Excitation</h4>
              <p className="text-xs text-neutral-400 leading-relaxed text-justify">
                En cas de baisse inopinée du courant d'excitation inducteur du Moteur CC, l'automate coupe instantanément l'induit et plaque les freins hydrauliques de sécurité.
              </p>
            </div>

            <div className="p-5 border border-white/10 bg-neutral-950 space-y-3 rounded-none">
              <Compass className="w-5 h-5 text-white" />
              <h4 className="text-xs font-black uppercase text-white font-sans tracking-wider">Capteurs Anti-Vibration</h4>
              <p className="text-xs text-neutral-400 leading-relaxed text-justify">
                Des transducteurs accélérométriques montés sur les paliers plats du réducteur surveillent l'apparition de micro-fêlures d'engrenages.
              </p>
            </div>
          </div>
        </section>
      );

    case 'environmental':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 8.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Charte & Impact Environnemental au Souss-Massa
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Stratégie de traitement des rejets acides et réutilisation circulaire de l'eau d'exhaure pompée à -450m.
            </p>
          </header>

          <div className="bg-neutral-950 border border-white/10 p-6 flex items-start gap-4 rounded-none">
            <CheckCircle className="w-6 h-6 text-white mt-1 shrink-0" />
            <div className="space-y-2">
              <h4 className="font-sans font-extrabold text-white text-xs uppercase tracking-wider">L'Exhaure Circulaire (100% Recyclé)</h4>
              <p className="text-xs text-neutral-350 leading-relaxed">
                Les eaux de percolation collectées par la station de pompage à -450m subissent une neutralisation chimique du pH dans la sous-station de surface. Elles sont intégralement réinjectées dans les broyeurs humides et le circuit d'arrosage de la piste pricipale, évitant le captage de nappes locales.
              </p>
            </div>
          </div>
        </section>
      );

    case 'finances':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 9.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Modélisation Économique et Life of Mine (LOM)
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Évaluez la rentabilité brute théorique de la concession d'Ouansimi en manipulant les curseurs de production.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Input params */}
            <div className="bg-neutral-950 border border-white/10 p-6 space-y-6 rounded-none">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white font-sans mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-white" />
                Paramètres Financiers de Production
              </h3>

              {/* Ore tons per day */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block pb-1">
                  Production du quartz tout-venant (tonnes/jour)
                </label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={dailyOreTons}
                  onChange={(e) => setDailyOreTons(parseInt(e.target.value))}
                  className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                  <span>500t / jour</span>
                  <span className="text-white font-extrabold">{dailyOreTons} t / jour</span>
                </div>
              </div>

              {/* Gold grams per ore ton */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block pb-1">
                  Teneur en Or fin moyenne (g / t)
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.1"
                  value={goldGradeGramsPerTon}
                  onChange={(e) => setGoldGradeGramsPerTon(parseFloat(e.target.value))}
                  className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                  <span>1.0 g/t (Faible)</span>
                  <span className="text-white font-extrabold">{goldGradeGramsPerTon} g / t</span>
                </div>
              </div>
            </div>

            {/* Simulated financial dashboard results */}
            <div className="border border-white/10 rounded-none p-6 flex flex-col justify-between bg-neutral-950">
              <div>
                <span className="text-[8px] font-bold uppercase text-neutral-500 font-mono tracking-widest block mb-1">
                  PROFIL FINANCIER SIMULÉ
                </span>
                <h4 className="font-sans font-extrabold text-white text-[14px] uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  Chiffre d'Affaire Brut Théorique (Sur gisements filoniens)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-3.5 bg-neutral-900 border border-white/5 text-center">
                    <span className="text-[8px] uppercase font-mono font-bold text-neutral-500 block">Rendement Quotidien</span>
                    <span className="font-mono text-white text-md font-black block mt-1.5 tracking-wider">
                      ${dynamicDailyRevenueUsd.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="p-3.5 bg-neutral-900 border border-white/5 text-center">
                    <span className="text-[8px] uppercase font-mono font-bold text-neutral-500 block">Rendement Annuel Brut</span>
                    <span className="font-mono text-white text-md font-black block mt-1.5 tracking-wider">
                      ${dynamicYearlyRevenueUsd.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-neutral-500 text-justify mt-4 leading-relaxed pr-1 italic font-sans border-t border-white/5 pt-4">
                * Note de stage: Chiffres simulés sur la base d'un cours pivot spot de $75 / gramme fin de métal jaune. Hors redevances d'état (royalties), coûts opérationnels complexes de traitement par cyanuration sous-terraine (AISC).
              </p>
            </div>
          </div>
        </section>
      );

    case 'conclusion':
      return (
        <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8 text-white">
          <header className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
              Section 10.0 — Rapport d'Analyse
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white font-sans tracking-wider">
              Conclusions Morales & Rapport de Fin de Stage
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-3xl leading-relaxed">
              Bilan d'activité du projet de conception et d'intégration du contrôle d'induit de skip.
            </p>
          </header>

          <div className="space-y-6 text-xs text-neutral-300 leading-relaxed text-left text-justify">
            <p>
              Ce travail d'exploration académique mené au sein des équipes du département électromécanique d'Ouansimi m'a permis d'assimiler les contraintes extrêmes liées aux réseaux d'alimentation haute puissance des puits d'extraction verticaux.
            </p>
            <p className="bg-neutral-950 border border-white/10 p-5 rounded-none font-sans text-neutral-350 italic">
              "L'intégration d'une boucle fermée d'analyse d'induit sur le variateur de vitesse DCREG4 apporte un niveau de surveillance prédictive permettant d'anticiper les dérives thermiques d'excitation induit. Ce mémoire technique fait office de guide pratique d'instrumentation pour les futures promotions d'élèves ingénieurs."
            </p>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span>Modélisation cinématique validée par l'encadrant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span>Note d'évaluation globale du rapport de stage : Excellent</span>
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
