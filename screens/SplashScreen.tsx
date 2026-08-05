import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  History,
  Play,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';
import { HeroShowcase, ProductFacts, TriplePhoneShowcase } from './LandingShowcases';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

const clubs = [
  { name: 'Bahia', logo: '/logos/landing/bahia.png' },
  { name: 'Flamengo', logo: '/logos/landing/flamengo.png' },
  { name: 'Palmeiras', logo: '/logos/landing/palmeiras.png' },
  { name: 'Corinthians', logo: '/logos/landing/corinthians.png' },
  { name: 'São Paulo', logo: '/logos/landing/saopaulo.png' },
  { name: 'Santos', logo: '/logos/landing/santos.png' },
  { name: 'Cruzeiro', logo: '/logos/landing/cruzeiro.png' },
  { name: 'Botafogo', logo: '/logos/landing/botafogo.png' },
  { name: 'Grêmio', logo: '/logos/landing/gremio.png' },
  { name: 'Internacional', logo: '/logos/landing/internacional.png' },
  { name: 'Vasco', logo: '/logos/landing/vasco.png' },
  { name: 'Vitória', logo: '/logos/landing/vitoria.png' },
];

const journey = [
  {
    number: '01',
    title: 'Escolha o clube',
    text: 'Entre pela Série A ou B e assuma um elenco com objetivos, orçamento e pressão próprios.',
  },
  {
    number: '02',
    title: 'Monte o plano',
    text: 'Defina escalação e tática, avalie o mercado e organize o clube para a próxima rodada.',
  },
  {
    number: '03',
    title: 'Vá para o jogo',
    text: 'Chegue à primeira partida em poucos minutos e intervenha quando o cenário pedir mudança.',
  },
];

const pillars = [
  { icon: Users, title: '40 clubes', text: 'Série A e Série B para começar uma carreira.' },
  { icon: BarChart3, title: '1.039 jogadores', text: 'Posições, idades e referências de mercado.' },
  { icon: Trophy, title: 'Continente', text: 'Libertadores e Sul-Americana na trajetória.' },
  { icon: CircleDollarSign, title: 'Gestão completa', text: 'Mercado, caixa, staff e infraestrutura.' },
];

const faqs = [
  {
    question: 'Preciso criar uma conta?',
    answer: 'Não. Você pode escolher o clube e começar a carreira direto no navegador. O save fica armazenado localmente.',
  },
  {
    question: 'Quais clubes estão disponíveis?',
    answer: 'A base atual reúne 40 clubes brasileiros das Séries A e B, com elencos de julho e posições revisadas.',
  },
  {
    question: 'As notas dos jogadores são oficiais?',
    answer: 'Não. Posição, idade e referências de valor usam pesquisa de mercado; os atributos de gameplay são estimativas balanceadas para o jogo.',
  },
  {
    question: 'Existe competição continental?',
    answer: 'Sim. O desempenho no Brasileirão abre o caminho para Libertadores e Sul-Americana, com grupos e mata-mata.',
  },
];

const navItems = [
  { label: 'O jogo', target: 'produto' },
  { label: 'Clubes', target: 'clubes' },
  { label: 'Como funciona', target: 'jornada' },
  { label: 'Dúvidas', target: 'duvidas' },
];

export default function SplashScreen({ onStart, onContinue, hasSave }: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#f4f6f2] text-[#101411] no-scrollbar">
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#0b0e0c]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollTo('inicio')} className="flex items-center gap-3" title="Voltar ao início">
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            <span className="text-[15px] font-black">Bola na Rede <span className="font-semibold text-white/55">Manager</span></span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="text-[12px] font-bold text-white/58 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={hasSave ? onContinue : onStart}
            className="flex h-10 items-center justify-center gap-2 border border-white/16 bg-white px-4 text-[11px] font-black text-[#101411] transition-colors hover:bg-[#dff7e8] sm:px-5"
          >
            {hasSave ? <History className="h-4 w-4" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span className="hidden sm:inline">{hasSave ? 'Continuar carreira' : 'Jogar agora'}</span>
            <span className="sm:hidden">{hasSave ? 'Continuar' : 'Jogar'}</span>
          </button>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden bg-[#0b0e0c] text-white">
          <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-white/8" />
          <div className="pointer-events-none absolute bottom-0 left-[8%] top-0 w-px bg-white/5" />
          <div className="pointer-events-none absolute bottom-0 right-[8%] top-0 w-px bg-white/5" />

          <div className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-[1240px] flex-col px-4 pb-0 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
            <div className="mx-auto max-w-[820px] text-center">
              <div className="inline-flex items-center gap-2 border border-[#3ee58f]/35 bg-[#10251a] px-3 py-2 text-[10px] font-black uppercase text-[#76ecad]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3ee58f]" /> Série A + Série B · 40 clubes
              </div>
              <h1 className="mt-6 text-[42px] font-black leading-[1.02] sm:text-[58px] lg:text-[68px]">
                O manager do futebol brasileiro.
              </h1>
              <p className="mx-auto mt-5 max-w-[660px] text-[15px] font-medium leading-7 text-white/65 sm:text-[17px]">
                Escolha seu clube, monte o time e chegue à primeira partida em poucos minutos. Sem cadastro obrigatório.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={onStart}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-[#e32935] px-7 text-[12px] font-black text-white transition-colors hover:bg-[#c91825] sm:w-auto"
                >
                  Criar minha carreira <ArrowRight className="h-4 w-4" />
                </button>
                {hasSave && (
                  <button
                    onClick={onContinue}
                    className="flex h-12 w-full items-center justify-center gap-2 border border-white/20 px-7 text-[12px] font-black text-white transition-colors hover:bg-white/8 sm:w-auto"
                  >
                    <History className="h-4 w-4" /> Continuar save
                  </button>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <ProductFacts />
              </div>
            </div>

            <div className="relative mt-10 translate-y-px sm:mt-12">
              <HeroShowcase />
            </div>
          </div>
        </section>

        <section aria-label="Números do jogo" className="border-b border-[#d7ddd7] bg-white">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {pillars.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={`min-h-[132px] border-[#e1e5e1] px-4 py-6 sm:px-6 ${index % 2 ? '' : 'border-r'} lg:border-r lg:last:border-r-0`}
              >
                <Icon className="h-4 w-4 text-[#19734a]" />
                <div className="mt-3 text-[17px] font-black text-[#111612]">{title}</div>
                <div className="mt-1 text-[12px] font-medium leading-5 text-[#657067]">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="produto" className="scroll-mt-16 bg-[#f4f6f2] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <div className="text-[11px] font-black uppercase text-[#19734a]">Decisão por decisão</div>
                <h2 className="mt-4 max-w-[520px] text-[34px] font-black leading-[1.08] sm:text-[46px]">
                  Você decide. A temporada responde.
                </h2>
              </div>
              <p className="max-w-[620px] text-[15px] font-medium leading-7 text-[#59635b] lg:justify-self-end">
                O jogo mantém a informação essencial perto da próxima decisão: quem escalar, onde reforçar e quanto o clube pode gastar. Menos espera, mais rodadas jogadas.
              </p>
            </div>

            <div className="mt-12">
              <TriplePhoneShowcase />
            </div>
          </div>
        </section>

        <section id="clubes" className="scroll-mt-16 border-y border-[#d7ddd7] bg-white py-20 sm:py-24">
          <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.68fr_1.32fr] lg:px-8">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="text-[11px] font-black uppercase text-[#2350a3]">Série A e Série B</div>
              <h2 className="mt-4 text-[34px] font-black leading-[1.08] sm:text-[46px]">Seu clube está esperando.</h2>
              <p className="mt-5 max-w-[430px] text-[15px] font-medium leading-7 text-[#59635b]">
                Comece por um candidato ao título, um gigante sob pressão ou um projeto de acesso. São 40 caminhos para construir uma temporada diferente.
              </p>
              <button onClick={onStart} className="mt-7 flex items-center gap-2 text-[12px] font-black text-[#19734a]">
                Ver todos os clubes <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 border-l border-t border-[#e0e4e0] sm:grid-cols-4">
              {clubs.map((club) => (
                <div
                  key={club.name}
                  className="flex aspect-square min-h-[112px] flex-col items-center justify-center border-b border-r border-[#e0e4e0] bg-[#fafbf9] p-3 transition-colors hover:bg-[#eaf6ef]"
                >
                  <img src={club.logo} alt={club.name} loading="lazy" decoding="async" className="h-11 w-11 object-contain sm:h-14 sm:w-14" />
                  <span className="mt-3 text-center text-[10px] font-black text-[#303832]">{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="jornada" className="scroll-mt-16 bg-[#e32935] py-20 text-white sm:py-24">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 border-b border-white/25 pb-8 lg:flex-row lg:items-end">
              <div>
                <div className="text-[11px] font-black uppercase text-white/68">Do primeiro clique ao apito</div>
                <h2 className="mt-4 max-w-[700px] text-[34px] font-black leading-[1.08] sm:text-[46px]">Entre rápido. Aprofunde no seu ritmo.</h2>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-white/75">
                <Clock3 className="h-4 w-4" /> Sem tutorial longo ou cadastro obrigatório
              </div>
            </div>

            <div className="grid lg:grid-cols-3">
              {journey.map((step, index) => (
                <article key={step.number} className={`py-8 lg:min-h-[250px] lg:px-8 lg:py-10 ${index ? 'border-t border-white/25 lg:border-l lg:border-t-0' : ''}`}>
                  <div className="text-[12px] font-black text-white/55">{step.number}</div>
                  <h3 className="mt-8 text-[23px] font-black">{step.title}</h3>
                  <p className="mt-3 max-w-[330px] text-[14px] font-medium leading-7 text-white/72">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#12233f] py-20 text-white sm:py-24">
          <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <div className="flex h-10 w-10 items-center justify-center border border-[#77a9ff]/35 bg-[#19335e]">
                <Shield className="h-5 w-5 text-[#77a9ff]" />
              </div>
              <h2 className="mt-6 max-w-[520px] text-[34px] font-black leading-[1.08] sm:text-[46px]">Dados claros, jogo honesto.</h2>
            </div>

            <div className="border-t border-white/18">
              {[
                'Elencos de julho com posições e idades revisadas',
                'Referências de valor de mercado quando disponíveis',
                'Atributos de gameplay estimados e balanceados',
                'Carreira salva localmente no seu navegador',
              ].map((item) => (
                <div key={item} className="flex min-h-14 items-center gap-3 border-b border-white/18 py-3 text-[13px] font-bold text-white/78">
                  <Check className="h-4 w-4 shrink-0 text-[#77a9ff]" /> {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="duvidas" className="scroll-mt-16 bg-[#f4f6f2] py-20 sm:py-24">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <div className="text-[11px] font-black uppercase text-[#19734a]">Antes de começar</div>
              <h2 className="mt-4 text-[34px] font-black leading-[1.08] sm:text-[42px]">Perguntas diretas.</h2>
            </div>
            <div className="border-t border-[#cfd6cf]">
              {faqs.map((item, index) => (
                <details key={item.question} className="group border-b border-[#cfd6cf]" open={index === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[14px] font-black text-[#172019]">
                    {item.question}
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#19734a] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-[670px] pb-5 pr-8 text-[13px] font-medium leading-6 text-[#59635b]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0b0e0c] py-20 text-white sm:py-24">
          <div className="mx-auto flex w-full max-w-[980px] flex-col items-center px-4 text-center sm:px-6">
            <img src="/logo.svg" alt="" className="h-12 w-12" loading="lazy" />
            <h2 className="mt-6 text-[36px] font-black leading-[1.06] sm:text-[50px]">Seu próximo jogo começa agora.</h2>
            <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-7 text-white/60">
              Escolha um dos 40 clubes e transforme a primeira escalação no começo de uma carreira inteira.
            </p>
            <button onClick={onStart} className="mt-8 flex h-12 items-center gap-2 bg-[#e32935] px-7 text-[12px] font-black transition-colors hover:bg-[#c91825]">
              Escolher meu clube <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0b0e0c] text-white/48">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-8 text-[11px] font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-7 w-7 opacity-75" loading="lazy" /> Bola na Rede Manager
          </div>
          <div>Feito para quem acompanha futebol brasileiro rodada por rodada.</div>
        </div>
      </footer>
    </div>
  );
}
