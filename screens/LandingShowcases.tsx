import React from 'react';
import { INITIAL_TEAMS } from '../data';
import { Team } from '../types';
import DashboardScreen from './DashboardScreen';
import MarketScreen from './MarketScreen';
import LeagueScreen from './LeagueScreen';
import FinanceScreen from './FinanceScreen';

const noop = () => {};

const cloneTeam = (id: string): Team => {
  const found = INITIAL_TEAMS.find((team) => team.id === id);
  if (!found) {
    throw new Error(`Missing showcase team: ${id}`);
  }
  return JSON.parse(JSON.stringify(found)) as Team;
};

const buildShowcaseTeams = () => {
  const bahia = cloneTeam('bahia');
  const santos = cloneTeam('santos');
  const palmeiras = cloneTeam('palmeiras');
  const flamengo = cloneTeam('flamengo');
  const botafogo = cloneTeam('botafogo');
  const cruzeiro = cloneTeam('cruzeiro');
  const atleticoMg = cloneTeam('atletico-mg');
  const corinthians = cloneTeam('corinthians');
  const gremio = cloneTeam('gremio');
  const freeAgent = cloneTeam('free_agent');

  bahia.points = 24;
  bahia.played = 11;
  bahia.won = 7;
  bahia.drawn = 3;
  bahia.lost = 1;
  bahia.gf = 18;
  bahia.ga = 8;
  bahia.moral = 88;
  bahia.roster[0].goals = 7;
  bahia.roster[1].goals = 5;

  palmeiras.points = 22;
  palmeiras.played = 11;
  palmeiras.won = 6;
  palmeiras.drawn = 4;
  palmeiras.lost = 1;
  palmeiras.gf = 17;
  palmeiras.ga = 9;

  flamengo.points = 21;
  flamengo.played = 11;
  flamengo.won = 6;
  flamengo.drawn = 3;
  flamengo.lost = 2;
  flamengo.gf = 16;
  flamengo.ga = 10;
  flamengo.roster[0].goals = 6;

  botafogo.points = 20;
  botafogo.played = 11;
  botafogo.won = 6;
  botafogo.drawn = 2;
  botafogo.lost = 3;
  botafogo.gf = 15;
  botafogo.ga = 11;

  cruzeiro.points = 18;
  cruzeiro.played = 11;
  cruzeiro.won = 5;
  cruzeiro.drawn = 3;
  cruzeiro.lost = 3;
  cruzeiro.gf = 13;
  cruzeiro.ga = 10;

  atleticoMg.points = 17;
  atleticoMg.played = 11;
  atleticoMg.won = 5;
  atleticoMg.drawn = 2;
  atleticoMg.lost = 4;
  atleticoMg.gf = 14;
  atleticoMg.ga = 12;

  corinthians.points = 16;
  corinthians.played = 11;
  corinthians.won = 4;
  corinthians.drawn = 4;
  corinthians.lost = 3;
  corinthians.gf = 11;
  corinthians.ga = 10;

  gremio.points = 14;
  gremio.played = 11;
  gremio.won = 4;
  gremio.drawn = 2;
  gremio.lost = 5;
  gremio.gf = 10;
  gremio.ga = 13;

  santos.points = 12;
  santos.played = 11;
  santos.won = 3;
  santos.drawn = 3;
  santos.lost = 5;
  santos.gf = 9;
  santos.ga = 14;
  santos.moral = 71;

  freeAgent.roster = freeAgent.roster.slice(0, 18);

  return [bahia, palmeiras, flamengo, botafogo, cruzeiro, atleticoMg, corinthians, gremio, santos, freeAgent];
};

const showcaseTeams = buildShowcaseTeams();
const showcaseUserTeam = showcaseTeams.find((team) => team.id === 'bahia')!;
const showcaseOpponent = showcaseTeams.find((team) => team.id === 'santos')!;

function ShowcasePhone({
  children,
  scale = 0.72,
  className = '',
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  const width = Math.round(390 * scale);
  const height = Math.round(844 * scale);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <div
        className="absolute left-1/2 top-0 overflow-hidden rounded-[48px] bg-[#0A0A0A] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.1)] border border-white/5"
        style={{
          width: 390,
          height: 844,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="absolute left-1/2 top-0 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-[#0A0A0A] border-x border-b border-white/5" />
        <div className="relative h-full overflow-hidden rounded-[38px] bg-[#050505]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function HeroShowcase() {
  return (
    <div aria-hidden="true" inert className="pointer-events-none select-none">
      <ShowcasePhone scale={0.72}>
        <DashboardScreen
          team={showcaseUserTeam}
          nextOpponent={showcaseOpponent}
          standings={showcaseTeams.filter((team) => team.division === 1)}
          round={11}
          funds={1200000}
          onboardingComplete={true}
          isWindowOpen={true}
          onCompleteOnboarding={noop}
          onOpenSquad={noop}
          onOpenMarket={noop}
          onOpenFinance={noop}
          onOpenCalendar={noop}
          onOpenLeague={noop}
          onOpenStats={noop}
          onOpenNews={noop}
          onOpenSettings={noop}
          onSimulate={noop}
          onOpenTactics={noop}
          onOpenProfile={noop}
          onOpenTraining={noop}
          onOpenStaff={noop}
          onOpenInfrastructure={noop}
          onOpenYouth={noop}
          news={[
            {
              id: 'showcase-news-1',
              round: 11,
              title: 'Clima em alta',
              body: 'A torcida está comprando a campanha.',
              category: 'MORAL',
              isRead: false,
            },
          ]}
        />
      </ShowcasePhone>
    </div>
  );
}

export function SecondaryShowcase() {
  return (
    <section className="mx-auto mt-24 max-w-6xl">
      <div className="max-w-3xl">
        <div className="text-[11px] font-black uppercase tracking-[0.24em] text-black/38">Segunda dobra</div>
        <h2 className="font-editorial mt-4 text-[2.5rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.4rem]">
          O produto aparece como ele é.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-black/48">
          A campanha principal reúne mercado, tabela, caixa e gestão em um único fluxo. A Copa do Mundo 2026 entra
          como modo paralelo para sessões mais curtas e mais intensas.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div>
          <div className="mb-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-black/40">Mercado</div>
            <div className="mt-1 text-[15px] font-medium leading-6 text-black/50">
              Explore opções, leia o valor do mercado e ataque a janela quando aparecer a peça certa.
            </div>
          </div>
          <div aria-hidden="true" inert className="pointer-events-none select-none">
            <ShowcasePhone scale={0.5}>
              <MarketScreen
                userTeam={showcaseUserTeam}
                allTeams={showcaseTeams}
                funds={1200000}
                isWindowOpen={true}
                offers={[]}
                logs={[]}
                onBack={noop}
                onBuy={noop}
                onLoanPlayer={noop}
                onSell={noop}
                onAcceptOffer={noop}
                onDeclineOffer={noop}
              />
            </ShowcasePhone>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-black/40">Liga e stats</div>
            <div className="mt-1 text-[15px] font-medium leading-6 text-black/50">
              Veja a tabela ganhar forma, acompanhe a corrida pelo topo e sinta o peso de cada rodada.
            </div>
          </div>
          <div aria-hidden="true" inert className="pointer-events-none select-none">
            <ShowcasePhone scale={0.5}>
              <LeagueScreen
                teams={showcaseTeams.filter((team) => team.division === 1)}
                userTeamId="bahia"
                onBack={noop}
              />
            </ShowcasePhone>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-black/40">Finanças</div>
            <div className="mt-1 text-[15px] font-medium leading-6 text-black/50">
              Ajuste ticket, busque fôlego no caixa e sustente a campanha sem desmontar o projeto.
            </div>
          </div>
          <div aria-hidden="true" inert className="pointer-events-none select-none">
            <ShowcasePhone scale={0.5}>
              <FinanceScreen
                team={showcaseUserTeam}
                funds={1200000}
                ticketPrice={50}
                onUpdateTicketPrice={noop}
                onBack={noop}
                onLoan={noop}
                onExpandStadium={noop}
              />
            </ShowcasePhone>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TriplePhoneShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
      <div className="flex flex-col items-center lg:items-start">
        <div className="mb-4 text-center lg:text-left">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7b6d5d]">Mercado</div>
          <div className="mt-1 max-w-[220px] text-[14px] font-semibold leading-6 text-[#5f5446]">
            Leia a janela e ataque quando a peça certa aparecer.
          </div>
        </div>
        <div aria-hidden="true" inert className="pointer-events-none select-none">
          <ShowcasePhone scale={0.54}>
            <MarketScreen
              userTeam={showcaseUserTeam}
              allTeams={showcaseTeams}
              funds={1200000}
              isWindowOpen={true}
              offers={[]}
              logs={[]}
              onBack={noop}
              onBuy={noop}
              onLoanPlayer={noop}
              onSell={noop}
              onAcceptOffer={noop}
              onDeclineOffer={noop}
            />
          </ShowcasePhone>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7b6d5d]">Liga e stats</div>
          <div className="mt-1 max-w-[220px] text-[14px] font-semibold leading-6 text-[#5f5446]">
            Veja a tabela apertar e o peso real de cada rodada.
          </div>
        </div>
        <div aria-hidden="true" inert className="pointer-events-none select-none">
          <ShowcasePhone scale={0.54}>
            <LeagueScreen teams={showcaseTeams.filter((team) => team.division === 1)} userTeamId="bahia" onBack={noop} />
          </ShowcasePhone>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-end">
        <div className="mb-4 text-center lg:text-left">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7b6d5d]">Finanças</div>
          <div className="mt-1 max-w-[220px] text-[14px] font-semibold leading-6 text-[#5f5446]">
            Busque fôlego no caixa sem desmontar o projeto.
          </div>
        </div>
        <div aria-hidden="true" inert className="pointer-events-none select-none">
          <ShowcasePhone scale={0.54}>
            <FinanceScreen
              team={showcaseUserTeam}
              funds={1200000}
              ticketPrice={50}
              onUpdateTicketPrice={noop}
              onBack={noop}
              onLoan={noop}
              onExpandStadium={noop}
            />
          </ShowcasePhone>
        </div>
      </div>
    </div>
  );
}
