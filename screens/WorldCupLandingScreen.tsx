import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Globe, Zap, Users, Play, ArrowLeft, ChevronRight, Star, Shield, HelpCircle, CheckCircle } from 'lucide-react';

interface Props {
  onPlayWorldCup: () => void;
  onBackHome: () => void;
}

const worldCupFeatures = [
  {
    icon: <Users className="h-6 w-6 text-amber-500" />,
    title: "Convocação Real",
    text: "Escale seus 26 convocados oficiais a partir das listas reais de cada uma das 48 seleções classificadas."
  },
  {
    icon: <Globe className="h-6 w-6 text-emerald-500" />,
    title: "Grupos e Chaveamento FIFA",
    text: "Simule a competição exata com os 12 grupos reais (A a L) sorteados para o Mundial de 2026."
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Decisão nos Pênaltis",
    text: "Mecânica viva de cobrança com disputa na morte súbita real e alternada que testa seus nervos."
  },
  {
    icon: <Trophy className="h-6 w-6 text-blue-500" />,
    title: "Pódio Completo e Prêmios",
    text: "Dispute a repescagem de 3º lugar, veja quem leva a Chuteira de Ouro e domine a artilharia."
  }
];

const faqs = [
  {
    q: "O jogo é atualizado com as convocações oficiais?",
    a: "Sim! Todos os elencos são gerados com base nas pré-listas e convocações reais de 2026. Seleções com elencos curtos são complementadas com atletas gerados de forma realista com base na média do país."
  },
  {
    q: "Consigo jogar sem internet/offline?",
    a: "Com certeza. O Bola na Rede Manager é 100% offline-first. Seu progresso, times e resultados são salvos localmente no seu navegador, sem necessidade de login ou conexão contínua."
  },
  {
    q: "Como funciona a escalação e a tática durante o jogo?",
    a: "Você tem controle total sobre o esquema tático (4-3-3, 3-5-2, etc.), a mentalidade do time e pode intervir na partida ao vivo, fazendo substituições estratégicas e mudando a postura tática."
  }
];

export default function WorldCupLandingScreen({ onPlayWorldCup, onBackHome }: Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => prev === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#07080a] text-white font-sans selection:bg-amber-500/30 no-scrollbar relative">
      {/* Stadium Night Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-emerald-950/20 rounded-full blur-[160px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-950/20 rounded-full blur-[140px] opacity-30" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-blue-950/15 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-6 relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-6">
          <button
            onClick={onBackHome}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            id="btn-wc-back-home"
          >
            <ArrowLeft size={16} />
            BNR Home
          </button>
          
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-editorial text-sm font-bold tracking-tight text-amber-500">World Cup Edition</span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 mb-8"
          >
            <Globe size={12} className="animate-spin-slow" />
            Copa do Mundo de 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-editorial text-[3.2rem] sm:text-[4.8rem] lg:text-[5.4rem] font-bold leading-[0.95] tracking-tight max-w-4xl text-white italic"
          >
            O MAIOR PALCO DO PLANETA.<br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent">
              SOB SEU COMANDO.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/60"
          >
            Assuma uma das 48 seleções oficiais. Faça convocações reais baseadas nas pré-listas de 2026, customize táticas e lute pela glória máxima do futebol.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md"
          >
            <button
              onClick={onPlayWorldCup}
              className="w-full sm:w-auto flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-10 text-[13px] font-black uppercase tracking-[0.15em] text-black shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
              id="btn-play-wc-hero"
            >
              <Play className="h-4 w-4 fill-current" />
              Jogar Copa do Mundo
            </button>
            <button
              onClick={onBackHome}
              className="w-full sm:w-auto flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 text-[13px] font-black uppercase tracking-[0.15em] text-white active:scale-95 transition-all"
              id="btn-play-career"
            >
              Modo Carreira
            </button>
          </motion.div>
        </main>

        {/* Feature Cards Grid */}
        <section className="py-12 border-t border-white/5">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-2">Imersão Total</span>
            <h2 className="font-editorial text-3xl font-bold italic">Recursos do Modo Mundial</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {worldCupFeatures.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.06] transition-colors relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-editorial text-lg font-bold text-white italic mb-2">{feat.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feat.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visual Showcase (Teaser details) */}
        <section className="py-16 border-t border-white/5">
          <div className="rounded-[3rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Trophy size={300} />
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] block mb-3">Tensão Sem DRM</span>
                <h2 className="font-editorial text-4xl font-bold italic mb-6 leading-none">
                  A glória da taça está apenas a sete decisões de distância.
                </h2>
                
                <ul className="space-y-4">
                  {[
                    "Escale o elenco de sua escolha buscando sinergia de atributos.",
                    "Grupos A a L divididos com cruzamento real de 16-avos de final.",
                    "Lógica refinada de cansaço acumulado e suspensões por cartões.",
                    "Simulação tática dinâmica baseada no overall individual e coletivo."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 relative shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Podium de Chaveamento</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 bg-white/5 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold">🥇 Campeão</span>
                    <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full">Brasil (BRA)</span>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold">🥈 Vice-campeão</span>
                    <span className="text-[10px] font-black uppercase bg-slate-400/20 text-slate-400 px-3 py-1 rounded-full">França (FRA)</span>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold">🥉 Terceiro Lugar</span>
                    <span className="text-[10px] font-black uppercase bg-amber-700/20 text-amber-700 px-3 py-1 rounded-full">Espanha (ESP)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t border-white/5" id="faq">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-[#6e6251] uppercase tracking-[0.3em] block mb-2">Suporte</span>
            <h2 className="font-editorial text-3xl font-bold italic">Dúvidas Frequentes</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-white/5 bg-white/[0.02] rounded-[22px] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm font-black text-white">{faq.q}</span>
                    <ChevronRight 
                      className={`h-4 w-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-90 text-amber-500' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-xs leading-relaxed text-white/50 border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 px-8 py-14 text-center shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
            
            <h2 className="font-editorial text-4xl font-bold italic leading-tight text-white mb-4">
              Pronto para colocar sua tática à prova?
            </h2>
            <p className="mx-auto max-w-xl text-xs text-white/50 mb-8">
              Nenhum download necessário, jogue de graça direto no navegador com a sua seleção preferida.
            </p>
            
            <button
              onClick={onPlayWorldCup}
              className="mx-auto flex h-14 items-center justify-center gap-3 rounded-full bg-white text-black hover:bg-amber-500 hover:text-black px-10 text-[12px] font-black uppercase tracking-[0.18em] shadow-xl active:scale-95 transition-all"
              id="btn-play-wc-footer"
            >
              Jogar Copa do Mundo 2026
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-white/5 py-8 text-center text-xs text-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-editorial text-sm font-bold tracking-tight text-white/60 italic">BNR <span className="opacity-30">Manager</span></div>
          <div>Bolanarede Manager © 2026 • World Cup Special Edition</div>
        </footer>

      </div>
    </div>
  );
}
