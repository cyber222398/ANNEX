import { useState } from 'react';
import { Sliders } from 'lucide-react';

export default function CalculationsTab() {
  // Input parameters
  const [shaftDepth, setShaftDepth] = useState<number>(365); // meters deeper
  const [payloadMass, setPayloadMass] = useState<number>(8.0); // tons
  const [maxSpeed, setMaxSpeed] = useState<number>(8.5); // m/s
  const [accelRate, setAccelRate] = useState<number>(0.8); // m/s²

  // Constants
  const gravity = 9.81;
  const skipEmptyMass = 4.0; // t
  const totalLiftMassKg = (payloadMass + skipEmptyMass) * 1000;
  const unitCableWeightKgPerMeter = 5.2; // kg/m for 32mm steel rope

  // Kinematic calculations
  const tAccel = parseFloat((maxSpeed / accelRate).toFixed(2));
  const sAccel = parseFloat((0.5 * accelRate * tAccel * tAccel).toFixed(2));
  const sDecel = sAccel;
  const tDecel = tAccel;

  const sConstant = shaftDepth - (sAccel + sDecel);
  const okCycle = sConstant > 0;

  const tConstant = okCycle ? parseFloat((sConstant / maxSpeed).toFixed(2)) : 0;
  const totalCycleTime = okCycle ? parseFloat((tAccel + tConstant + tDecel).toFixed(2)) : parseFloat((2 * Math.sqrt(shaftDepth / accelRate)).toFixed(2));

  // Dynamic tension calculations
  const staticTensionMaxNewton = Math.round((totalLiftMassKg + unitCableWeightKgPerMeter * shaftDepth) * gravity);
  const dynamicTensionMaxNewton = Math.round(totalLiftMassKg * (gravity + accelRate) + (unitCableWeightKgPerMeter * shaftDepth) * gravity);

  // SVG dimensions for velocity profile drawing
  const widthSvg = 550;
  const heightSvg = 200;
  const paddingX = 50;
  const paddingY = 40;

  // Render coordinates of velocity cycle
  const x0 = paddingX;
  const y0 = heightSvg - paddingY;

  const tTotalSim = Math.max(totalCycleTime, 1);
  const x1 = paddingX + (tAccel / tTotalSim) * (widthSvg - 2 * paddingX);
  const y1 = paddingY;

  const x2 = paddingX + ((tAccel + (okCycle ? tConstant : 0)) / tTotalSim) * (widthSvg - 2 * paddingX);
  const y2 = paddingY;

  const x3 = widthSvg - paddingX;
  const y3 = heightSvg - paddingY;

  return (
    <div className="space-y-10 text-white">
      {/* HEADER SECTION */}
      <section className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-4">
        <header className="border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-neutral-500 font-mono tracking-[0.25em] uppercase block mb-1">
            LABORATOIRE VIRTUEL
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white font-sans">
            Calculateur Cinématique & Énergétique de Cycle
          </h2>
          <p className="text-xs text-neutral-450 mt-1 max-w-2xl leading-relaxed">
            Modélisez d'un point de vue physique les courbes de vitesses de votre skip d'Ouansimi pour concevoir les 
            rampes d'accélération optimales de l'automate.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* SLIDERS COLUMN */}
          <div className="lg:col-span-4 bg-neutral-950 border border-white/10 p-5 space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white mb-2 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-white" />
              Grandeurs Physiques d'Induits
            </h3>

            {/* Depth */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block">
                Profondeur de Course (m)
              </label>
              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={shaftDepth}
                onChange={(e) => setShaftDepth(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                <span>100 m</span>
                <span className="text-white">{shaftDepth} m</span>
              </div>
            </div>

            {/* Mass */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block">
                Charge Utile Minerai (t)
              </label>
              <input
                type="range"
                min="2.0"
                max="14.0"
                step="0.5"
                value={payloadMass}
                onChange={(e) => setPayloadMass(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                <span>2.0 t</span>
                <span className="text-white">{payloadMass} tonnes</span>
              </div>
            </div>

            {/* Speed limit */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block">
                Vitesse Linéaire de Pointe (m/s)
              </label>
              <input
                type="range"
                min="4"
                max="16"
                step="0.5"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                <span>4.0 m/s</span>
                <span className="text-white">{maxSpeed} m/s</span>
              </div>
            </div>

            {/* Accel rate */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase font-mono tracking-wider text-neutral-400 block">
                Accélération Admissible (m/s²)
              </label>
              <input
                type="range"
                min="0.4"
                max="1.8"
                step="0.1"
                value={accelRate}
                onChange={(e) => setAccelRate(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-neutral-850 rounded-none appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-450 mt-1">
                <span>0.4 m/s²</span>
                <span className="text-white">{accelRate} m/s²</span>
              </div>
            </div>
          </div>

          {/* CALCULATED GRAPH AND SUMMARY COLUMN */}
          <div className="lg:col-span-8 flex flex-col justify-between border border-white/10 overflow-hidden self-stretch bg-neutral-950">
            {/* SVG Plot preview */}
            <div className="p-5 flex flex-col justify-center items-center bg-neutral-900 border-b border-white/10 relative">
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold mb-3 block">
                Courbe Tachymétrique du Cycle (Vitesse = f(Temps))
              </span>

              {okCycle ? (
                <svg className="w-full max-w-lg aspect-[5/2]" viewBox={`0 0 ${widthSvg} ${heightSvg}`}>
                  {/* Grid Lines */}
                  <line x1={paddingX} y1={y0} x2={widthSvg - paddingX} y2={y0} stroke="#333333" strokeWidth="2" />
                  <line x1={paddingX} y1={paddingY} x2={paddingX} y2={y0} stroke="#333333" strokeWidth="2" />

                  {/* Axis indicators */}
                  <text x={widthSvg - paddingX - 10} y={y0 + 15} fontSize="9" className="font-mono text-neutral-500 fill-current">t (s)</text>
                  <text x={paddingX - 35} y={paddingY + 10} fontSize="9" className="font-mono text-neutral-500 fill-current">v (m/s)</text>

                  {/* Kinetic cycle drawing curve */}
                  <path
                    d={`M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive markers with dynamic labels */}
                  <circle cx={x1} cy={y1} r="4" fill="#ffffff" />
                  <circle cx={x2} cy={y2} r="4" fill="#ffffff" />

                  {/* Point values */}
                  <text x={x1 - 10} y={y1 - 10} fontSize="9.5" className="font-mono text-white font-bold fill-current">
                    {tAccel}s ({maxSpeed}m/s)
                  </text>
                  <text x={x2 - 10} y={y2 - 10} fontSize="9.5" className="font-mono text-white font-bold fill-current">
                    {(tAccel + tConstant).toFixed(1)}s
                  </text>
                  <text x={x3 - 20} y={y3 + 15} fontSize="9.5" className="font-mono text-neutral-400 font-bold fill-current">
                    {totalCycleTime}s
                  </text>
                </svg>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-red-500 font-bold block uppercase text-xs">Alerte de course impossible</span>
                  <span className="text-[11px] text-gray-400 max-w-sm mt-1">
                    L'accélération demandée est trop faible par rapport à la vitesse maximale pour atteindre la profondeur indiquée en sécurité. Modifiez les curseurs.
                  </span>
                </div>
              )}
            </div>

            {/* Calculations metrics grid */}
            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-950 shrink-0">
              <div className="p-3.5 bg-neutral-900 border border-white/10 rounded-none">
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  Durée Accélération
                </span>
                <span className="font-mono font-extrabold text-white text-md">{tAccel} s</span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-white/10 rounded-none">
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  Longueur Suspension
                </span>
                <span className="font-mono font-extrabold text-white text-md">
                  {okCycle ? sConstant.toFixed(1) : 0} m
                </span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-white/10 rounded-none">
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  Tension Statique Câble
                </span>
                <span className="font-mono font-extrabold text-white text-md">
                  {Math.round(staticTensionMaxNewton / 1000)} kN
                </span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-white/10 rounded-none">
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  Tension Crête Accel.
                </span>
                <span className="font-mono font-extrabold text-white text-md">
                  {Math.round(dynamicTensionMaxNewton / 1000)} kN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
