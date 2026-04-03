
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Save, Database, Cloud, LogIn, LogOut, Check, Download, Info, Activity, HardDrive, Upload } from 'lucide-react';
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
   onLoadCloud: () => void;
   onFixData: () => void;
   activeSlot: SaveSlotId;
   lastLocalSaveAt: string | null;
   session: any;
}

export default function SettingsScreen({ onBack, onSaveToSlot, onLoadFromSlot, onClearSlot, onExport, onImportFile, onReset, session, onLoadCloud, onFixData, activeSlot, lastLocalSaveAt }: Props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [showLogin, setShowLogin] = useState(false);
   const [dbStatus, setDbStatus] = useState<{ checked: boolean; ok: boolean; msg: string }>({ checked: false, ok: false, msg: '' });

   useEffect(() => {
      checkDB();
   }, []);

   const loadSupabaseModule = async () => import('../supabaseClient');

   const checkDB = async () => {
      const { testSupabaseConnection } = await loadSupabaseModule();
      const res = await testSupabaseConnection();
      setDbStatus({ checked: true, ok: res.success, msg: res.message });
   };

   const handleReset = () => {
      if (window.confirm("Tem certeza? Todo o seu progresso local será perdido permanentemente.")) {
         onReset();
      }
   };

   const handleLogin = async () => {
      const { isSupabaseConfigured, supabase } = await loadSupabaseModule();
      if (!isSupabaseConfigured() || !supabase) {
         toast.error("Supabase não configurado.");
         return;
      }
      if (!email || !password) {
         toast.error("Preencha e-mail e senha.");
         return;
      }
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
         toast.error("Erro no Login: " + error.message);
      } else {
         toast.success("Login realizado com sucesso!");
         setShowLogin(false);
      }
      setLoading(false);
   };

   const handleSignUp = async () => {
      const { isSupabaseConfigured, supabase } = await loadSupabaseModule();
      if (!isSupabaseConfigured() || !supabase) {
         toast.error("Supabase não configurado.");
         return;
      }
      if (!email || !password || password.length < 6) {
         toast.error("A senha deve ter pelo menos 6 caracteres.");
         return;
      }
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
         toast.error("Erro no Cadastro: " + error.message);
      } else {
         toast.success("Conta criada! VERIFIQUE SEU E-MAIL para confirmar antes de logar.");
      }
      setLoading(false);
   };

   const handleLogout = async () => {
      const { supabase } = await loadSupabaseModule();
      if (!supabase) {
         toast.error("Supabase não configurado.");
         return;
      }
      await supabase.auth.signOut();
      toast.success("Desconectado.");
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

            {/* Database Status Info */}
            <div className={clsx(
               "p-3 rounded-xl border flex items-center gap-3 transition-all",
               dbStatus.checked ? (dbStatus.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500") : "bg-surface border-white/5"
            )}>
               <Activity size={18} className={!dbStatus.checked ? "animate-pulse" : ""} />
               <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.14em]">Status do Banco de Dados</span>
                  <span className="text-[12px] font-bold opacity-85">{dbStatus.checked ? dbStatus.msg : "Verificando..."}</span>
               </div>
               {!dbStatus.ok && dbStatus.checked && (
                  <button onClick={checkDB} className="ml-auto bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg tracking-[0.12em]">RETESTAR</button>
               )}
            </div>

            {/* Cloud Sync Section */}
            <section className="space-y-3">
               <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Sincronização Opcional</h2>

               {!session ? (
                  <div className="bg-surface rounded-xl border border-white/5 overflow-hidden p-4">
                     {!showLogin ? (
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                 <Cloud size={24} className="text-blue-500" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-sm">Conta é opcional</h3>
                                 <p className="text-[12px] text-white/68 leading-5">Jogue normalmente com save local. Use conta só para sincronizar entre dispositivos.</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-2 rounded-lg border border-white/8 bg-background/50 p-3">
                              <Info size={14} className="text-secondary shrink-0 mt-0.5" />
                              <p className="text-[12px] text-white/68 leading-5">O fluxo principal do jogo funciona sem login. Seus slots locais continuam sendo a forma principal de salvar e continuar.</p>
                           </div>
                           <button
                              onClick={() => setShowLogin(true)}
                              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-sm transition-all active:scale-[0.98] border border-white/10"
                           >
                              Ativar sincronização
                           </button>
                        </div>
                     ) : (
                        <div className="flex flex-col gap-3 animate-fade-in">
                           <h3 className="font-bold text-sm mb-1">Acessar Conta</h3>
                           <input
                              type="email"
                              placeholder="Seu Email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none transition-colors"
                           />
                           <input
                              type="password"
                              placeholder="Sua Senha"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none transition-colors"
                           />

                           <div className="flex gap-2 mt-2">
                              <button
                                 onClick={handleLogin}
                                 disabled={loading}
                                 className="flex-1 py-3 bg-primary text-white font-bold rounded-lg text-xs disabled:opacity-50"
                              >
                                 {loading ? 'Entrando...' : 'Entrar'}
                              </button>
                              <button
                                 onClick={handleSignUp}
                                 disabled={loading}
                                 className="flex-1 py-3 bg-surface border border-white/10 text-white font-bold rounded-lg text-xs hover:bg-white/5"
                              >
                                 Criar Conta
                              </button>
                           </div>

                           <div className="flex items-start gap-2 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 mt-2">
                              <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                              <p className="text-[12px] text-blue-200 leading-5">Ao criar conta, enviaremos um e-mail de confirmação. Você <b>precisa</b> clicar no link antes de fazer login.</p>
                           </div>

                           <button onClick={() => setShowLogin(false)} className="text-[12px] text-white/60 text-center mt-2 underline">Voltar</button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="bg-surface rounded-xl border border-white/5 overflow-hidden p-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-emerald-500/10 rounded-lg">
                              <Check size={24} className="text-emerald-500" />
                           </div>
                           <div>
                              <h3 className="font-bold text-sm text-emerald-400">Sessão Ativa</h3>
                              <p className="text-[12px] text-white/68 truncate max-w-[170px]">{session.user.email}</p>
                           </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                           <LogOut size={16} className="text-rose-400" />
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-2">
                        <button
                           onClick={onLoadCloud}
                           className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black tracking-[0.12em] hover:bg-white/10 active:scale-95 transition-all"
                        >
                           <Download size={14} className="text-primary" />
                           BAIXAR SAVE
                        </button>
                        <button
                           onClick={() => onSaveToSlot(1)}
                           className="flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-xl text-[11px] font-black tracking-[0.12em] text-primary hover:bg-primary/20 active:scale-95 transition-all"
                        >
                           <Cloud size={14} />
                           SUBIR SAVE
                        </button>
                     </div>
                  </div>
               )}
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
