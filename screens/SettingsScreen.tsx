import React from 'react';
import { ArrowLeft, Trash2, Save, Database, Download, Info, HardDrive, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { SaveSlotId, listSlots, readSlot } from '../save';

interface Props {
   onBack: () => void;
   onSaveToSlot: (slot: SaveSlotId) => void;
   onLoadFromSlot: (slot: SaveSlotId) => void;
   onClearSlot: (slot: SaveSlotId) => void;
   onExport: () => void;
   onImportFile: (file: File) => Promise<void>;
   onReset: () => void;
   onFixData: () => void;
   activeSlot: SaveSlotId;
   lastLocalSaveAt: string | null;
}

export default function SettingsScreen({ onBack, onSaveToSlot, onLoadFromSlot, onClearSlot, onExport, onImportFile, onReset, onFixData, activeSlot, lastLocalSaveAt }: Props) {
   const handleReset = () => {
      if (window.confirm("Tem certeza? Todo o seu progresso local será perdido permanentemente.")) {
         onReset();
      }
   };

   const slotInfo = listSlots();
   const getSlotMeta = (slot: SaveSlotId) => {
      const s = readSlot(slot);
      if (!s) return null;
      return { round: s.currentRound, season: s.season, savedAt: s.savedAt };
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white">
         <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center justify-between p-4 h-16">
               <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
                  <ArrowLeft className="text-white" size={20} />
               </button>
               <h1 className="text-lg font-bold">Ajustes</h1>
               <div className="w-10"></div>
            </div>
         </header>

         <main className="p-4 space-y-6 overflow-y-auto pb-safe no-scrollbar">

            <section className="space-y-3">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Lançamento Web</h2>
               <div className="bg-surface rounded-xl border border-white/5 overflow-hidden p-4">
                  <div className="flex items-start gap-3">
                     <Database size={20} className="text-secondary shrink-0 mt-0.5" />
                     <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold text-white">Save local é o fluxo oficial desta versão</h3>
                        <p className="text-[12px] text-white/68 leading-6">
                           O jogo web usa slots salvos no navegador, com exportação e importação manual para backup. Sincronização por conta não fica exposta enquanto o fluxo completo não estiver pronto.
                        </p>
                        <div className="flex items-start gap-2 rounded-lg border border-white/8 bg-background/50 p-3">
                           <Info size={14} className="text-secondary shrink-0 mt-0.5" />
                           <p className="text-[12px] text-white/68 leading-5">
                              {lastLocalSaveAt ? `Autosave mais recente: ${new Date(lastLocalSaveAt).toLocaleString()} no Slot ${activeSlot}.` : `Slot ativo atual: ${activeSlot}.`}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <section className="space-y-3">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Dados Locais</h2>
               <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                  <button
                     onClick={() => onSaveToSlot(activeSlot)}
                     className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors active:bg-white/10"
                  >
                     <div className="flex items-center gap-3">
                        <Save size={20} className="text-emerald-500" />
                        <div className="flex flex-col items-start">
                           <span className="text-sm font-bold text-emerald-500">Forçar Save Manual</span>
                           <span className="text-[12px] text-white/68">Salva no Slot {activeSlot} do navegador</span>
                        </div>
                     </div>
                  </button>

                     <div className="flex items-start gap-3 p-4 bg-background/50">
                     <Database size={20} className="text-secondary shrink-0 mt-0.5" />
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-white mb-1">Fluxo principal sem login</span>
                        <p className="text-[12px] text-white/68 leading-6">
                           Seus dados são salvos localmente. Os slots abaixo são a forma principal de continuar jogando. A nuvem é complementar.
                        </p>
                        <p className="mt-2 text-[12px] text-white/60 leading-6">
                           {lastLocalSaveAt ? `Autosave mais recente: ${new Date(lastLocalSaveAt).toLocaleString()} no Slot ${activeSlot}.` : `Slot ativo atual: ${activeSlot}.`}
                        </p>
                     </div>
                  </div>
               </div>
            </section>

            <section className="space-y-3">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Slots de Save</h2>

               <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((slot) => {
                     const meta = getSlotMeta(slot as SaveSlotId);
                     return (
                        <div key={slot} className="bg-surface rounded-xl border border-white/5 p-4 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                 <HardDrive size={18} className="text-secondary" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black">Slot {slot}{activeSlot === slot ? ' • Ativo' : ''}</span>
                                 {meta ? (
                                    <span className="text-[12px] text-white/68 font-bold">Temp. {meta.season} • Rodada {meta.round} • {new Date(meta.savedAt).toLocaleString()}</span>
                                 ) : (
                                    <span className="text-[12px] text-white/45 font-bold">Vazio</span>
                                 )}
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => onSaveToSlot(slot as SaveSlotId)}
                                 className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black tracking-[0.12em] hover:bg-emerald-500/20 active:scale-95 transition-all"
                              >
                                 SALVAR
                              </button>
                              <button
                                 onClick={() => meta ? onLoadFromSlot(slot as SaveSlotId) : toast.error('Slot vazio.')}
                                 className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-black tracking-[0.12em] hover:bg-white/10 active:scale-95 transition-all"
                              >
                                 CARREGAR
                              </button>
                              <button
                                 onClick={() => meta ? onClearSlot(slot as SaveSlotId) : undefined}
                                 className={clsx(
                                    "px-3 py-2 rounded-lg border text-[11px] font-black tracking-[0.12em] active:scale-95 transition-all",
                                    meta ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20" : "bg-white/5 border-white/10 text-secondary opacity-40 cursor-not-allowed"
                                 )}
                              >
                                 APAGAR
                              </button>
                           </div>
                        </div>
                     );
                  })}
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <button
                     onClick={onExport}
                     className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 active:scale-95 transition-all"
                  >
                     <Download size={14} className="text-secondary" />
                     EXPORTAR
                  </button>
                  <label className="flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary hover:bg-primary/20 active:scale-95 transition-all cursor-pointer">
                     <Upload size={14} />
                     IMPORTAR
                     <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={async (e) => {
                           const f = e.target.files?.[0];
                           if (!f) return;
                           await onImportFile(f);
                           e.target.value = '';
                        }}
                     />
                  </label>
               </div>
            </section>

            <section className="space-y-3">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Zona de Perigo</h2>
               <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-between p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 active:scale-[0.98] transition-all shadow-lg"
               >
                  <div className="flex items-center gap-3">
                     <Trash2 size={20} className="text-rose-500" />
                     <span className="text-sm font-bold text-rose-500 uppercase">Reiniciar Toda a Carreira</span>
                  </div>
               </button>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/5">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Manutenção</h2>
               <button
                  onClick={onFixData}
                  className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 text-xs font-bold text-blue-400 uppercase"
               >
                  Corrigir Dados Ausentes (Jogadores Livres)
               </button>
            </section>
         </main>
      </div>
   );
}
