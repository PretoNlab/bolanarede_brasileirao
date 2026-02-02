
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Team, Player, ScreenState, MatchResult, Fixture, MatchEvent, NewsItem, TransferOffer, TransferLog, Coach, SeasonHistory, PlayerHistoryEvent } from './types';
import { INITIAL_TEAMS, generateSchedule } from './data';
import SplashScreen from './screens/SplashScreen';
import CoachSetupScreen from './screens/CoachSetupScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';
import SquadScreen from './screens/SquadScreen';
import CoachProfileScreen from './screens/CoachProfileScreen';
import TacticsScreen from './screens/TacticsScreen';
import MatchScreen from './screens/MatchScreen';
import MarketScreen from './screens/MarketScreen';
import FinanceScreen from './screens/FinanceScreen';
import LeagueScreen from './screens/LeagueScreen';
import CalendarScreen from './screens/CalendarScreen';
import NewsScreen from './screens/NewsScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChampionScreen from './screens/ChampionScreen';
import GameOverScreen from './screens/GameOverScreen';
import PreMatchScreen from './screens/PreMatchScreen';
import OnboardingModal from './components/OnboardingModal';
import { Toaster, toast } from 'react-hot-toast';
import { SaveGame, PlayerSeasonStats, readSlot, writeSlot, deleteSlot as deleteLocalSlot, downloadJson, readFileAsJson, SaveSlotId } from './save';

const DEFAULT_TICKET_PRICE = 50;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('SPLASH');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [funds, setFunds] = useState(1200000);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gameOverReason, setGameOverReason] = useState("");
  const [season, setSeason] = useState(2026);
  const [ticketPrice, setTicketPrice] = useState(DEFAULT_TICKET_PRICE);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerSeasonStats>>({});
  const [coach, setCoach] = useState<Coach | null>(null);
  const [pastSeasons, setPastSeasons] = useState<SeasonHistory[]>([]);
  const [ddaFactor, setDdaFactor] = useState(1.0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const [activeSlot, setActiveSlot] = useState<SaveSlotId>(1);
  const [lastScreen, setLastScreen] = useState<ScreenState>('DASHBOARD');


  const userTeam = useMemo(() => teams.find(t => t.id === userTeamId), [teams, userTeamId]);
  const isWindowOpen = useMemo(() => (currentRound >= 1 && currentRound <= 5) || (currentRound >= 10 && currentRound <= 14), [currentRound]);

  const buildSave = useCallback((): SaveGame => {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      season,
      currentRound,
      funds,
      ticketPrice,
      teams,
      userTeamId,
      matchHistory,
      fixtures,
      news,
      playerStats,
      coach,
      pastSeasons,
      ddaFactor,
      hasSeenOnboarding
    };
  }, [season, currentRound, funds, ticketPrice, teams, userTeamId, matchHistory, fixtures, news, playerStats, coach, pastSeasons, ddaFactor, hasSeenOnboarding]);

  const applySave = useCallback((save: SaveGame) => {
    setSeason(save.season);
    setCurrentRound(save.currentRound);
    setFunds(save.funds);
    setTicketPrice(save.ticketPrice ?? DEFAULT_TICKET_PRICE);
    setUserTeamId(save.userTeamId);
    setMatchHistory(save.matchHistory as MatchResult[]);
    setFixtures(save.fixtures as Fixture[]);
    setNews(save.news as NewsItem[]);
    setPlayerStats(save.playerStats ?? {});
    setCoach(save.coach ?? null);
    setPastSeasons(save.pastSeasons || []);
    setDdaFactor(save.ddaFactor ?? 1.0);
    setHasSeenOnboarding(save.hasSeenOnboarding ?? false);

    // MIGRATION: Ensure Free Agents team exists for old saves
    const loadedTeams = save.teams as Team[];
    const hasFreeAgent = loadedTeams.some(t => t.id === 'free_agent');
    if (!hasFreeAgent) {
      const freeAgentTeam = INITIAL_TEAMS.find(t => t.id === 'free_agent');
      if (freeAgentTeam) {
        loadedTeams.push(freeAgentTeam);
        setTeams(loadedTeams);
      }
    } else {
      setTeams(loadedTeams);
    }

    setCurrentScreen('DASHBOARD');
    toast.success('Save carregado!', { icon: '💾' });
  }, []);

  const saveToSlot = useCallback(
    (slot: SaveSlotId) => {
      setActiveSlot(slot);
      try {
        writeSlot(slot, buildSave());
        toast.success(`Save gravado no Slot ${slot}`, { icon: '💾' });
      } catch {
        toast.error('Não foi possível salvar (cache cheio?)');
      }
    },
    [buildSave]
  );

  const loadFromSlot = useCallback(
    (slot: SaveSlotId) => {
      const s = readSlot(slot);
      if (!s) {
        toast.error(`Slot ${slot} está vazio.`);
        return;
      }
      setActiveSlot(slot);
      applySave(s);
    },
    [applySave]
  );

  const clearSlot = useCallback((slot: SaveSlotId) => {
    try {
      deleteLocalSlot(slot);
      toast.success(`Slot ${slot} apagado.`, { icon: '🗑️' });
    } catch {
      toast.error('Não foi possível apagar.');
    }
  }, []);

  const exportCurrentSave = useCallback(() => {
    const save = buildSave();
    downloadJson(`bolanarede_save_${new Date().toISOString().slice(0, 10)}.json`, save);
    toast.success('Arquivo de save gerado.', { icon: '📦' });
  }, [buildSave]);

  const importSaveFromFile = useCallback(
    async (file: File) => {
      try {
        const obj = await readFileAsJson(file);
        if (!obj || obj.version !== 1) {
          toast.error('Arquivo inválido (versão incompatível).');
          return;
        }
        applySave(obj as SaveGame);
        // grava no slot ativo para não perder
        try {
          writeSlot(activeSlot, obj as SaveGame);
        } catch { }
      } catch {
        toast.error('Não foi possível importar este arquivo.');
      }
    },
    [activeSlot, applySave]
  );

  const hasAnySave = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!readSlot(1);
  }, []);

  // Autosave leve (slot ativo)
  useEffect(() => {
    if (!userTeamId) return;
    if (currentScreen === 'SPLASH' || currentScreen === 'TEAM_SELECT') return;
    const t = window.setTimeout(() => {
      try {
        writeSlot(activeSlot, buildSave());
      } catch {
        // ignore
      }
    }, 500);
    return () => window.clearTimeout(t);
  }, [activeSlot, buildSave, currentScreen, userTeamId]);

  const nextOpponent = useMemo(() => {
    if (!userTeamId || !fixtures.length) return null;
    const fixture = fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId));
    if (!fixture) return null;
    const opponentId = fixture.homeTeamId === userTeamId ? fixture.awayTeamId : fixture.homeTeamId;
    return teams.find(t => t.id === opponentId) || null;
  }, [userTeamId, currentRound, fixtures, teams]);

  const generateRoundNews = (round: number) => {
    const newsList: NewsItem[] = [];

    const pickUserStar = () => {
      if (!userTeam) return null;
      const roster = userTeam.roster.slice().sort((a, b) => b.overall - a.overall);
      return roster[0] ?? null;
    };


    // 1) Fan Reactions (Voice of the Fans)
    if (matchHistory.length > 0 && userTeam) {
      const userMatches = matchHistory.filter(m => m.isUserMatch).slice(0, 3); // Last 3 matches
      if (userMatches.length === 3) {
        const wins = userMatches.filter(m => (m.homeTeamName === userTeam.name && m.homeScore > m.awayScore) || (m.awayTeamName === userTeam.name && m.awayScore > m.homeScore)).length;
        const losses = userMatches.filter(m => (m.homeTeamName === userTeam.name && m.homeScore < m.awayScore) || (m.awayTeamName === userTeam.name && m.awayScore < m.homeScore)).length;

        // Win Streak Praise
        if (wins === 3 && Math.random() > 0.6) {
          newsList.push({
            id: Math.random().toString(36),
            round,
            title: 'Torcida: "O Campeão Voltou!"',
            body: 'A fase é espetacular! Torcedores organizaram um mosaico 3D no estádio e alguns tatuaram seu rosto. Moral em alta.',
            category: 'MORAL',
            isRead: false,
            impactText: 'Moral +5'
          });
          setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, moral: Math.min(100, t.moral + 5) } : t));
        }
        // Loss Streak Protest
        else if (losses === 3 && Math.random() > 0.6) {
          newsList.push({
            id: Math.random().toString(36),
            round,
            title: 'Protesto: Muro Pichado',
            body: 'Torcedores picharam o muro do CT: "Acabou a paz!". Pipoca foi atirada no ônibus da delegação. O clima é tenso.',
            category: 'MORAL',
            isRead: false,
            impactText: 'Moral -10',
          });
          setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, moral: Math.max(0, t.moral - 10) } : t));
        }
      }
    }

    // 2) Patrocínios (mais variados)
    if (Math.random() > 0.75 && userTeam) {
      const sponsors = ['Bet do Zé', 'Cerveja Local', 'Construtora', 'Rede de Farmácias', 'App de Entrega'];
      const sponsor = sponsors[Math.floor(Math.random() * sponsors.length)];
      const offer = 40000 + Math.floor(Math.random() * 90000);
      newsList.push({
        id: Math.random().toString(36),
        round,
        title: `Patrocínio Relâmpago (${sponsor})`,
        body: `A diretoria recebeu uma proposta de patrocínio pontual. O acordo rende R$ ${(offer / 1000).toFixed(0)}k, mas a torcida pode reclamar do "excesso de propaganda".`,
        category: 'FINANCE',
        isRead: false,
        choices: [
          { label: `Aceitar (R$ ${(offer / 1000).toFixed(0)}k)`, impact: { funds: offer, moral: -2, newsText: "Caixa reforçado. Parte da arquibancada chiou." } },
          { label: 'Recusar', impact: { moral: 2, newsText: "Postura conservadora. A torcida valorizou a tradição." } },
        ],
      });
    }

    // 2) Críticas / Comentários pós-jogo
    if (matchHistory.length > 0 && Math.random() > 0.55 && userTeam) {
      const last = matchHistory.find(m => m.isUserMatch);
      if (last) {
        const won = (last.homeTeamName === userTeam.name && last.homeScore > last.awayScore) || (last.awayTeamName === userTeam.name && last.awayScore > last.homeScore);
        newsList.push({
          id: Math.random().toString(36),
          round,
          title: won ? 'Crítica: “Time competitivo!”' : 'Crítica: “Faltou repertório…”',
          body: won
            ? 'Colunistas elogiaram a intensidade e a leitura de jogo. A torcida quer sequência.'
            : 'A imprensa cobrou mais variações táticas e questionou a postura do time em momentos decisivos.',
          category: 'BOARD',
          isRead: false,
          impactText: won ? '+Moral leve' : '-Moral leve',
        });
        // impacto pequeno
        setTeams(prev => prev.map(t => t.id === userTeam.id ? { ...t, moral: clamp(t.moral + (won ? 1 : -1), 0, 100) } : t));
      }
    }

    // 3) Notícias sobre jogadores (forma / mercado)
    if (Math.random() > 0.55 && userTeam) {
      const star = pickUserStar();
      if (star) {
        const rumor = Math.random() > 0.5;
        newsList.push({
          id: Math.random().toString(36),
          round,
          title: rumor ? `Rumor: ${star.name} na mira` : `${star.name} em alta`,
          body: rumor
            ? `Um clube tradicional sondou o empresário de ${star.name}. A diretoria vai segurar ou ouvir propostas?`
            : `${star.name} virou assunto nas rádios: “jogador decisivo”. O vestiário sente o impacto.`,
          category: rumor ? 'MARKET' : 'MORAL',
          isRead: false,
          choices: rumor
            ? [
              { label: 'Blindar (moral +2 / caixa -20k)', impact: { funds: -20000, moral: 2, newsText: 'A diretoria fez um agrado e o elenco fechou com o projeto.' } },
              { label: 'Deixar rolar (moral -1)', impact: { moral: -1, newsText: 'Os boatos continuam e o ambiente fica mais tenso.' } },
            ]
            : undefined,
        });
      }
    }

    // 4) Transfer Sagas (AI Offers) - NEW
    if (isWindowOpen && Math.random() > 0.82 && userTeam) {
      const star = pickUserStar();
      if (star) {
        // Find wealthy AI clubs
        const wealthyClubs = teams.filter(t => t.id !== userTeamId && (t.financeStatus === 'Rico' || t.division === 1));
        const buyer = wealthyClubs[Math.floor(Math.random() * wealthyClubs.length)];
        const offerValue = Math.round((star.marketValue * (1.2 + Math.random() * 0.4)) / 1000) * 1000;

        newsList.push({
          id: Math.random().toString(36),
          round,
          title: `OFERTA OFICIAL: ${star.name}`,
          body: `O ${buyer.name} enviou uma proposta de ${formatCurrency(offerValue)} por ${star.name}. A diretoria está sob pressão: vender o craque ou manter o projeto?`,
          category: 'MARKET',
          isRead: false,
          choices: [
            {
              label: `Vender (${formatCurrency(offerValue)})`,
              impact: {
                playerId: star.id,
                sellValue: offerValue,
                moral: -8,
                newsText: `Negócio fechado. ${star.name} deixa o clube. A torcida está furiosa, mas o caixa está reforçado.`
              }
            },
            {
              label: 'Recusar Proposta',
              impact: {
                moral: 4,
                newsText: `Proposta rejeitada! "Dinheiro não compra tudo", diz a nota oficial. A torcida ovaciona a diretoria.`
              }
            },
          ],
        });
      }
    }

    // 4) Abertura/fechamento da janela (quando acontecer)
    if (round === 1 || round === 6 || round === 10 || round === 15) {
      const openNow = (round >= 1 && round <= 5) || (round >= 10 && round <= 14);
      newsList.push({
        id: Math.random().toString(36),
        round,
        title: openNow ? 'Janela aberta: telefone não para' : 'Janela fechada: foco no campo',
        body: openNow
          ? 'Empresários ligando o tempo todo. A pressão aumenta para reforçar o elenco.'
          : 'Sem negociações oficiais. Agora é ponto e treino.',
        category: 'MARKET',
        isRead: false,
      });
    }

    // 5) Copa do Mundo 2026 Flavor Text
    if (season === 2026) {
      if (round === 10) newsList.push({ id: Math.random().toString(36), round, title: 'Copa 2026: Olheiros no Estádio', body: 'A comissão técnica da Seleção enviou olheiros para observar destaques do campeonato. Todos querem uma vaga na Copa!', category: 'BOARD', isRead: false });
      if (round === 18) newsList.push({ id: Math.random().toString(36), round, title: 'Pausa para a Copa Aproxima-se', body: 'O calendário ficará apertado devido ao Mundial nos EUA. Prepare o elenco para a maratona.', category: 'BOARD', isRead: false });
    }

    // 6) Garantir pelo menos 1 notícia/rodada
    if (newsList.length === 0) {
      newsList.push({
        id: Math.random().toString(36),
        round,
        title: 'Bastidores do CT',
        body: 'Treino fechado. A comissão prepara ajustes finos para a próxima rodada.',
        category: 'HEALTH',
        isRead: false,
      });
    }

    setNews(prev => [...newsList, ...prev]);
  };

  const handleNewsChoice = (newsId: string, impact: any) => {
    if (impact.funds) setFunds(f => f + impact.funds);
    if (impact.moral && userTeamId) {
      setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, moral: Math.min(100, Math.max(0, t.moral + impact.moral)) } : t));
    }

    // Transfer Saga: Sell Player
    if (impact.sellValue && impact.playerId && userTeamId) {
      const player = userTeam?.roster.find(p => p.id === impact.playerId);
      if (player) {
        setTeams(prev => prev.map(t => {
          if (t.id === userTeamId) {
            return { ...t, roster: t.roster.filter(p => p.id !== impact.playerId) };
          }
          return t;
        }));
        setFunds(f => f + impact.sellValue);
        toast.success(`${player.name} vendido!`, { icon: '💰' });
      }
    }

    setNews(prev => prev.map(n => n.id === newsId ? { ...n, isRead: true, choices: undefined, body: impact.newsText || n.body } : n));
    toast.success("Decisão tomada!");
  };

  const handleMatchFinished = (userGoals: number, opponentGoals: number, events: MatchEvent[]) => {
    const roundResults: MatchResult[] = [];
    let roundRevenue = 0;



    // Preparar estruturas para atualização em lote
    const updatedPlayerStats = { ...playerStats };
    const matchGoals: Record<string, number> = {}; // playerId -> goals
    const matchAssists: Record<string, number> = {}; // playerId -> assists
    const matchYellows: Record<string, number> = {};
    const matchReds: Record<string, number> = {};
    const matchInjuries: Record<string, { type: 'LEVE' | 'MEDIA' | 'GRAVE', duration: number, name: string }> = {};

    const helperUpdateStats = (team: Team, home: boolean, score: number, isUserMatch: boolean) => {
      // Se for jogo do usuário, processamos os eventos reais
      if (isUserMatch && userTeamId && team.id === userTeamId) {
        const userEvents = events.filter(e => e.teamId === userTeamId);
        userEvents.forEach(e => {
          if (e.type === 'goal') {
            const scorer = team.roster.find(p => p.name === e.playerName);
            if (scorer) matchGoals[scorer.id] = (matchGoals[scorer.id] || 0) + 1;

            const assister = team.roster.find(p => p.name === e.assistName);
            if (assister) matchAssists[assister.id] = (matchAssists[assister.id] || 0) + 1;
          } else if (e.type === 'card_yellow') {
            const p = team.roster.find(x => x.name === e.playerName);
            if (p) matchYellows[p.id] = (matchYellows[p.id] || 0) + 1;
          } else if (e.type === 'card_red') {
            const p = team.roster.find(x => x.name === e.playerName);
            if (p) matchReds[p.id] = (matchReds[p.id] || 0) + 1;
          } else if (e.type === 'injury') {
            // Injury events from match engine (if any)
            const p = team.roster.find(x => x.name === e.playerName);
            if (p) {
              // Determine severity randomly if not provided
              const r = Math.random();
              const type = r > 0.8 ? 'GRAVE' : r > 0.4 ? 'MEDIA' : 'LEVE';
              const duration = type === 'GRAVE' ? 4 + Math.floor(Math.random() * 4) : type === 'MEDIA' ? 2 + Math.floor(Math.random() * 2) : 1;
              matchInjuries[p.id] = { type, duration, name: 'Lesão de Jogo' };
            }
          }
        });
      }
      // Se for jogo de IA (ou o oponente do usuário), simulamos os artilheiros + lesões sistêmicas
      else {
        // Distribui os gols aleatoriamente entre ATA (60%), MEI (30%), OUTROS (10%)
        for (let i = 0; i < score; i++) {
          const bag: Player[] = [];
          // Pesos simples baseados na posição
          team.roster.forEach(p => {
            const weight = p.position === 'ATA' ? 6 : p.position === 'MEI' ? 3 : 1;
            if (p.status !== 'suspended' && p.status !== 'injured') {
              for (let k = 0; k < weight; k++) bag.push(p);
            }
          });
          if (bag.length > 0) {
            const scorer = bag[Math.floor(Math.random() * bag.length)];
            matchGoals[scorer.id] = (matchGoals[scorer.id] || 0) + 1;
          }
        }

        // Simular cartões para IA (leve chance)
        team.roster.forEach(p => {
          if (p.status === 'suspended' || p.status === 'injured') return;
          if (Math.random() < 0.05) matchYellows[p.id] = (matchYellows[p.id] || 0) + 1;
          else if (Math.random() < 0.005) matchReds[p.id] = (matchReds[p.id] || 0) + 1;
        });
      }

      // Checagem de Lesão Sistêmica (Pós-Jogo para todos que jogaram)
      // Acontece para todos os times
      team.roster.forEach(p => {
        if (p.status === 'suspended' || p.status === 'injured') return;

        // Se jogou (estava na lineup ou entrou) - AQUI SIMPLIFICADO: assumimos que lineup inicial jogou
        // Para melhorar, precisaria saber quem jogou de fato.
        // Vamos assumir risco para quem está na lineup
        if (team.lineup.includes(p.id)) {
          let risk = 0.005; // 0.5% base
          if (p.energy < 70) risk += 0.02; // +2% se cansado
          // Se posição improvisada (não checado aqui facilmente), risk += ...

          if (Math.random() < risk) {
            const r = Math.random();
            const type = r > 0.85 ? 'GRAVE' : r > 0.5 ? 'MEDIA' : 'LEVE';
            const duration = type === 'GRAVE' ? 4 + Math.floor(Math.random() * 4) : type === 'MEDIA' ? 2 + Math.floor(Math.random() * 2) : 1;
            matchInjuries[p.id] = { type, duration, name: 'Lesão Muscular' };
          }
        }
      });
    };

    fixtures.forEach(fix => {
      if (fix.round === currentRound) {
        // Encontrar times (usando state atual teams para ler dados base)
        const hTeamRef = teams.find(t => t.id === fix.homeTeamId)!;
        const aTeamRef = teams.find(t => t.id === fix.awayTeamId)!;

        const isUserMatch = fix.homeTeamId === userTeamId || fix.awayTeamId === userTeamId;

        let hScore = 0;
        let aScore = 0;

        if (isUserMatch) {
          hScore = fix.homeTeamId === userTeamId ? userGoals : opponentGoals;
          aScore = fix.homeTeamId === userTeamId ? opponentGoals : userGoals;
        } else {
          // SIMULAÇÃO REALISTA DA IA
          // 1. Base Stats
          const hAtt = hTeamRef.attack;
          const hDef = hTeamRef.defense;
          const aAtt = aTeamRef.attack;
          const aDef = aTeamRef.defense;

          // 2. Fatores
          const homeAdvantage = 5; // +5 points efetivos
          const isRivalry = hTeamRef.rivalId === aTeamRef.id || aTeamRef.rivalId === hTeamRef.id;
          const tension = isRivalry ? 1.5 : 1.0; // Derbies have higher variance and cards

          // 3. Força efetiva (0 a 100+)
          const hPower = hAtt - aDef + homeAdvantage + (Math.random() * 20 - 10) * tension;
          const aPower = aAtt - hDef + (Math.random() * 20 - 10) * tension;

          // 4. Conversão em gols (Poisson-ish approach simplificado)
          // Base goal expectance: 1.25 per team
          // Delta power: cada 10 pontos de diferença = +/- 0.5 gols
          const baseGoals = 1.25;
          let hExpected = Math.max(0, baseGoals + (hPower * 0.05));
          let aExpected = Math.max(0, baseGoals + (aPower * 0.05));

          // APPLY DDA: If user is the away team, home AI gets buffed by ddaFactor.
          // If user is home team, away AI gets buffed by ddaFactor.
          if (fix.homeTeamId === userTeamId) {
            aExpected *= ddaFactor;
          } else if (fix.awayTeamId === userTeamId) {
            hExpected *= ddaFactor;
          }

          // Função para gerar gols com base na expect
          const simulateGoals = (expect: number) => {
            let g = 0;
            // Tenta marcar gols em 5 eventos "chave"
            for (let i = 0; i < 5; i++) {
              if (Math.random() < (expect / 5)) g++;
            }
            return g;
          };

          hScore = simulateGoals(hExpected);
          aScore = simulateGoals(aExpected);
        }

        // Processar artilharia e stats
        helperUpdateStats(hTeamRef, true, hScore, isUserMatch);
        helperUpdateStats(aTeamRef, false, aScore, isUserMatch);

        // Atualizar revenue se for time da casa
        if (fix.homeTeamId === userTeamId) {
          const demand = clamp(0.25 + (hTeamRef.moral / 200) - (ticketPrice - DEFAULT_TICKET_PRICE) / 250, 0.2, 0.95);
          roundRevenue = Math.floor(hTeamRef.stadiumCapacity * demand * ticketPrice);
        }

        // Histórico
        roundResults.push({
          round: currentRound,
          homeTeamName: hTeamRef.name,
          awayTeamName: aTeamRef.name,
          homeScore: hScore,
          awayScore: aScore,
          isUserMatch,
          events: isUserMatch ? events : undefined
        });
      }
    });

    // --- RECALCULATE DDA FACTOR ---
    // Look at last 5 user matches in history
    const recentMatches = [...matchHistory, ...roundResults]
      .filter(m => m.isUserMatch)
      .slice(-5);

    let wins = 0;
    let losses = 0;
    recentMatches.forEach(m => {
      const isHome = m.homeTeamName === userTeam.name;
      const userScored = isHome ? m.homeScore : m.awayScore;
      const opponentScored = isHome ? m.awayScore : m.homeScore;
      if (userScored > opponentScored) wins++;
      else if (userScored < opponentScored) losses++;
    });

    // DDA Rule:
    // 5 wins -> +0.20 (1.20)
    // 4 wins -> +0.10 (1.10)
    // 3 wins -> +0.05 (1.05)
    // 3 losses -> -0.05 (0.95)
    // 4 losses -> -0.10 (0.90)
    // 5 losses -> -0.20 (0.80)
    let newDda = 1.0;
    if (wins === 5) newDda = 1.20;
    else if (wins === 4) newDda = 1.12;
    else if (wins === 3) newDda = 1.06;
    else if (losses === 3) newDda = 0.94;
    else if (losses === 4) newDda = 0.88;
    else if (losses === 5) newDda = 0.80;
    setDdaFactor(newDda);

    // Atualizar स्टेट 'teams' e 'playerStats' de uma só vez
    const newTeams = teams.map(team => {
      // Atualiza stats do time com base nos resultados da rodada
      const match = roundResults.find(m => m.homeTeamName === team.name || m.awayTeamName === team.name);
      if (!match) return team; // não jogou nesta rodada (tabela impar?)

      const isHome = match.homeTeamName === team.name;
      const goalsFor = isHome ? match.homeScore : match.awayScore;
      const goalsAgainst = isHome ? match.awayScore : match.homeScore;

      let newPoints = team.points;
      let newWon = team.won;
      let newDrawn = team.drawn;
      let newLost = team.lost;
      let newMoral = team.moral;

      if (goalsFor > goalsAgainst) {
        newWon++; newPoints += 3; newMoral = Math.min(100, newMoral + 5);
      } else if (goalsFor === goalsAgainst) {
        newDrawn++; newPoints += 1;
      } else {
        newLost++; newMoral = Math.max(0, newMoral - 5);
      }

      // Atualizar Roster (Jogadores)
      const newRoster = team.roster.map(p => {
        const g = matchGoals[p.id] || 0;
        const a = matchAssists[p.id] || 0;
        const y = matchYellows[p.id] || 0;
        const r = matchReds[p.id] || 0;
        const injury = matchInjuries[p.id];

        // Atualizar 'playerStats' global também para o ranking
        if (g > 0 || a > 0 || match) { // se jogou ou fez algo
          if (!updatedPlayerStats[p.id]) {
            updatedPlayerStats[p.id] = { games: 0, minutes: 0, goals: 0, assists: 0, motm: 0, ratingSum: 0, lastRatings: [] };
          }
          const s = updatedPlayerStats[p.id];
          s.games += 1;
          s.goals += g;
          s.assists += a;
          // Nota simulada para todos
          const base = 6.0 + (g * 1.0) + (a * 0.5) + (Math.random());
          s.ratingSum += base;
        }

        // Atualizar Histórico (Bio)
        const newHistory = [...(p.history || [])];
        if (g > 0 && match && (match.homeTeamName === team.name ? match.homeScore > match.awayScore : match.awayScore > match.homeScore)) {
          // Gol em vitória (simplificado para "Decisivo" se diferença for 1 gol)
          // Melhoria: checar se foi contra rival
          const isRival = team.rivalId && (match.homeTeamName === team.name ? match.awayTeamName : match.homeTeamName); // Rival logic needs team lookup, kept simple for now
          if (Math.random() > 0.8) { // 20% chance de ser considerado "Marcante" para não spammar
            newHistory.unshift({
              id: Math.random().toString(36),
              round: currentRound,
              season,
              type: 'GOAL',
              description: `Marcou gol na vitória contra ${match.homeTeamName === team.name ? match.awayTeamName : match.homeTeamName}`
            });
          }
        }

        // Processar Amarelos e Suspensão
        const newYellows = p.yellowCards + y;
        const newReds = p.redCards + r;
        let isSuspended = p.matchesSuspended > 0; // Já estava suspenso?
        let matchesSuspended = p.matchesSuspended;

        // Decrementar suspensão cumprida
        if (matchesSuspended > 0) {
          matchesSuspended--;
          if (matchesSuspended <= 0) {
            isSuspended = false;
            matchesSuspended = 0;
          }
        }

        // Checar Novas Suspensões
        if (r > 0) {
          isSuspended = true;
          matchesSuspended = 1; // Vermelho direto = 1 jogo (ou 2 se grave, deixamos 1 por enquanto)
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'RED_CARD',
            description: 'Expulso de campo',
            icon: '🟥'
          });
        } else if (y > 0 && newYellows % 3 === 0) {
          isSuspended = true;
          matchesSuspended = 1;
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'YELLOW_CARD',
            description: `Suspenso pelo 3º cartão amarelo`,
            icon: '🟨'
          });
        }

        // Processar Lesões
        let newStatus: Player['status'] = p.status;
        let newInjuryDuration = p.injuryDuration || 0;
        let newInjuryType = p.injuryType;

        // Recuperação
        if (newStatus === 'injured') {
          newInjuryDuration--;
          if (newInjuryDuration <= 0) {
            newStatus = 'fit';
            newInjuryDuration = 0;
            newInjuryType = undefined;
            newHistory.unshift({
              id: Math.random().toString(36),
              round: currentRound,
              season,
              type: 'INJURY',
              description: 'Recuperado de lesão',
              icon: '✨'
            });
          }
        }

        // Nova Lesão
        if (injury) {
          newStatus = 'injured';
          newInjuryDuration = injury.duration;
          newInjuryType = injury.type;
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'INJURY',
            description: `Lesão (${injury.type.toLowerCase()}) - Fora por ${injury.duration} jogos`,
            icon: '🤕'
          });
          toast.error(`${p.name}: ${injury.name} (${injury.duration} jogos)`, { icon: '🚑' });
        }

        if (isSuspended) newStatus = 'suspended';

        return {
          ...p,
          goals: p.goals + g,
          assists: p.assists + a,
          yellowCards: newYellows,
          redCards: newReds,
          isSuspended,
          seasonStats: {
            yellowCards: newYellows,
            redCards: newReds,
            matchesSuspended: matchesSuspended
          },
          matchesSuspended,
          status: newStatus,
          injuryDuration: newInjuryDuration,
          injuryType: newInjuryType,
          history: newHistory
        };
      });

      return {
        ...team,
        played: team.played + 1,
        won: newWon,
        drawn: newDrawn,
        lost: newLost,
        gf: team.gf + goalsFor,
        ga: team.ga + goalsAgainst,
        points: newPoints,
        moral: newMoral,
        roster: newRoster
      };
    });

    // Finalizar
    const wageCost = (userTeam?.roster.length || 0) * 1500;
    const finalFunds = funds + roundRevenue - wageCost;

    setFunds(finalFunds);
    setTeams(newTeams);
    setPlayerStats(updatedPlayerStats);
    setMatchHistory(prev => [...roundResults, ...prev]);

    // Lógica de Transferências da IA (Simulação de Mercado Vivo)
    // Acontece nas janelas (Rodadas 1-5 e 10-14)
    if (isWindowOpen && currentRound !== 18) {
      const aiTeams = newTeams.filter(t => t.id !== userTeamId);

      // Tenta realizar 1 ou 2 transferências aleatórias entre IAs
      const numTransfers = Math.random() > 0.6 ? 2 : 1;

      for (let i = 0; i < numTransfers; i++) {
        const seller = aiTeams[Math.floor(Math.random() * aiTeams.length)];
        if (seller.roster.length > 18) {
          // Escolhe um jogador destaque para vender
          const player = seller.roster.sort((a, b) => b.overall - a.overall)[Math.floor(Math.random() * 5)];

          // Escolhe um comprador mais rico ou de mesma divisão
          const potentialBuyers = aiTeams.filter(t => t.id !== seller.id && (t.moral > 50 || t.division === 1));

          if (potentialBuyers.length > 0 && player) {
            const buyer = potentialBuyers[Math.floor(Math.random() * potentialBuyers.length)];

            // Realiza a transferência
            seller.roster = seller.roster.filter(p => p.id !== player.id);
            buyer.roster.push(player);

            // Gera notícia sobre a transferência
            const newsTitle = `Mercado: ${player.name} muda de ares`;
            const newsBody = `O ${buyer.shortName} anunciou a contratação de ${player.name} (OVR ${player.overall}) do ${seller.shortName}. A negociação agita o mercado local.`;

            setNews(prev => [{
              id: Math.random().toString(36),
              round: currentRound,
              title: newsTitle,
              body: newsBody,
              category: 'MARKET',
              isRead: false
            }, ...prev]);
          }
        }
      }
    }

    if (finalFunds < -500000) {
      setGameOverReason("O clube entrou em colapso financeiro. A diretoria não aceita mais as suas dívidas.");
      setCurrentScreen('GAME_OVER');
      return;
    }

    // Pagar Salário do Treinador (R$ 1.500 por jogo)
    if (coach) {
      setCoach(prev => prev ? { ...prev, personalFunds: prev.personalFunds + 1500 } : null);
    }

    const nextR = currentRound + 1;
    if (nextR > 38) {
      setCurrentScreen('CHAMPION');
    } else {
      setCurrentRound(nextR);
      generateRoundNews(nextR);
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleNextSeason = () => {
    // 1. Calcular Classificação Final
    const standingsA = [...teams].filter(t => t.division === 1).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
    const standingsB = [...teams].filter(t => t.division === 2).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));

    const relegatedIds = standingsA.slice(-4).map(t => t.id);
    const promotedIds = standingsB.slice(0, 4).map(t => t.id);

    // 1.5 Gravar Histórico
    const champion = standingsA[0];
    const runnerUp = standingsA[1];

    // Encontrar artilheiro global na marra
    let topScorer = { name: 'Ninguém', goals: 0, teamShort: '-' };
    let maxG = -1;

    teams.forEach(t => {
      t.roster.forEach(p => {
        if (p.goals > maxG) {
          maxG = p.goals;
          topScorer = { name: p.name, goals: p.goals, teamShort: t.shortName };
        }
      });
    });

    const userPos = standingsA.findIndex(t => t.id === userTeamId);
    const userPosB = standingsB.findIndex(t => t.id === userTeamId);
    let finalPos = userPos !== -1 ? userPos + 1 : (userPosB !== -1 ? userPosB + 1 : 0);

    const historyEntry: SeasonHistory = {
      year: season,
      championId: champion.id,
      championName: champion.name,
      runnerUpId: runnerUp.id,
      runnerUpName: runnerUp.name,
      userFinishPosition: finalPos,
      userDivision: userTeam?.division || 1,
      topScorer
    };

    setPastSeasons(prev => [...prev, historyEntry]);

    // 2. Atualizar Times (Promoção/Rebaixamento, Idade, Evolução e Reset)
    const updatedTeams = teams.map(team => {
      let newDiv = team.division;
      if (relegatedIds.includes(team.id)) newDiv = 2;
      if (promotedIds.includes(team.id)) newDiv = 1;

      const updatedRoster = team.roster.map(player => {
        const isYoung = player.age < 23;
        const isOld = player.age > 30;
        let ovrChange = 0;

        if (isYoung && Math.random() > 0.4) ovrChange = Math.floor(Math.random() * 3);
        else if (isOld && Math.random() > 0.5) ovrChange = -Math.floor(Math.random() * 2);

        // Arquivar histórico
        const history: PlayerHistoryEvent[] = [...(player.history || [])]; // keep existing

        // Add summary of the season
        if (player.goals > 0 || player.assists > 0) {
          history.unshift({
            id: Math.random().toString(36),
            round: 38,
            season,
            type: 'AWARD',
            description: `Temporada ${season}: ${player.goals} gols, ${player.assists} assistências`,
            icon: '📊'
          });
        }

        return {
          ...player,
          age: player.age + 1,
          overall: Math.min(99, Math.max(40, player.overall + ovrChange)),
          goals: 0,
          assists: 0,
          energy: 100,
          yellowCards: 0,
          redCards: 0,
          matchesSuspended: 0,
          isSuspended: false,
          status: 'fit',
          seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
          history
        };
      });

      return {
        ...team,
        division: newDiv,
        played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
        roster: updatedRoster,
        moral: 70 // Reset de moral para nova temporada
      };
    });

    setTeams(updatedTeams);
    setSeason(s => s + 1);
    setCurrentRound(1);
    setMatchHistory([]);
    setFixtures(generateSchedule(updatedTeams));
    setCurrentScreen('DASHBOARD');
    toast.success(`Temporada ${season + 1} iniciada!`, { icon: '🗓️' });
  };

  const handleRestart = () => {
    setTeams(INITIAL_TEAMS);
    setCurrentRound(1);
    setSeason(2026);
    setFunds(1200000);
    setMatchHistory([]);
    setNews([]);
    setCurrentScreen('SPLASH');
  };

  const getChampion = () => {
    const div1 = teams.filter(t => t.division === 1).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga))[0];
    return div1;
  };

  const handleFixData = () => {
    const freeAgentTeam = INITIAL_TEAMS.find(t => t.id === 'free_agent');
    if (freeAgentTeam) {
      // Check if already exists
      const exists = teams.some(t => t.id === 'free_agent');
      if (!exists) {
        setTeams(prev => [...prev, freeAgentTeam]);
        toast.success("Dados corrigidos! Time 'Sem Clube' adicionado.");
      } else {
        // Force update roster if needed (optional)
        toast.success("Dados parecem corretos. Verifique o Mercado.");
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleContractRenewal = (playerId: string) => {
    if (!userTeam) return;
    const cost = 50000; // Custo fixo por renovação

    if (funds < cost) {
      toast.error("Fundos insuficientes para renovar.");
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id !== userTeamId) return t;
      return {
        ...t,
        roster: t.roster.map(p => {
          if (p.id !== playerId) return p;

          // Add History Event
          const newHistory = [...(p.history || [])];
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'CONTRACT',
            description: 'Renovou contrato por mais 38 rodadas.',
            icon: '✍️'
          });

          return {
            ...p,
            contractRounds: p.contractRounds + 38,
            history: newHistory
          };
        })
      };
    }));

    setFunds(f => f - cost);
    toast.success("Contrato renovado!", { icon: '✍️' });
  };

  const handleBuyPlayer = (player: Player, fromTeamId: string, cost: number) => {
    if (funds < cost) {
      toast.error("Fundos insuficientes.");
      return;
    }

    // Add History Event
    const transferEvent: PlayerHistoryEvent = {
      id: Math.random().toString(36),
      round: currentRound,
      season,
      type: 'TRANSFER',
      description: `Contratado por ${formatCurrency(cost)}`,
      icon: '🤝'
    };

    setTeams(prev => prev.map(t => {
      // Remove from seller
      if (t.id === fromTeamId) {
        return { ...t, roster: t.roster.filter(p => p.id !== player.id) };
      }
      // Add to buyer (User)
      if (t.id === userTeamId) {
        const p = { ...player, history: [transferEvent, ...(player.history || [])] };
        return { ...t, roster: [...t.roster, p] };
      }
      return t;
    }));

    setFunds(f => f - cost);
    toast.success(`${player.name} contratado!`);
    setCurrentScreen('DASHBOARD');
  };

  const handleTacticsSave = (f: any, s: any, l: any) => {
    setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, formation: f, style: s, lineup: l } : t));
    setCurrentScreen(lastScreen); // Return to previous screen (Dashboard or PreMatch)
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" />

      {currentScreen === 'SPLASH' && (
        <SplashScreen
          onStart={() => {
            // Nova carreira
            setTeams(INITIAL_TEAMS);
            setFixtures(generateSchedule(INITIAL_TEAMS));
            setMatchHistory([]);
            setNews([]);
            setNews([]);
            setPlayerStats({});
            setPastSeasons([]);
            setTicketPrice(DEFAULT_TICKET_PRICE);
            setFunds(1200000);
            setSeason(2026);
            setCurrentRound(1);
            setUserTeamId(null);
            setCoach(null);
            setCurrentScreen('COACH_SETUP');
          }}
          onContinue={() => {
            const s = readSlot(1);
            if (s) applySave(s);
            else toast.error('Nenhum save encontrado.');
          }}
          hasSave={hasAnySave}
        />
      )}
      {currentScreen === 'COACH_SETUP' && (
        <CoachSetupScreen
          onComplete={(newCoach) => {
            setCoach(newCoach);
            setCurrentScreen('TEAM_SELECT');
            toast.success(`Bem-vindo, Professor ${newCoach.name}!`);
          }}
          onBack={() => setCurrentScreen('SPLASH')}
        />
      )}
      {currentScreen === 'TEAM_SELECT' && (
        <TeamSelectionScreen
          teams={teams}
          onSelect={(id) => {
            setUserTeamId(id);
            setFixtures(generateSchedule(teams));
            generateRoundNews(1);
            setCurrentScreen('DASHBOARD');
            setLastScreen('DASHBOARD');
            // salva imediatamente no slot 1
            try { writeSlot(1, buildSave()); } catch { }
          }}
          onBack={() => setCurrentScreen('SPLASH')}
        />
      )}

      {userTeam && currentScreen === 'DASHBOARD' && (
        <DashboardScreen
          team={userTeam} nextOpponent={nextOpponent || teams[0]} standings={teams} round={currentRound} funds={funds} onboardingComplete={true} isWindowOpen={isWindowOpen} news={news}
          onCompleteOnboarding={() => { }}
          onOpenSquad={() => setCurrentScreen('SQUAD')}
          onOpenMarket={() => setCurrentScreen('MARKET')}
          onOpenFinance={() => setCurrentScreen('FINANCE')}
          onOpenCalendar={() => setCurrentScreen('CALENDAR')}
          onOpenLeague={() => setCurrentScreen('LEAGUE')}
          onOpenStats={() => setCurrentScreen('STATS')}
          onOpenNews={() => setCurrentScreen('NEWS')}
          onOpenSettings={() => setCurrentScreen('SETTINGS')}
          onSimulate={() => setCurrentScreen('PRE_MATCH')}
          onOpenTactics={() => { setLastScreen('DASHBOARD'); setCurrentScreen('TACTICS'); }}
          onOpenProfile={() => setCurrentScreen('PROFILE')}
        />
      )}

      {hasSeenOnboarding === false && currentScreen === 'DASHBOARD' && (
        <OnboardingModal onComplete={() => setHasSeenOnboarding(true)} />
      )}

      {userTeam && nextOpponent && currentScreen === 'PRE_MATCH' && (
        <PreMatchScreen
          userTeam={userTeam}
          opponent={nextOpponent}
          onBack={() => setCurrentScreen('DASHBOARD')}
          onTactics={() => { setLastScreen('PRE_MATCH'); setCurrentScreen('TACTICS'); }}
          onSquad={() => { setLastScreen('PRE_MATCH'); setCurrentScreen('SQUAD'); }}
          onStartMatch={() => setCurrentScreen('MATCH')}
        />
      )}

      {userTeam && currentScreen === 'MATCH' && nextOpponent && <MatchScreen homeTeam={userTeam} awayTeam={nextOpponent} round={currentRound} ddaFactor={ddaFactor} onFinish={handleMatchFinished} />}
      {currentScreen === 'NEWS' && <NewsScreen news={news} onBack={() => setCurrentScreen('DASHBOARD')} onRead={(id) => setNews(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))} onChoice={handleNewsChoice} />}
      {currentScreen === 'STATS' && (
        <StatsScreen
          teams={teams}
          season={season}
          round={currentRound}
          playerStats={playerStats}
          onBack={() => setCurrentScreen('DASHBOARD')}
        />
      )}
      {currentScreen === 'LEAGUE' && <LeagueScreen teams={teams} userTeamId={userTeamId} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'SQUAD' && userTeam && <SquadScreen team={userTeam} onBack={() => setCurrentScreen(lastScreen)} onRenew={handleContractRenewal} />}
      {currentScreen === 'TACTICS' && userTeam && <TacticsScreen team={userTeam} onBack={() => setCurrentScreen(lastScreen)} onSave={handleTacticsSave} />}
      {currentScreen === 'PROFILE' && (
        coach ? (
          <CoachProfileScreen
            coach={coach}
            onBack={() => setCurrentScreen('DASHBOARD')}
            onUpdateCoach={(c) => setCoach(c)}
          />
        ) : (
          <CoachSetupScreen
            onComplete={(newCoach) => {
              setCoach(newCoach);
              // Save immediately to persist the new coach
              try {
                const save = buildSave();
                save.coach = newCoach;
                writeSlot(1, save); // Assuming activeSlot is 1 for consistency
              } catch { }
              toast.success(`Perfil criado! Bem-vindo, ${newCoach.name}.`);
            }}
            onBack={() => setCurrentScreen('DASHBOARD')}
          />
        )
      )}
      {currentScreen === 'FINANCE' && userTeam && (
        <FinanceScreen
          team={userTeam}
          funds={funds}
          ticketPrice={ticketPrice}
          onUpdateTicketPrice={(p) => setTicketPrice(clamp(p, 10, 200))}
          onBack={() => setCurrentScreen('DASHBOARD')}
          onLoan={(amt) => setFunds(f => f + amt)}
          onExpandStadium={() => {
            setTeams(prev => prev.map(t => t.id === userTeam.id ? { ...t, stadiumCapacity: t.stadiumCapacity + 3000 } : t));
            setFunds(f => f - 250000);
            toast.success('Estádio ampliado!', { icon: '🏟️' });
          }}
        />
      )}
      {currentScreen === 'MARKET' && userTeam && <MarketScreen userTeam={userTeam} allTeams={teams} funds={funds} isWindowOpen={isWindowOpen} offers={[]} logs={[]} onBack={() => setCurrentScreen('DASHBOARD')} onBuy={handleBuyPlayer} onLoanPlayer={() => { }} onSell={() => { }} onAcceptOffer={() => { }} onDeclineOffer={() => { }} />}
      {currentScreen === 'SETTINGS' && (
        <SettingsScreen
          onBack={() => setCurrentScreen('DASHBOARD')}
          onSaveToSlot={saveToSlot}
          onLoadFromSlot={loadFromSlot}
          onClearSlot={clearSlot}
          onExport={exportCurrentSave}
          onImportFile={importSaveFromFile}
          onReset={handleRestart}
          session={null}
          onLoadCloud={() => { }}
          onFixData={handleFixData}
        />
      )}
      {currentScreen === 'GAME_OVER' && <GameOverScreen reason={gameOverReason} onRestart={handleRestart} />}
      {currentScreen === 'CHAMPION' && userTeam && <ChampionScreen champion={getChampion()} userTeam={userTeam} onNewSeason={handleNextSeason} onQuit={handleRestart} teams={teams} pastSeasons={pastSeasons} />}
    </div>
  );
}
