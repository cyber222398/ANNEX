import { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Library,
} from 'lucide-react';

interface Note {
  id: string;
  timestamp: string;
  title: string;
  context: string;
}

export default function DocumentationTab() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      timestamp: '25 Mai 2026 - 11:20',
      title: "Mesure du THD sur l'induit",
      context:
        "Le taux de distorsion harmonique mesuré sur le jeu de barre 400V DC s'élève à 18.4% en phase de forte décélération du skip d'Ouansimi. Recommander l'ajout d'inductances de lissage.",
    },
    {
      id: '2',
      timestamp: '24 Mai 2026 - 09:15',
      title: "Raccordement automate Siemens",
      context:
        "Câblage des borniers d'entrées d'arrêt d'urgence couplé au disjoncteur principal. Le dictionnaire d'adresses Modbus RTU a été transmis avec succès au superviseur SCADA.",
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContext, setNewContext] = useState('');

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContext.trim()) return;

    const added: Note = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      title: newTitle,
      context: newContext,
    };

    setNotes([added, ...notes]);
    setNewTitle('');
    setNewContext('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-10 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT COLUMN: CHAPTERS REGISTER INDEX */}
        <div className="lg:col-span-4 bg-neutral-950 border border-white/10 p-6 space-y-6 rounded-none">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3 font-sans">
            <Library className="w-4 h-4 text-white" />
            Livret Technique de Stage
          </h3>

          <div className="space-y-3">
            {[
              { num: 'Chapitre 1', title: "Géologie générale d'Ouansimi", length: '4 pages' },
              { num: 'Chapitre 2', title: 'Calcul Mécanique du Cabestan', length: '12 pages' },
              { num: 'Chapitre 3', title: "Dimensionnement du Moteur d'induit", length: '8 pages' },
              { num: 'Chapitre 4', title: 'Schéma de Distribution ONEE', length: '6 pages' },
              { num: 'Chapitre 5', title: 'Architecture Ethernet & Modbus', length: '11 pages' },
            ].map((ch, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-900 border border-white/5 flex justify-between items-center hover:bg-neutral-800 transition rounded-none"
              >
                <div>
                  <span className="text-[8px] font-mono text-neutral-500 font-extrabold block uppercase tracking-wide">
                    {ch.num}
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight font-sans">{ch.title}</span>
                </div>
                <span className="text-[9px] font-bold text-neutral-400 bg-neutral-950 px-2.5 py-1 border border-white/10 font-mono">
                  {ch.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC STAGE DIARY / NOTEPAD */}
        <div className="lg:col-span-8 bg-neutral-950 border border-white/10 p-6 md:p-8 space-y-6 flex flex-col justify-between rounded-none">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h3 className="font-sans font-extrabold uppercase text-[15px] tracking-wider text-white">
                  Cahier Journalier de Bord - Stagiaire
                </h3>
              </div>
              <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase tracking-[0.15em]">
                Consignation Active
              </span>
            </div>

            {/* Note taking controls */}
            <div className="bg-neutral-900 border border-white/10 p-5 space-y-4 mb-6 rounded-none">
              <h4 className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.15em] block font-mono">
                Rédiger un nouvel incident / Rapport terrain
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Titre de la note..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-neutral-950 border border-white/10 text-white rounded-none outline-none focus:border-white transition font-mono"
                  />
                </div>
                <div className="md:col-span-6">
                  <input
                    type="text"
                    placeholder="Contenu / Observations minéralogiques..."
                    value={newContext}
                    onChange={(e) => setNewContext(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-neutral-950 border border-white/10 text-white rounded-none outline-none focus:border-white transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleAddNote}
                    className="w-full h-full py-2.5 bg-white hover:bg-neutral-200 text-black rounded-none text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-black" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Render list of saved stage logs */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {notes.length > 0 ? (
                notes.map((n) => (
                  <div key={n.id} className="p-4 border border-white/10 rounded-none bg-neutral-900 flex justify-between items-start gap-3 hover:border-white/20 transition">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-white font-bold text-xs md:text-sm font-sans block uppercase tracking-wide">{n.title}</span>
                        <span className="text-[8px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded-none border border-white/10">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-justify text-neutral-350 leading-relaxed font-sans">{n.context}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
                      title="Supprimer la note d'observation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-neutral-500 italic text-xs font-sans">
                  Aucun incident / observation consigné pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
