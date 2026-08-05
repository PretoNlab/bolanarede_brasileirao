import React from 'react';
import { ArrowUpRight, Banknote, CalendarDays, Search, ShieldCheck, Users } from 'lucide-react';

const standings = [
  { position: 1, team: 'Bahia', logo: '/logos/landing/bahia.png', points: 24, active: true },
  { position: 2, team: 'Palmeiras', logo: '/logos/landing/palmeiras.png', points: 22 },
  { position: 3, team: 'Flamengo', logo: '/logos/landing/flamengo.png', points: 21 },
  { position: 4, team: 'Botafogo', logo: '/logos/landing/botafogo.png', points: 20 },
];

const squad = [
  { name: 'Everton Ribeiro', position: 'MEI', rating: 79 },
  { name: 'Cauly', position: 'MEI', rating: 77 },
  { name: 'Jean Lucas', position: 'MC', rating: 76 },
];

function TeamLogo({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  return <img src={src} alt={name} className={`${dimensions} shrink-0 object-contain`} decoding="async" />;
}

export function HeroShowcase() {
  return (
    <div
      aria-label="Prévia do painel do Bola na Rede Manager"
      className="landing-console mx-auto w-full max-w-[1080px] overflow-hidden border border-white/15 bg-[#111512] shadow-[0_34px_90px_rgba(0,0,0,0.45)]"
    >
      <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[#181d19] px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="" className="h-6 w-6" />
          <span className="text-[11px] font-extrabold text-white">Bola na Rede</span>
          <span className="hidden text-[10px] font-semibold text-white/40 sm:inline">Carreira 2026</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#8ee9bb]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3ee58f]" />
          SAVE LOCAL
        </div>
      </div>

      <div className="grid min-h-[370px] grid-cols-1 md:grid-cols-[150px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#0c0f0d] p-4 md:block">
          <div className="mb-6 flex items-center gap-3">
            <TeamLogo src="/logos/landing/bahia.png" name="Bahia" />
            <div>
              <div className="text-[11px] font-extrabold text-white">Bahia</div>
              <div className="mt-0.5 text-[9px] font-semibold text-white/40">Temporada 2026</div>
            </div>
          </div>
          {['Visão geral', 'Elenco', 'Táticas', 'Mercado', 'Competições'].map((item, index) => (
            <div
              key={item}
              className={`mb-1 flex h-9 items-center px-3 text-[10px] font-bold ${
                index === 0 ? 'bg-[#1f6d48] text-white' : 'text-white/44'
              }`}
            >
              {item}
            </div>
          ))}
        </aside>

        <div className="bg-[#eef1eb] p-3 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-[9px] font-extrabold uppercase text-[#657067]">Rodada 11 · Série A</div>
              <div className="mt-1 text-lg font-black text-[#121713]">Central do treinador</div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-[9px] font-bold text-[#657067]">Próximo jogo</div>
              <div className="mt-1 text-[11px] font-black text-[#121713]">Hoje · 20:30</div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border border-[#d6dbd4] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase text-[#657067]">Próxima partida</span>
                <span className="bg-[#e5f4eb] px-2 py-1 text-[9px] font-black text-[#14603d]">CASA</span>
              </div>
              <div className="mt-5 flex items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <TeamLogo src="/logos/landing/bahia.png" name="Bahia" size="lg" />
                  <div className="mt-2 text-[11px] font-black text-[#151a16]">Bahia</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-[#657067]">BRASILEIRÃO</div>
                  <div className="my-1 text-xl font-black text-[#151a16]">VS</div>
                  <div className="text-[9px] font-bold text-[#657067]">Fonte Nova</div>
                </div>
                <div className="text-center">
                  <TeamLogo src="/logos/landing/santos.png" name="Santos" size="lg" />
                  <div className="mt-2 text-[11px] font-black text-[#151a16]">Santos</div>
                </div>
              </div>
              <div className="mt-5 flex h-10 w-full items-center justify-center gap-2 bg-[#e32935] text-[10px] font-black uppercase text-white">
                Preparar partida <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="border border-[#d6dbd4] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase text-[#657067]">Classificação</span>
                <span className="text-[9px] font-bold text-[#14603d]">Ver tabela</span>
              </div>
              {standings.map((row) => (
                <div
                  key={row.team}
                  className={`grid h-10 grid-cols-[20px_28px_1fr_auto] items-center gap-2 border-t border-[#edf0ec] text-[10px] ${
                    row.active ? 'font-black text-[#14603d]' : 'font-bold text-[#252c27]'
                  }`}
                >
                  <span>{row.position}</span>
                  <TeamLogo src={row.logo} name={row.team} size="sm" />
                  <span>{row.team}</span>
                  <span>{row.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ['Moral', '88%', '#14603d'],
              ['Caixa', 'R$ 1,2 mi', '#2350a3'],
              ['Confiança', 'Alta', '#b91c2b'],
            ].map(([label, value, color]) => (
              <div key={label} className="border border-[#d6dbd4] bg-white px-3 py-2.5">
                <div className="text-[8px] font-bold text-[#737c74]">{label}</div>
                <div className="mt-1 text-[11px] font-black" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const previewPanels = [
  {
    icon: Users,
    label: 'Elenco',
    title: 'Decida quem joga',
    description: 'Posição, idade, valor e atributos aparecem sem esconder a informação importante.',
    content: (
      <div className="mt-5 border border-[#dce1dc] bg-white">
        {squad.map((player) => (
          <div key={player.name} className="grid h-12 grid-cols-[36px_1fr_auto] items-center border-b border-[#edf0ed] px-3 last:border-0">
            <span className="text-[9px] font-black text-[#1f6d48]">{player.position}</span>
            <span className="text-[11px] font-extrabold text-[#171c18]">{player.name}</span>
            <span className="text-[11px] font-black text-[#171c18]">{player.rating}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Search,
    label: 'Mercado',
    title: 'Reforce com critério',
    description: 'Filtre o mercado e compare opções antes de comprometer o orçamento da temporada.',
    content: (
      <div className="mt-5 border border-[#dce1dc] bg-white p-3">
        <div className="flex h-10 items-center gap-2 border border-[#dce1dc] px-3 text-[10px] font-semibold text-[#747d75]">
          <Search className="h-3.5 w-3.5" /> Buscar jogador ou posição
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#edf0ed] pt-3">
          <div>
            <div className="text-[11px] font-black text-[#171c18]">Atacante · 24 anos</div>
            <div className="mt-1 text-[9px] font-bold text-[#747d75]">Valor estimado</div>
          </div>
          <div className="text-[12px] font-black text-[#1f6d48]">R$ 4,8 mi</div>
        </div>
      </div>
    ),
  },
  {
    icon: Banknote,
    label: 'Clube',
    title: 'Sustente o projeto',
    description: 'Folha, bilheteria e estrutura influenciam até onde a ambição pode chegar.',
    content: (
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="border border-[#dce1dc] bg-white p-3">
          <div className="text-[9px] font-bold text-[#747d75]">Saldo</div>
          <div className="mt-2 text-[13px] font-black text-[#1f6d48]">R$ 12,4 mi</div>
        </div>
        <div className="border border-[#dce1dc] bg-white p-3">
          <div className="text-[9px] font-bold text-[#747d75]">Folha</div>
          <div className="mt-2 text-[13px] font-black text-[#b91c2b]">R$ 3,1 mi</div>
        </div>
      </div>
    ),
  },
];

export function TriplePhoneShowcase() {
  return (
    <div className="grid gap-px overflow-hidden border border-[#d3d9d3] bg-[#d3d9d3] lg:grid-cols-3">
      {previewPanels.map((panel) => {
        const Icon = panel.icon;
        return (
          <article key={panel.title} className="bg-[#f4f6f2] p-6 sm:p-7">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1f6d48]">
              <Icon className="h-4 w-4" /> {panel.label}
            </div>
            <h3 className="mt-4 text-xl font-black text-[#121713]">{panel.title}</h3>
            <p className="mt-2 min-h-[48px] text-[13px] font-medium leading-6 text-[#5f6961]">{panel.description}</p>
            {panel.content}
          </article>
        );
      })}
    </div>
  );
}

export function SecondaryShowcase() {
  return <TriplePhoneShowcase />;
}

export function ProductFacts() {
  const facts = [
    { icon: CalendarDays, text: 'Calendário nacional e continental' },
    { icon: ShieldCheck, text: 'Save local no navegador' },
    { icon: Users, text: 'Elencos de julho' },
  ];

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {facts.map(({ icon: Icon, text }) => (
        <span key={text} className="flex items-center gap-2 text-[11px] font-bold text-white/58">
          <Icon className="h-3.5 w-3.5 text-[#3ee58f]" /> {text}
        </span>
      ))}
    </div>
  );
}
